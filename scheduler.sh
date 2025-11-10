#!/bin/bash
################################################################################
# Jira-to-Slack Scheduler Script
# Helps you set up automated scheduling for the integration
################################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/jira_to_slack.py"
LOG_FILE="$SCRIPT_DIR/jira_slack.log"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Jira-to-Slack Scheduler Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if Python script exists
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo -e "${RED}❌ Error: jira_to_slack.py not found!${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file not found${NC}"
    echo "Please create .env file from .env.example first"
    exit 1
fi

echo "Select scheduling option:"
echo ""
echo "1) Run now (one-time)"
echo "2) Set up daily cron job (9 AM)"
echo "3) Set up hourly cron job"
echo "4) Set up custom cron job"
echo "5) View current cron jobs"
echo "6) Remove cron job"
echo ""
read -p "Enter your choice [1-6]: " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Running Jira-to-Slack integration now...${NC}"
        cd "$SCRIPT_DIR"
        python3 "$PYTHON_SCRIPT"
        ;;

    2)
        echo ""
        echo -e "${BLUE}Setting up daily cron job (9 AM)...${NC}"

        # Create cron entry
        CRON_CMD="0 9 * * * cd $SCRIPT_DIR && python3 $PYTHON_SCRIPT >> $LOG_FILE 2>&1"

        # Check if cron job already exists
        if crontab -l 2>/dev/null | grep -q "jira_to_slack.py"; then
            echo -e "${YELLOW}⚠️  Cron job already exists. Remove it first.${NC}"
            exit 1
        fi

        # Add to crontab
        (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

        echo -e "${GREEN}✅ Daily cron job added successfully!${NC}"
        echo "The script will run every day at 9 AM"
        echo "Logs will be saved to: $LOG_FILE"
        ;;

    3)
        echo ""
        echo -e "${BLUE}Setting up hourly cron job...${NC}"

        # Create cron entry
        CRON_CMD="0 * * * * cd $SCRIPT_DIR && python3 $PYTHON_SCRIPT >> $LOG_FILE 2>&1"

        # Check if cron job already exists
        if crontab -l 2>/dev/null | grep -q "jira_to_slack.py"; then
            echo -e "${YELLOW}⚠️  Cron job already exists. Remove it first.${NC}"
            exit 1
        fi

        # Add to crontab
        (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

        echo -e "${GREEN}✅ Hourly cron job added successfully!${NC}"
        echo "The script will run every hour at minute 0"
        echo "Logs will be saved to: $LOG_FILE"
        ;;

    4)
        echo ""
        echo -e "${BLUE}Custom cron schedule${NC}"
        echo ""
        echo "Cron format: minute hour day month weekday"
        echo "Examples:"
        echo "  0 9 * * *       - Every day at 9 AM"
        echo "  0 9,17 * * *    - Every day at 9 AM and 5 PM"
        echo "  0 9 * * 1       - Every Monday at 9 AM"
        echo "  */30 * * * *    - Every 30 minutes"
        echo ""
        read -p "Enter cron schedule: " cron_schedule

        # Create cron entry
        CRON_CMD="$cron_schedule cd $SCRIPT_DIR && python3 $PYTHON_SCRIPT >> $LOG_FILE 2>&1"

        # Check if cron job already exists
        if crontab -l 2>/dev/null | grep -q "jira_to_slack.py"; then
            echo -e "${YELLOW}⚠️  Cron job already exists. Remove it first.${NC}"
            exit 1
        fi

        # Add to crontab
        (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -

        echo -e "${GREEN}✅ Custom cron job added successfully!${NC}"
        echo "Schedule: $cron_schedule"
        echo "Logs will be saved to: $LOG_FILE"
        ;;

    5)
        echo ""
        echo -e "${BLUE}Current cron jobs:${NC}"
        echo ""
        crontab -l 2>/dev/null || echo "No cron jobs found"
        ;;

    6)
        echo ""
        echo -e "${BLUE}Removing Jira-to-Slack cron job...${NC}"

        # Remove cron job
        crontab -l 2>/dev/null | grep -v "jira_to_slack.py" | crontab -

        echo -e "${GREEN}✅ Cron job removed successfully!${NC}"
        ;;

    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Done!${NC}"
