#!/bin/bash
################################################################################
# Jira-to-Slack Integration Setup Script
# Automates the initial setup process
################################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Jira-to-Slack Integration Setup      ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Step 1: Check Python
echo -e "${BLUE}[Step 1/5]${NC} Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed!${NC}"
    echo "Please install Python 3.7+ and try again"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo -e "${GREEN}✅ $PYTHON_VERSION installed${NC}"
echo ""

# Step 2: Check pip
echo -e "${BLUE}[Step 2/5]${NC} Checking pip installation..."
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}❌ pip3 is not installed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ pip3 is available${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}[Step 3/5]${NC} Installing Python dependencies..."
cd "$SCRIPT_DIR"
pip3 install -r requirements.txt --quiet
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Create .env file
echo -e "${BLUE}[Step 4/5]${NC} Configuring environment variables..."
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
    read -p "Do you want to overwrite it? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        echo "Keeping existing .env file"
    else
        rm .env
    fi
fi

if [ ! -f ".env" ]; then
    echo ""
    echo "Let's set up your configuration..."
    echo ""

    # Jira URL
    read -p "Enter your Jira URL (e.g., https://yourcompany.atlassian.net): " jira_url
    # Remove trailing slash if present
    jira_url="${jira_url%/}"

    # Jira Email
    read -p "Enter your Jira email: " jira_email

    # Jira API Token
    echo ""
    echo "Get your Jira API token from: https://id.atlassian.com/manage-profile/security/api-tokens"
    read -p "Enter your Jira API token: " jira_token

    # Slack integration method
    echo ""
    echo "Choose Slack integration method:"
    echo "1) Webhook URL (recommended)"
    echo "2) Bot Token"
    read -p "Enter your choice [1-2]: " slack_method

    if [ "$slack_method" = "1" ]; then
        echo ""
        echo "Get your Slack Webhook URL from: https://api.slack.com/messaging/webhooks"
        read -p "Enter your Slack Webhook URL: " slack_webhook
        slack_bot_token=""
        slack_channel=""
    else
        echo ""
        echo "Get your Slack Bot Token from: https://api.slack.com/apps"
        read -p "Enter your Slack Bot Token: " slack_bot_token
        read -p "Enter your Slack channel (e.g., #jira-notifications): " slack_channel
        slack_webhook=""
    fi

    # Create .env file
    cat > .env << EOF
# Jira Configuration
JIRA_URL=$jira_url
JIRA_EMAIL=$jira_email
JIRA_API_TOKEN=$jira_token

# Slack Configuration
SLACK_WEBHOOK_URL=$slack_webhook
SLACK_BOT_TOKEN=$slack_bot_token
SLACK_CHANNEL=$slack_channel
EOF

    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ Using existing .env file${NC}"
fi
echo ""

# Step 5: Test the integration
echo -e "${BLUE}[Step 5/5]${NC} Testing the integration..."
echo ""
read -p "Do you want to test the integration now? (y/n): " test_now

if [ "$test_now" = "y" ]; then
    echo ""
    echo -e "${BLUE}Running test...${NC}"
    echo ""
    python3 jira_to_slack.py
    echo ""
fi

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup Complete! 🎉                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Test manually:"
echo -e "   ${BLUE}python3 jira_to_slack.py${NC}"
echo ""
echo "2. Set up automation:"
echo -e "   ${BLUE}./scheduler.sh${NC}"
echo ""
echo "3. View logs (if scheduled):"
echo -e "   ${BLUE}tail -f jira_slack.log${NC}"
echo ""
echo "For more information, see README.md"
echo ""

# Make scripts executable
chmod +x scheduler.sh
chmod +x setup.sh

echo -e "${GREEN}Happy automating! 🚀${NC}"
