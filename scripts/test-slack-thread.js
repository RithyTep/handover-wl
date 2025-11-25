const https = require('https');
require('dotenv').config({ path: './nextjs/.env.local' });

const SLACK_USER_TOKEN = process.env.SLACK_USER_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_CHANNEL;

// First, post a test message to get a thread_ts
console.log('Step 1: Posting parent message...');

const parentPayload = JSON.stringify({
  channel: SLACK_CHANNEL,
  text: 'TEST: Parent message for thread testing'
});

const parentOptions = {
  hostname: 'slack.com',
  path: '/api/chat.postMessage',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SLACK_USER_TOKEN}`,
    'Content-Length': parentPayload.length
  }
};

const parentReq = https.request(parentOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const result = JSON.parse(data);
    console.log('Parent message response:', JSON.stringify(result, null, 2));

    if (result.ok && result.ts) {
      const threadTs = result.ts;
      console.log(`\nStep 2: Posting reply to thread ${threadTs}...`);

      // Now post a reply to that thread
      const replyPayload = JSON.stringify({
        channel: SLACK_CHANNEL,
        text: 'TEST: This should be a thread reply',
        thread_ts: threadTs
      });

      const replyOptions = {
        hostname: 'slack.com',
        path: '/api/chat.postMessage',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SLACK_USER_TOKEN}`,
          'Content-Length': replyPayload.length
        }
      };

      const replyReq = https.request(replyOptions, (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => { data2 += chunk; });
        res2.on('end', () => {
          const result2 = JSON.parse(data2);
          console.log('\nThread reply response:', JSON.stringify(result2, null, 2));

          if (result2.ok) {
            console.log('\n✅ SUCCESS! Thread reply posted successfully!');
            console.log('Parent ts:', threadTs);
            console.log('Reply ts:', result2.ts);
          } else {
            console.log('\n❌ FAILED! Error:', result2.error);
          }
        });
      });

      replyReq.on('error', (e) => {
        console.error('Reply request error:', e);
      });

      replyReq.write(replyPayload);
      replyReq.end();
    } else {
      console.log('❌ Failed to post parent message:', result.error);
    }
  });
});

parentReq.on('error', (e) => {
  console.error('Parent request error:', e);
});

parentReq.write(parentPayload);
parentReq.end();
