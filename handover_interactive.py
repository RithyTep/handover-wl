#!/usr/bin/env python3
"""
Interactive Handover Script
Allows input of Status and Action for each ticket and saves them
"""

import os
import json
import requests
from datetime import datetime
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

# Configuration
JIRA_URL = os.getenv('JIRA_URL')
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')
SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')

# Storage file for ticket status/actions
STORAGE_FILE = os.path.join(os.path.dirname(__file__), 'ticket_data.json')

# JQL Query
JQL_QUERY = """
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC, updated DESC
"""


def load_ticket_data():
    """Load previously saved ticket data"""
    if os.path.exists(STORAGE_FILE):
        try:
            with open(STORAGE_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}


def save_ticket_data(data):
    """Save ticket data to file"""
    with open(STORAGE_FILE, 'w') as f:
        json.dump(data, f, indent=2)


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
        print(f"❌ Error fetching tickets: {e}")
        return []


def input_ticket_data(tickets):
    """Open JSON file for editing ticket data"""
    import subprocess
    import tempfile

    saved_data = load_ticket_data()

    # Prepare editable JSON with all tickets
    edit_data = {}
    for idx, ticket in enumerate(tickets, 1):
        key = ticket.get('key', 'N/A')
        fields = ticket.get('fields', {})
        summary = fields.get('summary', 'No summary')

        # Get previous values or defaults
        prev_data = saved_data.get(key, {})
        prev_status = prev_data.get('status', '--')
        prev_action = prev_data.get('action', '--')

        edit_data[key] = {
            'ticket_number': idx,
            'summary': summary,
            'status': prev_status,
            'action': prev_action
        }

    # Create temporary JSON file
    temp_file = os.path.join(os.path.dirname(__file__), 'edit_tickets.json')

    with open(temp_file, 'w') as f:
        json.dump(edit_data, f, indent=2)

    print("\n" + "=" * 70)
    print("  📝 Edit Ticket Status and Action in JSON")
    print("=" * 70)
    print(f"\n📄 Opening: {temp_file}")
    print("\n📝 Edit the 'status' and 'action' fields for each ticket")
    print("💾 Save and close the editor when done")
    print("\nPress Enter to open editor...")
    input()

    # Open in default editor (nano, vim, or system default)
    editor = os.environ.get('EDITOR', 'nano')
    try:
        subprocess.run([editor, temp_file])
    except:
        # Fallback to nano
        subprocess.run(['nano', temp_file])

    # Read edited data
    with open(temp_file, 'r') as f:
        edited_data = json.load(f)

    # Convert back to storage format
    ticket_data = {}
    for key, data in edited_data.items():
        ticket_data[key] = {
            'status': data['status'],
            'action': data['action'],
            'summary': data['summary'],
            'updated_at': datetime.now().isoformat()
        }

    print("\n✅ Loaded edited data!")
    return ticket_data


def quick_fill_all(tickets):
    """Quick fill all tickets with same status/action"""
    print("\n" + "=" * 70)
    print("  ⚡ Quick Fill All Tickets")
    print("=" * 70)

    status = input("Status for all tickets: ").strip() or "--"
    action = input("Action for all tickets: ").strip() or "--"

    ticket_data = {}
    for ticket in tickets:
        key = ticket.get('key', 'N/A')
        summary = ticket['fields'].get('summary', 'No summary')

        ticket_data[key] = {
            'status': status,
            'action': action,
            'summary': summary,
            'updated_at': datetime.now().isoformat()
        }

    return ticket_data


def format_slack_blocks(tickets, ticket_data):
    """Format tickets into Slack blocks with saved data"""
    if not tickets:
        return [{
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "✅ *No pending tickets found!*"
            }
        }]

    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": f"📋 Jira Tickets Update - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"Found *{len(tickets)}* ticket(s) in WL - Pending/Processing status"
            }
        },
        {"type": "divider"}
    ]

    for idx, ticket in enumerate(tickets, 1):
        key = ticket.get('key', 'N/A')
        fields = ticket.get('fields', {})
        summary = fields.get('summary', 'No summary')
        ticket_url = f"{JIRA_URL}/browse/{key}"

        # Get saved data
        data = ticket_data.get(key, {})
        status = data.get('status', '--')
        action = data.get('action', '--')

        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": (
                    f"*--- Ticket {idx} ---*\n"
                    f"Ticket Link: <{ticket_url}|{key}> {summary}\n"
                    f"Status: {status}\n"
                    f"Action: {action}"
                )
            }
        })

    return blocks


def post_to_slack(blocks):
    """Post to Slack webhook"""
    if not SLACK_WEBHOOK_URL:
        print("❌ SLACK_WEBHOOK_URL not configured")
        return False

    payload = {
        "blocks": blocks,
        "username": "Jira Bot",
        "icon_emoji": ":jira:"
    }

    try:
        response = requests.post(SLACK_WEBHOOK_URL, json=payload)
        response.raise_for_status()
        print("✅ Posted to Slack successfully")
        return True
    except Exception as e:
        print(f"❌ Error posting to Slack: {e}")
        return False


def main():
    """Main function"""
    print("\n" + "=" * 70)
    print("  🚀 Interactive Jira Handover")
    print("=" * 70)

    # Fetch tickets
    print("\n📥 Fetching tickets from Jira...")
    tickets = fetch_jira_tickets(JQL_QUERY)

    if not tickets:
        print("ℹ️  No tickets found")
        return

    print(f"✅ Found {len(tickets)} ticket(s)")

    # Show menu
    print("\n" + "=" * 70)
    print("  Choose an option:")
    print("=" * 70)
    print("1) Enter status/action for each ticket individually")
    print("2) Quick fill all tickets with same values")
    print("3) Use previous values and post to Slack")
    print("4) Exit without posting")
    print("")

    choice = input("Enter your choice [1-4]: ").strip()

    if choice == '1':
        # Interactive input
        ticket_data = input_ticket_data(tickets)
        save_ticket_data(ticket_data)
        print("\n💾 Saved ticket data!")

    elif choice == '2':
        # Quick fill
        ticket_data = quick_fill_all(tickets)
        save_ticket_data(ticket_data)
        print("\n💾 Saved ticket data!")

    elif choice == '3':
        # Use saved data
        ticket_data = load_ticket_data()
        print("\n📂 Using saved ticket data")

    elif choice == '4':
        print("\n👋 Exiting...")
        return

    else:
        print("\n❌ Invalid choice")
        return

    # Ask to post to Slack
    print("\n" + "=" * 70)
    post = input("Post to Slack? (y/n): ").strip().lower()

    if post == 'y':
        print("\n📤 Posting to Slack...")
        blocks = format_slack_blocks(tickets, ticket_data)
        post_to_slack(blocks)
        print("\n✅ Done!")
    else:
        print("\n💾 Data saved but not posted to Slack")

    print("\n" + "=" * 70)


if __name__ == "__main__":
    main()
