#!/usr/bin/env python3
"""
Slack Slash Command Server
Responds to /handover command with Jira ticket list
"""

from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
JIRA_URL = os.getenv('JIRA_URL')
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')
SLACK_SIGNING_SECRET = os.getenv('SLACK_SIGNING_SECRET', '')

# JQL Query
JQL_QUERY = """
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC, updated DESC
"""


def fetch_jira_tickets(jql, max_results=50):
    """Fetch tickets from Jira"""
    url = f"{JIRA_URL}/rest/api/3/search/jql"

    params = {
        'jql': jql,
        'maxResults': max_results,
        'fields': 'summary,status,issuetype,created,updated,assignee,priority,key'
    }

    try:
        response = requests.get(
            url,
            params=params,
            auth=(JIRA_EMAIL, JIRA_API_TOKEN),
            headers={'Accept': 'application/json'}
        )
        response.raise_for_status()
        return response.json().get('issues', [])
    except Exception as e:
        print(f"Error fetching tickets: {e}")
        return []


def format_slack_response(tickets):
    """Format tickets into Slack blocks"""
    if not tickets:
        return {
            "response_type": "ephemeral",  # Only visible to you
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "✅ *No pending tickets found!*"
                    }
                }
            ]
        }

    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"📋 TCP Handover Report - {len(tickets)} Tickets"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"Found *{len(tickets)}* ticket(s) in *WL - Pending/Processing* status\n_(Sorted by oldest first)_"
            }
        },
        {"type": "divider"}
    ]

    for idx, ticket in enumerate(tickets, 1):
        key = ticket.get('key', 'N/A')
        fields = ticket.get('fields', {})
        summary = fields.get('summary', 'No summary')
        status = fields.get('status', {}).get('name', 'Unknown')

        ticket_url = f"{JIRA_URL}/browse/{key}"

        # Format: Ticket Link: TCP-86032 Saffaluck [20154] - loss rebate amount check
        # Status: --
        # Action: --
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": (
                    f"*--- Ticket {idx} ---*\n"
                    f"Ticket Link: <{ticket_url}|{key}> {summary}\n"
                    f"Status: --\n"
                    f"Action: --"
                )
            }
        })

    blocks.append({"type": "divider"})
    blocks.append({
        "type": "context",
        "elements": [
            {
                "type": "mrkdwn",
                "text": f"🤖 Generated from Jira • Total: {len(tickets)} tickets"
            }
        ]
    })

    return {
        "response_type": "in_channel",  # Visible to everyone in channel
        # Change to "ephemeral" if you want only the user to see it
        "blocks": blocks
    }


@app.route('/slack/handover', methods=['POST'])
def handover_command():
    """Handle /handover slash command"""

    # Verify request is from Slack (optional but recommended)
    # You can add signature verification here for security

    # Get command details
    user_name = request.form.get('user_name', 'Unknown')
    channel_name = request.form.get('channel_name', 'Unknown')

    print(f"📥 /handover command from {user_name} in #{channel_name}")

    # Fetch tickets
    tickets = fetch_jira_tickets(JQL_QUERY, max_results=50)

    # Format response
    response = format_slack_response(tickets)

    return jsonify(response)


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "ok", "message": "Server is running"})


@app.route('/', methods=['GET'])
def home():
    """Home page"""
    return """
    <h1>Jira-Slack Slash Command Server</h1>
    <p>Server is running! ✅</p>
    <p>Endpoints:</p>
    <ul>
        <li><code>/slack/handover</code> - Slash command handler</li>
        <li><code>/health</code> - Health check</li>
    </ul>
    """


if __name__ == '__main__':
    # Check configuration
    if not all([JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN]):
        print("❌ Missing Jira configuration!")
        print("Please set JIRA_URL, JIRA_EMAIL, and JIRA_API_TOKEN in .env file")
        exit(1)

    print("=" * 60)
    print("🚀 Starting Slack Slash Command Server")
    print("=" * 60)
    print(f"Jira URL: {JIRA_URL}")
    print(f"Email: {JIRA_EMAIL}")
    print("\nEndpoints:")
    print("  - POST /slack/handover (Slash command handler)")
    print("  - GET  /health (Health check)")
    print("  - GET  / (Home page)")
    print("\n🌐 Server will run on: http://0.0.0.0:3000")
    print("=" * 60)

    # Run Flask server
    # For production, use gunicorn or uwsgi instead
    app.run(host='0.0.0.0', port=3000, debug=False)
