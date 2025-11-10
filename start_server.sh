#!/bin/bash
################################################################################
# Quick Start Script for Slack Slash Command Server
################################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Slack Slash Command Server${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file first"
    exit 1
fi

# Check Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Flask not installed. Installing...${NC}"
    pip install flask
fi

# Ask about ngrok
echo "How do you want to run the server?"
echo ""
echo "1) Local only (for testing on same machine)"
echo "2) With ngrok (expose to internet for Slack)"
echo "3) Production mode (assumes already deployed)"
echo ""
read -p "Enter your choice [1-3]: " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Starting server in local mode...${NC}"
        echo "Server will be available at: http://localhost:3000"
        echo ""
        echo "Press Ctrl+C to stop"
        echo ""
        python3 slack_slash_command.py
        ;;

    2)
        echo ""
        echo -e "${BLUE}Starting server with ngrok...${NC}"

        # Check if ngrok is installed
        if ! command -v ngrok &> /dev/null; then
            echo -e "${YELLOW}⚠️  ngrok not installed${NC}"
            echo ""
            echo "Install ngrok:"
            echo "  Mac: brew install ngrok"
            echo "  Or download from: https://ngrok.com/download"
            echo ""
            read -p "Install now with brew? (y/n): " install_ngrok
            if [ "$install_ngrok" = "y" ]; then
                brew install ngrok
            else
                exit 1
            fi
        fi

        # Start Flask in background
        echo "Starting Flask server..."
        python3 slack_slash_command.py &
        FLASK_PID=$!

        # Wait for Flask to start
        sleep 3

        # Start ngrok
        echo ""
        echo -e "${GREEN}✅ Flask server started (PID: $FLASK_PID)${NC}"
        echo ""
        echo -e "${BLUE}Starting ngrok tunnel...${NC}"
        echo ""
        echo -e "${YELLOW}Copy the HTTPS URL from ngrok output below!${NC}"
        echo -e "${YELLOW}You'll need it for Slack slash command setup.${NC}"
        echo ""
        echo "Press Ctrl+C to stop both Flask and ngrok"
        echo ""

        # Trap Ctrl+C to kill both processes
        trap "kill $FLASK_PID 2>/dev/null; exit" INT TERM

        # Start ngrok (this will run in foreground)
        ngrok http 3000

        # Cleanup when ngrok exits
        kill $FLASK_PID 2>/dev/null
        ;;

    3)
        echo ""
        echo -e "${BLUE}Starting server in production mode...${NC}"
        echo ""

        # Check if gunicorn is installed
        if ! python3 -c "import gunicorn" 2>/dev/null; then
            echo -e "${YELLOW}⚠️  gunicorn not installed. Installing...${NC}"
            pip install gunicorn
        fi

        echo "Starting with gunicorn (4 workers)..."
        echo "Server will be available at: http://0.0.0.0:3000"
        echo ""
        echo "Press Ctrl+C to stop"
        echo ""

        gunicorn -w 4 -b 0.0.0.0:3000 slack_slash_command:app
        ;;

    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac
