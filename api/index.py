"""
Handover GUI - Vercel Serverless Deployment
Web Interface for editing ticket status and actions
"""

from flask import Flask, render_template_string, request, jsonify
import os
import json
import requests
from datetime import datetime

app = Flask(__name__)

# Configuration - Vercel will inject these from environment
JIRA_URL = os.getenv('JIRA_URL')
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')
SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')

# Use /tmp in Vercel serverless environment
STORAGE_FILE = '/tmp/ticket_data.json'

# JQL Query
JQL_QUERY = """
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC, updated DESC
"""

# Import the HTML template from the main file
from handover_gui import HTML_TEMPLATE, load_ticket_data, save_ticket_data, fetch_jira_tickets, format_slack_blocks, post_to_slack

@app.route('/')
def index():
    """Main page"""
    jira_tickets = fetch_jira_tickets()
    saved_data = load_ticket_data()

    tickets = []
    for ticket in jira_tickets:
        key = ticket.get('key')
        summary = ticket['fields'].get('summary', 'No summary')
        saved = saved_data.get(key, {})

        tickets.append({
            'key': key,
            'summary': summary,
            'saved_status': saved.get('status', '--'),
            'saved_action': saved.get('action', '--')
        })

    return render_template_string(HTML_TEMPLATE, tickets=tickets, jira_url=JIRA_URL)


@app.route('/save', methods=['POST'])
def save():
    """Save ticket data"""
    try:
        form_data = request.json
        ticket_data = {}

        for key, value in form_data.items():
            if key.startswith('status-'):
                ticket_key = key.replace('status-', '')
                if ticket_key not in ticket_data:
                    ticket_data[ticket_key] = {}
                ticket_data[ticket_key]['status'] = value
            elif key.startswith('action-'):
                ticket_key = key.replace('action-', '')
                if ticket_key not in ticket_data:
                    ticket_data[ticket_key] = {}
                ticket_data[ticket_key]['action'] = value

        for key in ticket_data:
            ticket_data[key]['updated_at'] = datetime.now().isoformat()

        save_ticket_data(ticket_data)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


@app.route('/save-and-post', methods=['POST'])
def save_and_post_route():
    """Save and post to Slack"""
    try:
        form_data = request.json
        ticket_data = {}

        for key, value in form_data.items():
            if key.startswith('status-'):
                ticket_key = key.replace('status-', '')
                if ticket_key not in ticket_data:
                    ticket_data[ticket_key] = {}
                ticket_data[ticket_key]['status'] = value
            elif key.startswith('action-'):
                ticket_key = key.replace('action-', '')
                if ticket_key not in ticket_data:
                    ticket_data[ticket_key] = {}
                ticket_data[ticket_key]['action'] = value

        jira_tickets = fetch_jira_tickets()
        for ticket in jira_tickets:
            key = ticket.get('key')
            if key in ticket_data:
                ticket_data[key]['summary'] = ticket['fields'].get('summary', '')

        for key in ticket_data:
            ticket_data[key]['updated_at'] = datetime.now().isoformat()

        save_ticket_data(ticket_data)
        blocks = format_slack_blocks(ticket_data)
        success = post_to_slack(blocks)

        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to post to Slack'})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


# Export app for Vercel
handler = app
