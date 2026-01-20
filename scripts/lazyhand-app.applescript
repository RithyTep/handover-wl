on run
	set configDir to (POSIX path of (path to home folder)) & ".lazyhand"
	set configPath to configDir & "/app_path"

	set nodePath to ""
	try
		set nodePath to do shell script "command -v node"
	end try

	if nodePath is "" then
		try
			set nodePath to do shell script "ls -1 \"$HOME/.nvm/versions/node/\"*/bin/node 2>/dev/null | sort -V | tail -n 1"
		end try
	end if

	if nodePath is "" then
		display dialog "Node.js not found. Please install Node 20+ and try again." buttons {"OK"} default button "OK"
		return
	end if

	set appPath to "/Users/rithytep/SIDE PROJECT/jira-slack-integration"

	try
		do shell script "cd " & quoted form of appPath & " && nohup " & quoted form of nodePath & " scripts/lazyhand-ui.mjs >/tmp/lazyhand-ui.log 2>&1 &"
	on error
		display dialog "Failed to start Lazyhand UI. Check /tmp/lazyhand-ui.log." buttons {"OK"} default button "OK"
		return
	end try

	delay 0.6
	open location "http://127.0.0.1:3199"
end run
