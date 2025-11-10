// Test script to verify Jira API connection
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const JQL_QUERY = `
project = TCP
AND issuetype in standardIssueTypes()
AND status in ("WL - Pending", "WL - Processing")
AND "Release Date[Date]" = EMPTY
ORDER BY created ASC, updated DESC
`;

async function testJira() {
  console.log('Testing Jira API connection...\n');
  console.log('JIRA_URL:', JIRA_URL);
  console.log('JIRA_EMAIL:', JIRA_EMAIL);
  console.log('API Token (first 10 chars):', JIRA_API_TOKEN?.substring(0, 10) + '...');
  console.log('JQL Query:', JQL_QUERY.trim());
  console.log('\n---\n');

  try {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

    const response = await axios.get(`${JIRA_URL}/rest/api/3/search`, {
      params: {
        jql: JQL_QUERY.trim(),
        maxResults: 5,
        fields: 'key,summary,status',
      },
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ SUCCESS!');
    console.log('Total tickets found:', response.data.total);
    console.log('\nFirst few tickets:');
    response.data.issues.forEach((issue, idx) => {
      console.log(`  ${idx + 1}. ${issue.key}: ${issue.fields.summary}`);
    });
  } catch (error) {
    console.error('❌ ERROR!');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Messages:', error.response?.data?.errorMessages);
    console.error('Error Details:', JSON.stringify(error.response?.data, null, 2));
    console.error('\nFull error:', error.message);
  }
}

testJira();
