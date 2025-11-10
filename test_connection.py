#!/usr/bin/env python3
"""
Test Connection Script
Tests Jira and Slack connections independently to help with troubleshooting
"""

import os
import requests

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configuration
JIRA_URL = os.getenv('JIRA_URL', '')
JIRA_EMAIL = os.getenv('JIRA_EMAIL', '')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN', '')
SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL', '')
SLACK_BOT_TOKEN = os.getenv('SLACK_BOT_TOKEN', '')

def print_header(text):
    """Print formatted header"""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def test_jira_connection():
    """Test Jira API connection"""
    print_header("Testing Jira Connection")

    if not JIRA_URL:
        print("❌ JIRA_URL is not set")
        return False

    if not JIRA_EMAIL:
        print("❌ JIRA_EMAIL is not set")
        return False

    if not JIRA_API_TOKEN:
        print("❌ JIRA_API_TOKEN is not set")
        return False

    print(f"📍 Jira URL: {JIRA_URL}")
    print(f"📧 Email: {JIRA_EMAIL}")
    print(f"🔑 API Token: {'*' * 20}...{JIRA_API_TOKEN[-4:]}")

    # Test 1: Get current user info
    print("\n[Test 1] Getting current user info...")
    url = f"{JIRA_URL}/rest/api/3/myself"

    try:
        response = requests.get(
            url,
            auth=(JIRA_EMAIL, JIRA_API_TOKEN),
            headers={'Accept': 'application/json'}
        )

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Successfully authenticated as: {data.get('displayName')}")
            print(f"   Account ID: {data.get('accountId')}")
            print(f"   Email: {data.get('emailAddress')}")
        elif response.status_code == 401:
            print("❌ Authentication failed!")
            print("   Check your email and API token")
            return False
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False

    # Test 2: Search for tickets
    print("\n[Test 2] Testing JQL search...")
    search_url = f"{JIRA_URL}/rest/api/3/search"

    try:
        response = requests.get(
            search_url,
            auth=(JIRA_EMAIL, JIRA_API_TOKEN),
            headers={'Accept': 'application/json'},
            params={
                'jql': 'order by created DESC',
                'maxResults': 5
            }
        )

        if response.status_code == 200:
            data = response.json()
            total = data.get('total', 0)
            print(f"✅ Search successful!")
            print(f"   Total accessible tickets: {total}")

            if total > 0:
                issues = data.get('issues', [])
                print(f"   Recent tickets:")
                for issue in issues[:3]:
                    key = issue.get('key')
                    summary = issue['fields'].get('summary', 'No summary')
                    print(f"     - {key}: {summary[:50]}...")
        else:
            print(f"❌ Search failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"❌ Search error: {e}")
        return False

    print("\n✅ Jira connection test PASSED!")
    return True


def test_slack_webhook():
    """Test Slack webhook connection"""
    print_header("Testing Slack Webhook")

    if not SLACK_WEBHOOK_URL:
        print("ℹ️  SLACK_WEBHOOK_URL is not set (skipping)")
        return None

    print(f"🔗 Webhook URL: {SLACK_WEBHOOK_URL[:50]}...")

    # Send test message
    print("\n[Test] Sending test message...")

    payload = {
        "text": "🧪 Test message from Jira-to-Slack Integration\n\nIf you see this, your webhook is working correctly! ✅",
        "username": "Jira Bot (Test)",
        "icon_emoji": ":white_check_mark:"
    }

    try:
        response = requests.post(SLACK_WEBHOOK_URL, json=payload)

        if response.status_code == 200:
            print("✅ Test message sent successfully!")
            print("   Check your Slack channel for the test message")
            return True
        else:
            print(f"❌ Failed to send message: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False


def test_slack_bot():
    """Test Slack bot token connection"""
    print_header("Testing Slack Bot Token")

    if not SLACK_BOT_TOKEN:
        print("ℹ️  SLACK_BOT_TOKEN is not set (skipping)")
        return None

    print(f"🔑 Bot Token: xoxb-...{SLACK_BOT_TOKEN[-10:]}")

    # Test auth
    print("\n[Test] Testing bot authentication...")

    url = "https://slack.com/api/auth.test"
    headers = {"Authorization": f"Bearer {SLACK_BOT_TOKEN}"}

    try:
        response = requests.post(url, headers=headers)
        data = response.json()

        if data.get('ok'):
            print("✅ Bot authentication successful!")
            print(f"   Team: {data.get('team')}")
            print(f"   User: {data.get('user')}")
            print(f"   Bot ID: {data.get('bot_id')}")
            return True
        else:
            print(f"❌ Authentication failed: {data.get('error')}")
            return False

    except Exception as e:
        print(f"❌ Connection error: {e}")
        return False


def main():
    """Run all connection tests"""
    print("\n" + "=" * 60)
    print("  🧪 Jira-to-Slack Connection Test")
    print("=" * 60)

    results = {
        'jira': False,
        'slack_webhook': None,
        'slack_bot': None
    }

    # Test Jira
    results['jira'] = test_jira_connection()

    # Test Slack
    if SLACK_WEBHOOK_URL:
        results['slack_webhook'] = test_slack_webhook()

    if SLACK_BOT_TOKEN:
        results['slack_bot'] = test_slack_bot()

    # Summary
    print_header("Test Summary")

    if results['jira']:
        print("✅ Jira: PASSED")
    else:
        print("❌ Jira: FAILED")

    if results['slack_webhook'] is True:
        print("✅ Slack Webhook: PASSED")
    elif results['slack_webhook'] is False:
        print("❌ Slack Webhook: FAILED")
    else:
        print("⚪ Slack Webhook: NOT CONFIGURED")

    if results['slack_bot'] is True:
        print("✅ Slack Bot: PASSED")
    elif results['slack_bot'] is False:
        print("❌ Slack Bot: FAILED")
    else:
        print("⚪ Slack Bot: NOT CONFIGURED")

    print("\n" + "=" * 60)

    # Overall result
    if results['jira'] and (results['slack_webhook'] or results['slack_bot']):
        print("✅ All tests PASSED! You're ready to run jira_to_slack.py")
        return True
    else:
        print("❌ Some tests FAILED. Please fix the issues above.")
        print("\nTroubleshooting tips:")
        print("  - Make sure .env file exists and has correct values")
        print("  - Check that API tokens are valid")
        print("  - For Slack webhooks, verify the URL is correct")
        print("  - For private Slack channels, invite the bot first")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
