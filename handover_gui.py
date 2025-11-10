#!/usr/bin/env python3
"""
Handover GUI - Web Interface
Open in browser to edit ticket status and actions
"""

from flask import Flask, render_template_string, request, jsonify, redirect
import os
import json
import requests
from datetime import datetime
from dotenv import load_dotenv
import webbrowser
import threading

load_dotenv()

app = Flask(__name__)

# Configuration
JIRA_URL = os.getenv('JIRA_URL')
JIRA_EMAIL = os.getenv('JIRA_EMAIL')
JIRA_API_TOKEN = os.getenv('JIRA_API_TOKEN')
SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')

STORAGE_FILE = os.path.join(os.path.dirname(__file__), 'ticket_data.json')

# JQL Query
JQL_QUERY = """
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
ORDER BY created ASC, updated DESC
"""

# HTML Template
HTML_TEMPLATE = '''
<!DOCTYPE html>
<html>
<head>
    <title>Jira Handover Dashboard</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Lucide Icons (same as shadcn/ui) -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --background: 0 0% 100%;
            --foreground: 222.2 84% 4.9%;
            --card: 0 0% 100%;
            --card-foreground: 222.2 84% 4.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 222.2 84% 4.9%;
            --primary: 221.2 83.2% 53.3%;
            --primary-foreground: 210 40% 98%;
            --secondary: 210 40% 96.1%;
            --secondary-foreground: 222.2 47.4% 11.2%;
            --muted: 210 40% 96.1%;
            --muted-foreground: 215.4 16.3% 46.9%;
            --accent: 210 40% 96.1%;
            --accent-foreground: 222.2 47.4% 11.2%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 210 40% 98%;
            --border: 214.3 31.8% 91.4%;
            --input: 214.3 31.8% 91.4%;
            --ring: 221.2 83.2% 53.3%;
            --radius: 0.5rem;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background: hsl(var(--background));
            padding: 20px;
            min-height: 100vh;
            color: hsl(var(--foreground));
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
        }

        .container {
            max-width: 1600px;
            margin: 0 auto;
            background: hsl(var(--card));
            border-radius: var(--radius);
            border: 1px solid hsl(var(--border));
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
            overflow: hidden;
        }

        .header {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            padding: 24px 32px;
            border-bottom: 1px solid hsl(221.2 83.2% 48%);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 14px;
            font-weight: 400;
        }

        .stats {
            display: flex;
            justify-content: space-around;
            padding: 20px;
            background: hsl(var(--muted));
            border-bottom: 1px solid hsl(var(--border));
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 28px;
            font-weight: 700;
            color: hsl(var(--primary));
        }

        .stat-label {
            color: hsl(var(--muted-foreground));
            font-size: 12px;
            margin-top: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 500;
        }

        .toolbar {
            padding: 16px 32px;
            background: hsl(var(--card));
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid hsl(var(--border));
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            white-space: nowrap;
            border-radius: var(--radius);
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
            cursor: pointer;
            border: none;
            padding: 10px 16px;
            height: 40px;
            text-decoration: none;
            margin-left: 8px;
        }

        .btn:disabled {
            pointer-events: none;
            opacity: 0.5;
        }

        .btn-primary {
            background: hsl(var(--primary));
            color: hsl(var(--primary-foreground));
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        .btn-primary:hover {
            background: hsl(221.2 83.2% 48%);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .btn-success {
            background: hsl(142.1 76.2% 36.3%);
            color: white;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        .btn-success:hover {
            background: hsl(142.1 76.2% 32%);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .btn-secondary {
            background: hsl(var(--secondary));
            color: hsl(var(--secondary-foreground));
            border: 1px solid hsl(var(--border));
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        }

        .btn-secondary:hover {
            background: hsl(210 40% 93%);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .btn-outline {
            background: transparent;
            border: 1px solid hsl(var(--border));
            color: hsl(var(--foreground));
        }

        .btn-outline:hover {
            background: hsl(var(--accent));
            color: hsl(var(--accent-foreground));
        }

        .table-container {
            padding: 0;
            max-height: 600px;
            overflow-y: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        thead {
            background: hsl(var(--muted));
            position: sticky;
            top: 0;
            z-index: 10;
        }

        th {
            padding: 12px 16px;
            text-align: left;
            font-weight: 500;
            font-size: 12px;
            color: hsl(var(--muted-foreground));
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid hsl(var(--border));
        }

        th:first-child {
            width: 60px;
            text-align: center;
        }

        th:nth-child(2) {
            width: 120px;
        }

        th:nth-child(4), th:nth-child(5) {
            width: 200px;
        }

        tbody tr {
            border-bottom: 1px solid hsl(var(--border));
            transition: background 0.2s;
        }

        tbody tr:hover {
            background: hsl(var(--muted));
        }

        td {
            padding: 12px 16px;
            font-size: 14px;
            color: hsl(var(--foreground));
        }

        td:first-child {
            text-align: center;
            font-weight: 500;
            color: hsl(var(--muted-foreground));
        }

        .ticket-link {
            color: hsl(var(--primary));
            text-decoration: none;
            font-weight: 600;
            font-size: 13px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: color 0.2s;
        }

        .ticket-link:hover {
            color: hsl(221.2 83.2% 48%);
            text-decoration: underline;
        }

        .ticket-summary {
            color: hsl(var(--muted-foreground));
            font-size: 13px;
            line-height: 1.5;
        }

        .editable-cell {
            cursor: pointer;
            padding: 8px 12px;
            border-radius: var(--radius);
            transition: all 0.2s;
            min-height: 40px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: 1px solid transparent;
        }

        .editable-cell:hover {
            background: hsl(var(--accent));
            border-color: hsl(var(--border));
        }

        .editable-cell.empty {
            color: hsl(var(--muted-foreground));
            font-style: italic;
        }

        .footer {
            padding: 24px 32px;
            background: hsl(var(--muted));
            text-align: center;
            border-top: 1px solid hsl(var(--border));
        }

        .footer-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 16px;
        }

        .success-message {
            background: hsl(142.1 76.2% 92%);
            color: hsl(142.1 76.2% 26%);
            padding: 16px 32px;
            text-align: left;
            font-weight: 500;
            font-size: 14px;
            display: none;
            border-left: 4px solid hsl(142.1 76.2% 36.3%);
            border-radius: var(--radius);
            margin: 16px 32px;
            align-items: center;
            gap: 12px;
        }

        .error-message {
            background: hsl(0 84.2% 95%);
            color: hsl(0 84.2% 40%);
            padding: 16px 32px;
            text-align: left;
            font-weight: 500;
            font-size: 14px;
            display: none;
            border-left: 4px solid hsl(0 84.2% 60.2%);
            border-radius: var(--radius);
            margin: 16px 32px;
            align-items: center;
            gap: 12px;
        }

        /* Modal Dialog - shadcn/ui style */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            animation: fadeIn 0.15s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .modal-content {
            background: hsl(var(--card));
            margin: 10% auto;
            padding: 0;
            border-radius: var(--radius);
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
            animation: slideDown 0.2s;
            border: 1px solid hsl(var(--border));
        }

        @keyframes slideDown {
            from {
                transform: translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            padding: 24px 24px 16px 24px;
            border-bottom: 1px solid hsl(var(--border));
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .modal-header h2 {
            font-size: 18px;
            font-weight: 600;
            color: hsl(var(--foreground));
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .modal-body {
            padding: 24px;
        }

        .modal-ticket-info {
            background: hsl(var(--muted));
            padding: 12px 16px;
            border-radius: var(--radius);
            margin-bottom: 20px;
            font-size: 13px;
            color: hsl(var(--muted-foreground));
            border: 1px solid hsl(var(--border));
        }

        .modal-ticket-info strong {
            color: hsl(var(--foreground));
            font-weight: 600;
        }

        .modal-label {
            font-weight: 500;
            margin-bottom: 8px;
            color: hsl(var(--foreground));
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .modal-input {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid hsl(var(--border));
            border-radius: var(--radius);
            font-size: 14px;
            font-family: inherit;
            transition: all 0.2s;
            background: hsl(var(--background));
            color: hsl(var(--foreground));
        }

        .modal-input:focus {
            outline: none;
            border-color: hsl(var(--ring));
            box-shadow: 0 0 0 3px hsla(221.2, 83.2%, 53.3%, 0.1);
        }

        .modal-footer {
            padding: 16px 24px;
            border-top: 1px solid hsl(var(--border));
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }

        .close {
            color: hsl(var(--muted-foreground));
            float: right;
            font-size: 24px;
            font-weight: normal;
            line-height: 1;
            cursor: pointer;
            transition: color 0.2s;
            padding: 4px;
            border-radius: var(--radius);
        }

        .close:hover {
            color: hsl(var(--foreground));
            background: hsl(var(--accent));
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="flex: 1;">
                <h1>
                    <i data-lucide="clipboard-list" style="width: 24px; height: 24px;"></i>
                    Jira Handover Dashboard
                </h1>
                <p>Professional ticket management and status tracking</p>
            </div>
        </div>

        <div class="stats">
            <div class="stat-item">
                <div class="stat-number">{{ tickets|length }}</div>
                <div class="stat-label">Total Tickets</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="status-count">0</div>
                <div class="stat-label">Status Filled</div>
            </div>
            <div class="stat-item">
                <div class="stat-number" id="action-count">0</div>
                <div class="stat-label">Action Filled</div>
            </div>
        </div>

        <div class="toolbar">
            <div>
                <button class="btn btn-secondary" onclick="quickFill()">
                    <i data-lucide="zap" style="width: 16px; height: 16px;"></i>
                    Quick Fill All
                </button>
                <button class="btn btn-secondary" onclick="clearAll()">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                    Clear All
                </button>
            </div>
            <div>
                <button class="btn btn-primary" onclick="refreshTickets()">
                    <i data-lucide="refresh-cw" style="width: 16px; height: 16px;"></i>
                    Refresh from Jira
                </button>
            </div>
        </div>

        <div class="success-message" id="success-message"></div>
        <div class="error-message" id="error-message"></div>

        <form id="handover-form">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ticket</th>
                            <th>Summary</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for ticket in tickets %}
                        <tr>
                            <td>{{ loop.index }}</td>
                            <td>
                                <a href="{{ jira_url }}/browse/{{ ticket.key }}"
                                   target="_blank"
                                   class="ticket-link">
                                    <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
                                    {{ ticket.key }}
                                </a>
                            </td>
                            <td>
                                <div class="ticket-summary">{{ ticket.summary }}</div>
                            </td>
                            <td>
                                <div class="editable-cell {% if ticket.saved_status == '--' %}empty{% endif %}"
                                     onclick="openEditDialog('{{ ticket.key }}', 'status', '{{ ticket.summary }}', this.textContent.trim())">
                                    <input type="hidden"
                                           name="status-{{ ticket.key }}"
                                           id="status-{{ ticket.key }}"
                                           value="{{ ticket.saved_status }}">
                                    <i data-lucide="edit-3" style="width: 14px; height: 14px; opacity: 0.5;"></i>
                                    <span>{{ ticket.saved_status }}</span>
                                </div>
                            </td>
                            <td>
                                <div class="editable-cell {% if ticket.saved_action == '--' %}empty{% endif %}"
                                     onclick="openEditDialog('{{ ticket.key }}', 'action', '{{ ticket.summary }}', this.textContent.trim())">
                                    <input type="hidden"
                                           name="action-{{ ticket.key }}"
                                           id="action-{{ ticket.key }}"
                                           value="{{ ticket.saved_action }}">
                                    <i data-lucide="edit-3" style="width: 14px; height: 14px; opacity: 0.5;"></i>
                                    <span>{{ ticket.saved_action }}</span>
                                </div>
                            </td>
                        </tr>
                        {% endfor %}
                    </tbody>
                </table>
            </div>

            <div class="footer">
                <p style="color: hsl(var(--muted-foreground)); font-size: 13px; margin-bottom: 12px;">
                    <i data-lucide="info" style="width: 14px; height: 14px; display: inline-block; vertical-align: middle;"></i>
                    Click on Status or Action cells to edit • Changes are saved automatically
                </p>
                <div class="footer-buttons">
                    <button type="button" class="btn btn-secondary" onclick="saveOnly()">
                        <i data-lucide="save" style="width: 16px; height: 16px;"></i>
                        Save Only
                    </button>
                    <button type="button" class="btn btn-success" onclick="saveAndPost()">
                        <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                        Save & Post to Slack
                    </button>
                </div>
            </div>
        </form>
    </div>

    <!-- Edit Dialog Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-title">
                    <i data-lucide="pencil" style="width: 18px; height: 18px;"></i>
                    Edit Status
                </h2>
                <span class="close" onclick="closeEditDialog()">
                    <i data-lucide="x" style="width: 20px; height: 20px;"></i>
                </span>
            </div>
            <div class="modal-body">
                <div class="modal-ticket-info">
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                        <i data-lucide="ticket" style="width: 14px; height: 14px;"></i>
                        <strong id="modal-ticket-key"></strong>
                    </div>
                    <div id="modal-ticket-summary" style="margin-left: 20px;"></div>
                </div>
                <div class="modal-label" id="modal-field-label">
                    <i data-lucide="type" style="width: 16px; height: 16px;"></i>
                    Status
                </div>
                <input type="text"
                       id="modal-input"
                       class="modal-input"
                       placeholder="Enter value..."
                       onkeypress="if(event.key === 'Enter') saveEdit()">
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline" onclick="closeEditDialog()">
                    <i data-lucide="x" style="width: 16px; height: 16px;"></i>
                    Cancel
                </button>
                <button class="btn btn-primary" onclick="saveEdit()">
                    <i data-lucide="check" style="width: 16px; height: 16px;"></i>
                    Save
                </button>
            </div>
        </div>
    </div>

    <script>
        let currentEditKey = null;
        let currentEditField = null;

        function updateStats() {
            let statusCount = 0;
            let actionCount = 0;

            document.querySelectorAll('input[id^="status-"]').forEach(input => {
                if (input.value && input.value !== '--') statusCount++;
            });

            document.querySelectorAll('input[id^="action-"]').forEach(input => {
                if (input.value && input.value !== '--') actionCount++;
            });

            document.getElementById('status-count').textContent = statusCount;
            document.getElementById('action-count').textContent = actionCount;
        }

        function openEditDialog(ticketKey, field, summary, currentValue) {
            currentEditKey = ticketKey;
            currentEditField = field;

            const modal = document.getElementById('editModal');
            const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1);

            // Update modal title with icon
            const modalTitle = document.getElementById('modal-title');
            modalTitle.innerHTML = `<i data-lucide="pencil" style="width: 18px; height: 18px;"></i> Edit ${fieldLabel}`;

            document.getElementById('modal-ticket-key').textContent = ticketKey;
            document.getElementById('modal-ticket-summary').textContent = summary;

            // Update field label with icon
            const modalFieldLabel = document.getElementById('modal-field-label');
            modalFieldLabel.innerHTML = `<i data-lucide="type" style="width: 16px; height: 16px;"></i> ${fieldLabel}`;

            document.getElementById('modal-input').value = currentValue;

            modal.style.display = 'block';

            // Re-initialize Lucide icons for the modal
            lucide.createIcons();

            setTimeout(() => document.getElementById('modal-input').focus(), 100);
        }

        function closeEditDialog() {
            document.getElementById('editModal').style.display = 'none';
            currentEditKey = null;
            currentEditField = null;
        }

        function saveEdit() {
            if (!currentEditKey || !currentEditField) return;

            const newValue = document.getElementById('modal-input').value.trim() || '--';
            const inputId = currentEditField + '-' + currentEditKey;
            const input = document.getElementById(inputId);
            const cell = input.parentElement;
            const span = cell.querySelector('span');

            input.value = newValue;
            span.textContent = newValue;

            if (newValue === '--') {
                cell.classList.add('empty');
            } else {
                cell.classList.remove('empty');
            }

            updateStats();
            closeEditDialog();
            lucide.createIcons(); // Re-render icons
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('editModal');
            if (event.target === modal) {
                closeEditDialog();
            }
        }

        function quickFill() {
            const status = prompt('Enter status for all tickets:', 'Pending');
            const action = prompt('Enter action for all tickets:', 'Will check tomorrow');

            if (status !== null && action !== null) {
                document.querySelectorAll('input[id^="status-"]').forEach(input => {
                    input.value = status;
                    const span = input.parentElement.querySelector('span');
                    span.textContent = status;
                    if (status === '--') {
                        input.parentElement.classList.add('empty');
                    } else {
                        input.parentElement.classList.remove('empty');
                    }
                });

                document.querySelectorAll('input[id^="action-"]').forEach(input => {
                    input.value = action;
                    const span = input.parentElement.querySelector('span');
                    span.textContent = action;
                    if (action === '--') {
                        input.parentElement.classList.add('empty');
                    } else {
                        input.parentElement.classList.remove('empty');
                    }
                });

                updateStats();
                lucide.createIcons(); // Re-render icons
            }
        }

        function clearAll() {
            if (confirm('Clear all status and action fields?')) {
                document.querySelectorAll('input[type="hidden"]').forEach(input => {
                    input.value = '--';
                    const span = input.parentElement.querySelector('span');
                    span.textContent = '--';
                    input.parentElement.classList.add('empty');
                });
                updateStats();
                lucide.createIcons(); // Re-render icons
            }
        }

        function getFormData() {
            const data = {};
            document.querySelectorAll('input[type="hidden"]').forEach(input => {
                data[input.name] = input.value;
            });
            return data;
        }

        function showMessage(message, isError = false, isLoading = false) {
            const successEl = document.getElementById('success-message');
            const errorEl = document.getElementById('error-message');

            if (isError) {
                errorEl.innerHTML = `<i data-lucide="alert-circle" style="width: 18px; height: 18px;"></i> ${message}`;
                errorEl.style.display = 'flex';
                successEl.style.display = 'none';
                lucide.createIcons();
                setTimeout(() => errorEl.style.display = 'none', 5000);
            } else if (isLoading) {
                successEl.innerHTML = `<i data-lucide="loader-2" style="width: 18px; height: 18px; animation: spin 1s linear infinite;"></i> ${message}`;
                successEl.style.display = 'flex';
                errorEl.style.display = 'none';
                lucide.createIcons();
            } else {
                successEl.innerHTML = `<i data-lucide="check-circle-2" style="width: 18px; height: 18px;"></i> ${message}`;
                successEl.style.display = 'flex';
                errorEl.style.display = 'none';
                lucide.createIcons();
                setTimeout(() => successEl.style.display = 'none', 5000);
            }
        }

        function saveOnly() {
            const data = getFormData();

            fetch('/save', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showMessage('Saved successfully!');
                } else {
                    showMessage('Error saving: ' + result.error, true);
                }
            })
            .catch(error => {
                showMessage('Error: ' + error, true);
            });
        }

        function saveAndPost() {
            if (!confirm('Save and post to Slack?')) return;

            const data = getFormData();

            showMessage('Posting to Slack...', false, true);

            fetch('/save-and-post', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showMessage('Saved and posted to Slack successfully!');
                } else {
                    showMessage('Error: ' + result.error, true);
                }
            })
            .catch(error => {
                showMessage('Error: ' + error, true);
            });
        }

        function refreshTickets() {
            if (confirm('Refresh tickets from Jira? Unsaved changes will be lost.')) {
                window.location.reload();
            }
        }

        // Update stats on load
        updateStats();

        // Initialize Lucide icons
        lucide.createIcons();
    </script>
</body>
</html>
'''


def load_ticket_data():
    """Load saved ticket data"""
    if os.path.exists(STORAGE_FILE):
        try:
            with open(STORAGE_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}


def save_ticket_data(data):
    """Save ticket data"""
    with open(STORAGE_FILE, 'w') as f:
        json.dump(data, f, indent=2)


def fetch_jira_tickets():
    """Fetch tickets from Jira"""
    url = f"{JIRA_URL}/rest/api/3/search/jql"

    params = {
        'jql': JQL_QUERY,
        'maxResults': 50,
        'fields': 'summary,status,key'
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


def format_slack_blocks(tickets_data):
    """Format for Slack"""
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
                "text": f"Found *{len(tickets_data)}* ticket(s) in WL - Pending/Processing status"
            }
        },
        {"type": "divider"}
    ]

    for idx, (key, data) in enumerate(tickets_data.items(), 1):
        ticket_url = f"{JIRA_URL}/browse/{key}"
        summary = data.get('summary', 'No summary')
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
    """Post to Slack"""
    payload = {
        "blocks": blocks,
        "username": "Jira Bot",
        "icon_emoji": ":jira:"
    }

    try:
        response = requests.post(SLACK_WEBHOOK_URL, json=payload)
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error posting to Slack: {e}")
        return False


@app.route('/')
def index():
    """Main page"""
    # Fetch tickets from Jira
    jira_tickets = fetch_jira_tickets()

    # Load saved data
    saved_data = load_ticket_data()

    # Prepare tickets for display
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

        # Parse form data
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

        # Add metadata
        for key in ticket_data:
            ticket_data[key]['updated_at'] = datetime.now().isoformat()

        # Save to file
        save_ticket_data(ticket_data)

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


@app.route('/save-and-post', methods=['POST'])
def save_and_post():
    """Save and post to Slack"""
    try:
        form_data = request.json

        # Parse and save
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

        # Get summaries
        jira_tickets = fetch_jira_tickets()
        for ticket in jira_tickets:
            key = ticket.get('key')
            if key in ticket_data:
                ticket_data[key]['summary'] = ticket['fields'].get('summary', '')

        # Add metadata
        for key in ticket_data:
            ticket_data[key]['updated_at'] = datetime.now().isoformat()

        # Save
        save_ticket_data(ticket_data)

        # Post to Slack
        blocks = format_slack_blocks(ticket_data)
        success = post_to_slack(blocks)

        if success:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Failed to post to Slack'})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})


def open_browser():
    """Open browser after short delay"""
    import time
    time.sleep(1.5)
    webbrowser.open('http://localhost:5555')


if __name__ == '__main__':
    # Get port from environment (Railway) or default to 5555 (local)
    port = int(os.getenv('PORT', 5555))
    is_production = os.getenv('RAILWAY_ENVIRONMENT') is not None

    print("\n" + "=" * 70)
    print("  >> Starting Handover GUI")
    print("=" * 70)

    if is_production:
        print(f"\n[*] Running in production mode on port {port}")
    else:
        print(f"\n[*] Opening browser at: http://localhost:{port}")
        print("[*] Edit tickets in your browser")
        print("[*] Click 'Save & Post to Slack' when done")
        # Open browser in background (only locally)
        threading.Thread(target=open_browser, daemon=True).start()

    print("\n[!] Press Ctrl+C to stop the server")
    print("=" * 70 + "\n")

    # Run Flask server
    # Use 0.0.0.0 for Railway, 127.0.0.1 for local
    host = '0.0.0.0' if is_production else '127.0.0.1'
    app.run(host=host, port=port, debug=False)
