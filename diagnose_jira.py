#!/usr/bin/env python3
"""
Diagnose Jira Setup
Find your projects, statuses, and tickets
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

JIRA_URL = os.getenv('JIRA_URL')
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')

def get_projects():
    """Get all accessible projects"""
    url = f"{JIRA_URL}/rest/api/3/project"
    response = requests.get(
        url,
        auth=(JIRA_EMAIL, JIRA_API_TOKEN),
        headers={'Accept': 'application/json'}
    )

    if response.status_code == 200:
        projects = response.json()
        print("\n📁 Your Jira Projects:")
        print("=" * 60)
        for p in projects[:10]:  # Show first 10
            print(f"  Key: {p['key']:10} | Name: {p['name']}")
        return projects
    else:
        print(f"❌ Error fetching projects: {response.status_code}")
        return []

def get_statuses():
    """Get all statuses"""
    url = f"{JIRA_URL}/rest/api/3/status"
    response = requests.get(
        url,
        auth=(JIRA_EMAIL, JIRA_API_TOKEN),
        headers={'Accept': 'application/json'}
    )

    if response.status_code == 200:
        statuses = response.json()
        print("\n📊 Available Statuses:")
        print("=" * 60)
        for s in statuses:
            print(f"  - {s['name']}")
        return statuses
    else:
        print(f"❌ Error fetching statuses: {response.status_code}")
        return []

def search_recent_tickets():
    """Search for recent tickets"""
    url = f"{JIRA_URL}/rest/api/3/search"

    # Simple query - get ANY recent tickets
    jql = "order by created DESC"

    response = requests.get(
        url,
        auth=(JIRA_EMAIL, JIRA_API_TOKEN),
        headers={'Accept': 'application/json'},
        params={'jql': jql, 'maxResults': 10}
    )

    if response.status_code == 200:
        data = response.json()
        total = data.get('total', 0)
        issues = data.get('issues', [])

        print(f"\n🎫 Recent Tickets (Total: {total}):")
        print("=" * 60)

        if issues:
            for issue in issues[:10]:
                key = issue['key']
                fields = issue['fields']
                summary = fields.get('summary', 'No summary')
                status = fields.get('status', {}).get('name', 'Unknown')
                project = fields.get('project', {}).get('key', 'Unknown')

                print(f"  {key} [{project}] - {status}")
                print(f"    {summary[:60]}...")
                print()
        else:
            print("  No tickets found!")

        return issues
    else:
        print(f"❌ Error searching tickets: {response.status_code}")
        print(f"Response: {response.text}")
        return []

def suggest_jql(projects, statuses, tickets):
    """Suggest JQL query based on your data"""
    print("\n💡 Suggested JQL Queries:")
    print("=" * 60)

    if tickets:
        # Get unique projects from tickets
        project_keys = set()
        status_names = set()

        for ticket in tickets[:20]:
            fields = ticket['fields']
            project = fields.get('project', {}).get('key')
            status = fields.get('status', {}).get('name')

            if project:
                project_keys.add(project)
            if status:
                status_names.add(status)

        if project_keys:
            project_list = ', '.join(sorted(project_keys))
            print(f"\n1️⃣  All tickets from your projects:")
            print(f'   project in ({project_list})')
            print(f'   ORDER BY created DESC')

        if status_names:
            # Filter out Done/Closed statuses
            active_statuses = [s for s in status_names if s not in ['Done', 'Closed', 'Resolved']]
            if active_statuses:
                status_list = '", "'.join(sorted(active_statuses))
                print(f"\n2️⃣  Active tickets only:")
                print(f'   status in ("{status_list}")')
                print(f'   ORDER BY created DESC')

        print(f"\n3️⃣  Your assigned tickets:")
        print(f'   assignee = currentUser()')
        print(f'   ORDER BY created DESC')

        print(f"\n4️⃣  Recently updated:")
        print(f'   updated >= -7d')
        print(f'   ORDER BY updated DESC')

def main():
    print("\n" + "=" * 60)
    print("  🔍 Jira Diagnostics Tool")
    print("=" * 60)

    # Get data
    projects = get_projects()
    statuses = get_statuses()
    tickets = search_recent_tickets()

    # Suggest queries
    suggest_jql(projects, statuses, tickets)

    print("\n" + "=" * 60)
    print("\n📝 Next Steps:")
    print("  1. Pick a suggested JQL query above")
    print("  2. Edit jira_to_slack.py")
    print("  3. Update the JQL_QUERY variable (around line 45)")
    print("  4. Run: python3 jira_to_slack.py")
    print()

if __name__ == "__main__":
    main()
