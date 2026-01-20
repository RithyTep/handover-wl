#!/usr/bin/env python3
import json
import os
import subprocess
import sys
import tkinter as tk
from tkinter import ttk, messagebox

CONFIG_PATH = os.path.expanduser("~/.lazyhand_config.json")


def load_config():
	if not os.path.exists(CONFIG_PATH):
		return {}
	try:
		with open(CONFIG_PATH, "r", encoding="utf-8") as handle:
			return json.load(handle)
	except Exception:
		return {}


def save_config(data):
	with open(CONFIG_PATH, "w", encoding="utf-8") as handle:
		json.dump(data, handle, indent=2)


def repo_root():
	return os.path.abspath(os.path.dirname(__file__))


def setup_script_path():
	return os.path.join(repo_root(), "scripts", "setup-lazyhand-macos.sh")


def plist_path():
	return os.path.expanduser("~/Library/LaunchAgents/com.handover.lazyhand.plist")


class LazyhandApp(tk.Tk):
	def __init__(self):
		super().__init__()
		self.title("Lazyhand Scheduler")
		self.geometry("520x420")
		self.resizable(False, False)

		self.config_data = load_config()

		self.app_url_var = tk.StringVar(value=self.config_data.get("app_url", "https://handover-production.rithytep.online"))
		self.token_var = tk.StringVar(value=self.config_data.get("token", ""))
		self.channel_var = tk.StringVar(value=self.config_data.get("channel_id", ""))
		self.mentions_var = tk.StringVar(value=self.config_data.get("mentions", ""))
		self.preset_var = tk.StringVar(value=self.config_data.get("preset", "day"))
		self.hour_var = tk.StringVar(value=self.config_data.get("hour", "21"))
		self.minute_var = tk.StringVar(value=self.config_data.get("minute", "8"))

		self.status_var = tk.StringVar(value="Ready.")

		self.build_ui()

	def build_ui(self):
		padding = {"padx": 12, "pady": 6}

		ttk.Label(self, text="Lazyhand Scheduler (macOS)", font=("Helvetica", 14, "bold")).pack(pady=10)

		form = ttk.Frame(self)
		form.pack(fill="x", padx=12)

		self.add_field(form, "App URL", self.app_url_var, 0)
		self.add_field(form, "Slack User Token", self.token_var, 1, show="*")
		self.add_field(form, "Slack Channel ID", self.channel_var, 2)
		self.add_field(form, "Mentions (optional)", self.mentions_var, 3)

		ttk.Label(self, text="Schedule Preset").pack(anchor="w", **padding)
		preset_frame = ttk.Frame(self)
		preset_frame.pack(fill="x", padx=12)

		for value, label in [("off", "Off"), ("day", "Day (17:15)"), ("night", "Night (23:45)"), ("custom", "Custom")]:
			ttk.Radiobutton(preset_frame, text=label, variable=self.preset_var, value=value, command=self.on_preset_change).pack(anchor="w")

		custom_frame = ttk.Frame(self)
		custom_frame.pack(fill="x", padx=24, pady=4)
		ttk.Label(custom_frame, text="Hour").grid(row=0, column=0, sticky="w")
		ttk.Entry(custom_frame, textvariable=self.hour_var, width=5).grid(row=0, column=1, sticky="w", padx=(6, 18))
		ttk.Label(custom_frame, text="Minute").grid(row=0, column=2, sticky="w")
		ttk.Entry(custom_frame, textvariable=self.minute_var, width=5).grid(row=0, column=3, sticky="w", padx=(6, 0))

		buttons = ttk.Frame(self)
		buttons.pack(fill="x", padx=12, pady=12)

		ttk.Button(buttons, text="Apply Schedule", command=self.apply_schedule).pack(side="left", padx=4)
		ttk.Button(buttons, text="Stop Schedule", command=self.stop_schedule).pack(side="left", padx=4)

		ttk.Label(self, textvariable=self.status_var, foreground="#555").pack(anchor="w", padx=12, pady=10)

		self.on_preset_change()

	def add_field(self, parent, label, variable, row, show=None):
		ttk.Label(parent, text=label).grid(row=row, column=0, sticky="w", pady=6)
		entry = ttk.Entry(parent, textvariable=variable, width=52, show=show)
		entry.grid(row=row, column=1, sticky="w", pady=6)

	def on_preset_change(self):
		if self.preset_var.get() != "custom":
			self.hour_var.set(self.hour_var.get() or "21")
			self.minute_var.set(self.minute_var.get() or "8")

	def validate(self):
		if self.preset_var.get() == "off":
			return True
		if not self.app_url_var.get().strip():
			messagebox.showerror("Missing App URL", "Please enter the app URL.")
			return False
		if not self.token_var.get().strip():
			messagebox.showerror("Missing Token", "Please enter your Slack user token.")
			return False
		if not self.channel_var.get().strip():
			messagebox.showerror("Missing Channel", "Please enter the Slack channel ID.")
			return False
		if self.preset_var.get() == "custom":
			try:
				hour = int(self.hour_var.get())
				minute = int(self.minute_var.get())
				if hour < 0 or hour > 23 or minute < 0 or minute > 59:
					raise ValueError()
			except ValueError:
				messagebox.showerror("Invalid Time", "Enter a valid hour (0-23) and minute (0-59).")
				return False
		return True

	def apply_schedule(self):
		if not self.validate():
			return

		if self.preset_var.get() == "off":
			self.stop_schedule()
			return

		env = os.environ.copy()
		env["HANDOVER_APP_URL"] = self.app_url_var.get().strip()
		env["HANDOVER_SLACK_USER_TOKEN"] = self.token_var.get().strip()
		env["HANDOVER_SLACK_CHANNEL_ID"] = self.channel_var.get().strip()
		env["HANDOVER_SLACK_MENTIONS"] = self.mentions_var.get().strip()
		env["SCHEDULE_PRESET"] = self.preset_var.get()

		if self.preset_var.get() == "custom":
			env["SCHEDULE_HOUR"] = self.hour_var.get().strip()
			env["SCHEDULE_MINUTE"] = self.minute_var.get().strip()

		script = setup_script_path()
		if not os.path.exists(script):
			messagebox.showerror("Missing Script", f"Could not find {script}")
			return

		try:
			subprocess.run([script], check=True, env=env)
			self.status_var.set("Schedule applied.")
			self.persist()
		except subprocess.CalledProcessError as exc:
			self.status_var.set("Failed to apply schedule.")
			messagebox.showerror("Error", f"Setup failed: {exc}")

	def stop_schedule(self):
		try:
			subprocess.run(
				[
					"launchctl",
					"bootout",
					f"gui/{os.getuid()}",
					plist_path(),
				],
				check=False,
				stdout=subprocess.DEVNULL,
				stderr=subprocess.DEVNULL,
			)
			self.status_var.set("Schedule stopped.")
			self.preset_var.set("off")
			self.persist()
		except Exception as exc:
			self.status_var.set("Failed to stop schedule.")
			messagebox.showerror("Error", f"Stop failed: {exc}")

	def persist(self):
		self.config_data = {
			"app_url": self.app_url_var.get().strip(),
			"token": self.token_var.get().strip(),
			"channel_id": self.channel_var.get().strip(),
			"mentions": self.mentions_var.get().strip(),
			"preset": self.preset_var.get(),
			"hour": self.hour_var.get().strip(),
			"minute": self.minute_var.get().strip(),
		}
		save_config(self.config_data)


def main():
	if sys.platform != "darwin":
		print("This GUI is intended for macOS.", file=sys.stderr)
		sys.exit(1)

	app = LazyhandApp()
	app.mainloop()


if __name__ == "__main__":
	main()
