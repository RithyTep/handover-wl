#!/usr/bin/env python3
"""
Jira to Slack Integration Script
Fetches Jira tickets based on JQL query and posts formatted messages to Slack channel
"""

import os
import requests
from datetime import datetime
from typing import List, Dict
import json

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    print("⚠️  python-dotenv not installed. Using environment variables only.")
    pass

# ============================================================================
# CONFIGURATION
# ============================================================================

# Load from environment variables or .env file
JIRA_URL = os.getenv('JIRA_URL', 'https://yourcompany.atlassian.net')
JIRA_EMAIL = os.getenv('JIRA_EMAIL', 'your-email@example.com')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN', '')

SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL', '')
# OR use Slack Bot Token (choose one method)
SLACK_BOT_TOKEN = os.getenv('SLACK_BOT_TOKEN', '')
SLACK_CHANNEL = os.getenv('SLACK_CHANNEL', '#your-private-channel')

# JQL Query - Your filter
# Filter for TCP project only (excludes DTCP and other projects)
# Sorted by oldest first (created ASC) - prioritize older pending tickets
JQL_QUERY = """
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC, updated DESC
"""

# Other options (uncomment if needed):

# Option 2: Search ALL projects
# JQL_QUERY = """
# issuetype in standardIssueTypes()
# AND status in ("WL - Pending", "WL - Processing")
# ORDER BY created DESC, updated DESC
# """

# Option 3: Multiple specific projects
# JQL_QUERY = """
# project in (TCP, DTCP)
# AND issuetype in standardIssueTypes()
# AND status in ("WL - Pending", "WL - Processing")
# ORDER BY created DESC, updated DESC
# """

# Option 4: Only your assigned tickets
# JQL_QUERY = """
# assignee = currentUser()
# AND status in ("WL - Pending", "WL - Processing")
# ORDER BY created DESC, updated DESC
# """

# ============================================================================
# JIRA API FUNCTIONS
# ============================================================================

def fetch_jira_tickets(jql: str, max_results: int = 50) -> List[Dict]:
    """
    Fetch tickets from Jira using JQL query

    Args:
        jql: JQL query string
        max_results: Maximum number of results to fetch

    Returns:
        List of ticket dictionaries
    """
    # Use the /search/jql endpoint (required for some Jira instances)
    url = f"{JIRA_URL}/rest/api/3/search/jql"

    headers = {
        'Accept': 'application/json'
    }

    # Use GET with query parameters
    params = {
        'jql': jql,
        'maxResults': max_results,
        'fields': 'summary,status,issuetype,created,updated,assignee,priority,key'
    }

    try:
        response = requests.get(
            url,
            headers=headers,
            params=params,
            auth=(JIRA_EMAIL, JIRA_API_TOKEN)
        )
        response.raise_for_status()

        data = response.json()
        return data.get('issues', [])

    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching Jira tickets: {e}")
        return []


def format_ticket_message(tickets: List[Dict]) -> str:
    """
    Format tickets into the desired message format

    Args:
        tickets: List of Jira ticket dictionaries

    Returns:
        Formatted message string
    """
    if not tickets:
        return "✅ No pending tickets found!"

    message_parts = [f"📋 *Jira Tickets Update* - {datetime.now().strftime('%Y-%m-%d %H:%M')}"]
    message_parts.append(f"Found {len(tickets)} ticket(s)\n")
    message_parts.append("=" * 50)

    for idx, ticket in enumerate(tickets, 1):
        key = ticket.get('key', 'N/A')
        fields = ticket.get('fields', {})
        summary = fields.get('summary', 'No summary')
        status = fields.get('status', {}).get('name', 'Unknown')

        ticket_url = f"{JIRA_URL}/browse/{key}"

        message_parts.append(f"\n--- Ticket {idx} ---")
        message_parts.append(f"Ticket Link: <{ticket_url}|{key}> {summary}")
        message_parts.append(f"Status: {status}")
        message_parts.append(f"Action: Can check tomorrow")

    message_parts.append("\n" + "=" * 50)
    return "\n".join(message_parts)


def format_slack_blocks(tickets: List[Dict]) -> List[Dict]:
    """
    Format tickets into Slack Block Kit format (richer formatting)

    Args:
        tickets: List of Jira ticket dictionaries

    Returns:
        List of Slack blocks
    """
    if not tickets:
        return [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "✅ *No pending tickets found!*"
                }
            }
        ]

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

    return blocks


# ============================================================================
# SLACK POSTING FUNCTIONS
# ============================================================================

def post_to_slack_webhook(message: str) -> bool:
    """
    Post message to Slack using Webhook URL

    Args:
        message: Message text to post

    Returns:
        True if successful, False otherwise
    """
    if not SLACK_WEBHOOK_URL:
        print("❌ SLACK_WEBHOOK_URL not configured")
        return False

    payload = {
        "text": message,
        "username": "Jira Bot",
        "icon_emoji": ":jira:"
    }

    try:
        response = requests.post(SLACK_WEBHOOK_URL, json=payload)
        response.raise_for_status()
        print("✅ Message posted to Slack successfully")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Error posting to Slack: {e}")
        return False


def post_to_slack_blocks(blocks: List[Dict]) -> bool:
    """
    Post formatted blocks to Slack using Webhook URL

    Args:
        blocks: List of Slack block dictionaries

    Returns:
        True if successful, False otherwise
    """
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
        print("✅ Formatted message posted to Slack successfully")
        return True
    except requests.exceptions.RequestException as e:
        print(f"❌ Error posting to Slack: {e}")
        return False


def post_to_slack_bot(blocks: List[Dict], channel: str) -> bool:
    """
    Post message to Slack using Bot Token (alternative to webhook)

    Args:
        blocks: List of Slack block dictionaries
        channel: Slack channel ID or name

    Returns:
        True if successful, False otherwise
    """
    if not SLACK_BOT_TOKEN:
        print("❌ SLACK_BOT_TOKEN not configured")
        return False

    url = "https://slack.com/api/chat.postMessage"

    headers = {
        "Authorization": f"Bearer {SLACK_BOT_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "channel": channel,
        "blocks": blocks,
        "username": "Jira Bot",
        "icon_emoji": ":jira:"
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()
        if data.get('ok'):
            print("✅ Message posted to Slack successfully")
            return True
        else:
            print(f"❌ Slack API error: {data.get('error', 'Unknown error')}")
            return False

    except requests.exceptions.RequestException as e:
        print(f"❌ Error posting to Slack: {e}")
        return False


# ============================================================================
# MAIN FUNCTION
# ============================================================================

def main():
    """
    Main execution function
    """
    print("🚀 Starting Jira to Slack integration...")
    print(f"⏰ Current time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    # Validate configuration
    if not JIRA_API_TOKEN:
        print("❌ ERROR: JIRA_API_TOKEN is not set!")
        print("Please set it in environment variables or .env file")
        return

    if not SLACK_WEBHOOK_URL and not SLACK_BOT_TOKEN:
        print("❌ ERROR: Neither SLACK_WEBHOOK_URL nor SLACK_BOT_TOKEN is set!")
        print("Please configure at least one Slack integration method")
        return

    # Fetch tickets from Jira
    print(f"\n📥 Fetching tickets from Jira...")
    print(f"JQL Query: {JQL_QUERY.strip()}")
    tickets = fetch_jira_tickets(JQL_QUERY)

    if tickets:
        print(f"✅ Found {len(tickets)} ticket(s)")

        # Print ticket summary
        for idx, ticket in enumerate(tickets, 1):
            key = ticket.get('key')
            summary = ticket['fields'].get('summary', 'No summary')
            print(f"  {idx}. {key}: {summary}")
    else:
        print("ℹ️  No tickets found matching the query")

    # Format and post to Slack
    print(f"\n📤 Posting to Slack...")

    # Option 1: Use Block Kit format (richer, recommended)
    blocks = format_slack_blocks(tickets)

    if SLACK_WEBHOOK_URL:
        success = post_to_slack_blocks(blocks)
    elif SLACK_BOT_TOKEN:
        success = post_to_slack_bot(blocks, SLACK_CHANNEL)

    # Option 2: Use simple text format (uncomment if preferred)
    # message = format_ticket_message(tickets)
    # success = post_to_slack_webhook(message)

    print("=" * 60)
    if success:
        print("✅ Integration completed successfully!")
    else:
        print("❌ Integration completed with errors")

    return success


# ============================================================================
# ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    main()
