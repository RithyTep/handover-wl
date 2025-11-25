const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const JIRA_URL = process.env.JIRA_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

async function findCustomFields() {
  try {
    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

    // Get all field definitions
    const response = await axios.get(`${JIRA_URL}/rest/api/3/field`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });

    console.log('Searching for custom fields related to WL, Customer, Level, Type...\n');

    response.data
      .filter(field => field.custom && field.name)
      .filter(field => {
        const name = field.name.toLowerCase();
        return name.includes('wl') || name.includes('customer') || name.includes('level') || name.includes('type');
      })
      .forEach(field => {
        console.log(`${field.id}: ${field.name}`);
        const schemaType = field.schema && field.schema.type ? field.schema.type : 'None';
        console.log(`   Type: ${schemaType}`);
        console.log('');
      });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

findCustomFields();
