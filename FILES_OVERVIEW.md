# Files Overview

This directory contains everything you need for Jira-to-Slack integration.

## 📁 File Structure

```
jira-slack-integration/
│
├── 📄 Core Files
│   ├── jira_to_slack.py          # Main script - fetches Jira tickets and posts to Slack
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # Your configuration (create from .env.example)
│
├── 📄 Configuration
│   ├── .env.example             # Template for configuration
│   └── .gitignore              # Git ignore rules (keeps .env private)
│
├── 📄 Setup & Testing
│   ├── setup.sh                # Automated setup script
│   ├── test_connection.py      # Test Jira & Slack connections
│   └── scheduler.sh            # Schedule automation helper
│
├── 📄 Documentation
│   ├── README.md               # Full documentation
│   ├── QUICKSTART.md          # 5-minute quick start guide
│   └── FILES_OVERVIEW.md      # This file
│
└── 📁 .github/workflows/
    └── jira-to-slack.yml      # GitHub Actions workflow (cloud scheduling)
```

---

## 🚀 Which File Do I Use?

### First Time Setup

1. **Start here**: `setup.sh`
   - Automated setup wizard
   - Creates your .env file
   - Tests the connection

2. **OR Manual setup**:
   - Copy `.env.example` to `.env`
   - Edit `.env` with your credentials
   - Run `pip install -r requirements.txt`

### Testing

1. **Test connections**: `python3 test_connection.py`
   - Tests Jira API connection
   - Tests Slack webhook/bot connection
   - Sends test message to Slack

2. **Run once**: `python3 jira_to_slack.py`
   - Fetches real tickets
   - Posts to your Slack channel

### Scheduling / Automation

1. **Easy way**: `./scheduler.sh`
   - Interactive menu
   - Set up daily/hourly cron jobs
   - View/remove existing schedules

2. **Cloud way**: `.github/workflows/jira-to-slack.yml`
   - Push to GitHub
   - Runs automatically in the cloud
   - Free on public repos

### Reading / Learning

1. **Quick start**: `QUICKSTART.md`
   - 5-minute setup guide
   - Step-by-step instructions

2. **Full docs**: `README.md`
   - Complete documentation
   - Troubleshooting guide
   - Advanced features
   - Customization options

---

## 📝 File Descriptions

### jira_to_slack.py
**Purpose**: Main integration script

**What it does**:
- Connects to Jira API using your credentials
- Runs JQL query to fetch tickets
- Formats tickets in your preferred format
- Posts to Slack channel

**How to use**:
```bash
python3 jira_to_slack.py
```

**Customize**:
- Edit `JQL_QUERY` to change which tickets to fetch
- Edit `format_slack_blocks()` to change message format

---

### setup.sh
**Purpose**: Interactive setup wizard

**What it does**:
- Checks Python installation
- Installs dependencies
- Creates .env file with your credentials
- Tests the integration

**How to use**:
```bash
chmod +x setup.sh
./setup.sh
```

---

### test_connection.py
**Purpose**: Verify your configuration

**What it does**:
- Tests Jira API authentication
- Tests Slack webhook/bot connection
- Sends test messages
- Shows detailed error messages

**How to use**:
```bash
python3 test_connection.py
```

**Use when**:
- First time setup
- Troubleshooting connection issues
- Verifying credentials

---

### scheduler.sh
**Purpose**: Set up automation

**What it does**:
- Interactive menu for scheduling
- Creates cron jobs
- View/edit/remove schedules

**How to use**:
```bash
chmod +x scheduler.sh
./scheduler.sh
```

**Options**:
1. Run now (one-time)
2. Daily at 9 AM
3. Hourly
4. Custom schedule
5. View current jobs
6. Remove job

---

### .env.example
**Purpose**: Configuration template

**What it contains**:
- All required environment variables
- Example values
- Comments explaining each variable

**How to use**:
```bash
cp .env.example .env
nano .env  # Edit with your credentials
```

---

### .github/workflows/jira-to-slack.yml
**Purpose**: GitHub Actions workflow

**What it does**:
- Runs script in the cloud
- Scheduled automation (no server needed)
- Free for public repos

**How to use**:
1. Push code to GitHub
2. Add secrets in GitHub Settings
3. Script runs automatically

---

## 🎯 Common Workflows

### Initial Setup (First Time)

```bash
# Option 1: Automated
./setup.sh

# Option 2: Manual
cp .env.example .env
nano .env  # Edit credentials
pip install -r requirements.txt
python3 test_connection.py
python3 jira_to_slack.py
```

### Daily Usage (Already Set Up)

```bash
# Just run it
python3 jira_to_slack.py

# Or check logs (if scheduled)
tail -f jira_slack.log
```

### Troubleshooting

```bash
# Test connections
python3 test_connection.py

# Run with debug output
python3 -u jira_to_slack.py

# Check cron jobs
./scheduler.sh  # Option 5
```

---

## 🔧 Customization Guide

### Change Ticket Query

Edit `jira_to_slack.py`, line ~35:
```python
JQL_QUERY = """
project = YOUR_PROJECT
AND status = "In Progress"
"""
```

### Change Schedule

```bash
./scheduler.sh  # Option 4 for custom
```

Or edit crontab directly:
```bash
crontab -e
```

### Change Message Format

Edit `format_slack_blocks()` function in `jira_to_slack.py`

### Add More Channels

1. Get another webhook URL
2. Call `post_to_slack_webhook()` multiple times

---

## 📚 Need Help?

1. **Quick answers**: See `QUICKSTART.md`
2. **Detailed help**: See `README.md`
3. **Connection issues**: Run `test_connection.py`
4. **Setup issues**: Run `setup.sh` again

---

## ✅ Checklist

- [ ] Read QUICKSTART.md
- [ ] Run setup.sh OR create .env manually
- [ ] Run test_connection.py
- [ ] Test with: python3 jira_to_slack.py
- [ ] Set up scheduling with scheduler.sh
- [ ] Customize JQL query if needed

---

**You're ready to go! 🚀**

Start with `QUICKSTART.md` for the fastest setup!
