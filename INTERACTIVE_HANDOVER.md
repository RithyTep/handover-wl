# 📝 Interactive Handover Guide

Fill in Status and Action for each ticket, save them, and post to Slack!

---

## 🚀 **Quick Start**

Just run:
```bash
handover
```

---

## 🎯 **How It Works**

### **Step 1: Choose Mode**

When you run `handover`, you'll see:

```
1) Enter status/action for each ticket individually
2) Quick fill all tickets with same values
3) Use previous values and post to Slack
4) Exit without posting
```

---

### **Option 1: Individual Input** (Most Control)

Best for: When each ticket needs different status/action

```
1. TCP-84057: WE368 [20158] - Bank information confirming
   Previous Status: --
   Previous Action: --
   New Status [--]: In Progress
   New Action [--]: Checking with team

2. TCP-84365: Saffaluck [20154] - GA4 privacy request
   Previous Status: --
   Previous Action: --
   New Status [--]: Done
   New Action [--]: Completed yesterday
```

Just type the new value or press Enter to keep previous.

---

### **Option 2: Quick Fill** (Fast)

Best for: When all tickets have same status/action

```
Status for all tickets: Pending Review
Action for all tickets: Will check tomorrow
```

All 13 tickets get the same values instantly!

---

### **Option 3: Use Saved** (Fastest)

Best for: Reposting with same values

Uses whatever you saved last time - no typing needed!

---

## 💾 **Data Storage**

All your inputs are saved to: `ticket_data.json`

Next time you run `handover`, it remembers:
- Previous Status for each ticket
- Previous Action for each ticket
- When it was updated

You can just press Enter to keep old values!

---

## 📋 **Example Workflow**

### **Morning Handover:**

```bash
$ handover

Found 13 tickets

Choose: 2 (Quick fill all)
Status for all tickets: Pending
Action for all tickets: Will review today

Post to Slack? y

✅ Posted to Slack!
```

**Result in Slack:**
```
--- Ticket 1 ---
Ticket Link: TCP-84057 WE368 [20158] - Bank information confirming
Status: Pending
Action: Will review today

--- Ticket 2 ---
...
```

---

### **Update Individual Tickets:**

```bash
$ handover

Found 13 tickets

Choose: 1 (Individual)

1. TCP-84057: ...
   Previous Status: Pending
   Previous Action: Will review today
   New Status [Pending]: In Progress
   New Action [Will review today]: Checking with bank

2. TCP-84365: ...
   Previous Status: Pending
   Previous Action: Will review today
   New Status [Pending]: Done
   New Action [Will review today]: Completed

3. TCP-84845: ...
   Previous Status: Pending
   Previous Action: Will review today
   New Status [Pending]: (press Enter to keep)
   New Action [Will review today]: (press Enter to keep)
```

Only update what changed, keep the rest!

---

### **Repost Without Changes:**

```bash
$ handover

Choose: 3 (Use saved)

Post to Slack? y

✅ Posted!
```

---

## 🎨 **Customization**

Edit `handover_interactive.py` to change:

### Default Status/Action:
Line ~139:
```python
prev_status = prev_data.get('status', '--')  # Change '--' to your default
prev_action = prev_data.get('action', '--')  # Change '--' to your default
```

### Add more fields:
You can add "Priority", "Assignee", etc. by extending the data structure.

---

## 📊 **View Saved Data**

To see what's saved:

```bash
cat /Users/rithytep/jira-slack-integration/ticket_data.json
```

Or open in editor:
```bash
nano ticket_data.json
```

**Format:**
```json
{
  "TCP-84057": {
    "status": "In Progress",
    "action": "Checking with team",
    "summary": "WE368 [20158] - Bank information confirming",
    "updated_at": "2025-11-10T15:30:00.000000"
  },
  "TCP-84365": {
    "status": "Done",
    "action": "Completed yesterday",
    ...
  }
}
```

---

## 🔄 **Two Commands Available**

### `handover` (Interactive)
- Input Status and Action
- Saves values
- Posts to Slack

### `handover-quick` (Non-interactive)
- Uses Status: `--`, Action: `--`
- No input needed
- Just posts immediately

---

## 💡 **Pro Tips**

### Tip 1: Keep Previous Values
Just press **Enter** to keep old values - super fast for tickets that haven't changed!

### Tip 2: Quick Fill for Initial Setup
Use Option 2 to set all tickets to "Pending" first, then update individually.

### Tip 3: Regular Updates
Run `handover` daily and update only what changed.

### Tip 4: Backup Your Data
```bash
cp ticket_data.json ticket_data_backup.json
```

### Tip 5: Reset All
To start fresh:
```bash
rm ticket_data.json
```

---

## 🐛 **Troubleshooting**

### "No tickets found"
- Check Jira connection: `python3 test_connection.py`
- Verify JQL query in script

### "Error posting to Slack"
- Check SLACK_WEBHOOK_URL in `.env`
- Test webhook manually

### "Previous values not loading"
- Check if `ticket_data.json` exists
- Verify JSON format is valid

### Want to edit data manually?
```bash
nano ticket_data.json
```

---

## ✅ **Quick Reference**

| Command | What It Does |
|---------|--------------|
| `handover` | Interactive - input values |
| `handover-quick` | Quick - post with `--` |
| `cat ticket_data.json` | View saved data |
| `rm ticket_data.json` | Reset all data |

---

## 🎉 **Example Session**

```bash
$ handover

📥 Fetching tickets from Jira...
✅ Found 13 ticket(s)

Choose an option:
1) Enter status/action for each ticket individually
2) Quick fill all tickets with same values
3) Use previous values and post to Slack
4) Exit without posting

Enter your choice [1-4]: 2

⚡ Quick Fill All Tickets
Status for all tickets: Reviewing
Action for all tickets: Check tomorrow

💾 Saved ticket data!

Post to Slack? (y/n): y

📤 Posting to Slack...
✅ Posted to Slack successfully

✅ Done!
```

**Done! Your tickets are in Slack with your custom Status and Action!** 🚀

---

## 🔥 **Next Run:**

```bash
$ handover

Choose: 1 (Individual updates)

1. TCP-84057: ...
   Previous Status: Reviewing
   Previous Action: Check tomorrow
   New Status [Reviewing]: Done  ← Only update this one
   New Action [Check tomorrow]: Completed

2. TCP-84365: ...
   Previous Status: Reviewing
   Previous Action: Check tomorrow
   New Status [Reviewing]: ← Press Enter
   New Action [Check tomorrow]: ← Press Enter (keeps same)
```

Super fast updates! Only change what's different! ⚡
