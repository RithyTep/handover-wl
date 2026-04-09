# LazyhandBar

macOS menu bar app for Jira ticket handover.

## Install

1. Open `LazyhandBar-1.0.0.dmg`
2. Drag **LazyhandBar** → **Applications**
3. **Fix "damaged" error** - run in Terminal:
   ```bash
   xattr -cr /Applications/LazyhandBar.app
   ```
4. Open from Applications

---

## Setup

1. Click **👋** in menu bar
2. Click **⚙️** gear icon
3. Enter: App URL, Token, Channel ID, Mentions
4. Click **Save Connection**
5. Set schedule time → Click **Apply Schedule**
6. Verify: ✅ "Schedule active" appears

---

## Get Slack Token

### Step 1: Create Slack App
1. Go to https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
3. Name: `LazyhandBar` (or any name)
4. Select your workspace → **Create App**

### Step 2: Add Permissions
1. Go to **OAuth & Permissions**
2. Scroll to **User Token Scopes**
3. Add these scopes:
   - `chat:write`
   - `channels:read`
   - `users:read`

### Step 3: Install & Get Token
1. Scroll up → Click **Install to Workspace**
2. Click **Allow**
3. Copy the **User OAuth Token** (starts with `xoxp-`)

### Step 4: Get Channel ID
1. Open Slack → Right-click your channel
2. Click **View channel details**
3. Scroll down → Copy **Channel ID** (starts with `C`)

---

## Done

App runs in menu bar. Schedule fires at set time daily.
