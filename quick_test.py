#!/usr/bin/env python3
import requests
import os
from dotenv import load_dotenv

load_dotenv()

JIRA_URL = os.getenv('JIRA_URL')
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')

# Test 1: Get myself (should work)
print("Test 1: Getting user info...")
response = requests.get(
    f"{JIRA_URL}/rest/api/3/myself",
    auth=(JIRA_EMAIL, JIRA_API_TOKEN)
)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    print(f"✅ Authenticated as: {response.json().get('displayName')}")
else:
    print(f"❌ Error: {response.text}")

print("\n" + "="*60)

# Test 2: Simple search with GET
print("\nTest 2: Simple JQL search (GET)...")

# Try the exact endpoint mentioned in error
response = requests.get(
    f"{JIRA_URL}/rest/api/3/search/jql",
    params={
        'jql': 'status in ("WL - Pending", "WL - Processing")',
        'maxResults': 5,
        'fields': 'summary,status,key,issuetype,created'
    },
    auth=(JIRA_EMAIL, JIRA_API_TOKEN),
    headers={'Accept': 'application/json'}
)

print(f"Status: {response.status_code}")
print(f"Response: {response.text[:1000]}")

if response.status_code == 200:
    data = response.json()
    issues = data.get('issues', [])
    print(f"\n✅ Found {len(issues)} tickets")

    # If we only got IDs, fetch full details
    if issues and 'key' not in issues[0]:
        print("\n⚠️  Only got IDs, fetching full details...")
        for issue_data in issues:
            issue_id = issue_data.get('id')
            issue_response = requests.get(
                f"{JIRA_URL}/rest/api/3/issue/{issue_id}",
                auth=(JIRA_EMAIL, JIRA_API_TOKEN),
                headers={'Accept': 'application/json'}
            )
            if issue_response.status_code == 200:
                issue = issue_response.json()
                key = issue['key']
                summary = issue['fields']['summary']
                status = issue['fields']['status']['name']
                print(f"  - {key} [{status}]: {summary}")
    else:
        for issue in issues:
            key = issue['key']
            summary = issue['fields']['summary']
            print(f"  - {key}: {summary}")
