const fs = require('fs');
const https = require('https');
const path = require('path');

// Load config
const configPath = path.join(__dirname, '..', '.n8n-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_KEY = config.apiKey;
const BASE_URL = new URL(config.baseUrl).hostname;
const WORKFLOW_ID = 'DqP7Rdkpoy5DlVuV';

// Update workflow
function updateWorkflow(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: BASE_URL,
      path: `/api/v1/workflows/${WORKFLOW_ID}`,
      method: 'PUT',
      headers: {
        'X-N8N-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 1000)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Activate workflow
function activateWorkflow() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `/api/v1/workflows/${WORKFLOW_ID}/activate`,
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': API_KEY
      }
    };

    const req = https.request(options, res => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 500)}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  try {
    console.log('Building new workflow configuration...');

    // Use HTTP Request node to call Airtable API directly
    // This gives us full control over the request body
    const updatedNodes = [
      {
        "parameters": {
          "httpMethod": "POST",
          "path": "madplan/opskrift/opdater",
          "responseMode": "responseNode",
          "options": {
            "allowedOrigins": "*"
          }
        },
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 2,
        "position": [0, 0],
        "name": "Webhook",
        "webhookId": "madplan-opskrift-opdater-v3",
        "id": "webhook-node"
      },
      {
        "parameters": {
          "method": "PATCH",
          "url": "=https://api.airtable.com/v0/appufrDN3IA6Jhli9/tblY7ZZQpp6iDiGDO/{{ $json.body.opskriftId }}",
          "authentication": "predefinedCredentialType",
          "nodeCredentialType": "airtableTokenApi",
          "sendBody": true,
          "specifyBody": "json",
          "jsonBody": "={{ JSON.stringify({ fields: $json.body.fields, typecast: true }) }}",
          "options": {}
        },
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": [220, 0],
        "name": "Update Airtable",
        "credentials": {
          "airtableTokenApi": {
            "id": "V0XbkfzDRzkiO5WJ",
            "name": "Airtable Personal Access Token account"
          }
        },
        "id": "http-request-node"
      },
      {
        "parameters": {
          "respondWith": "json",
          "responseBody": "={{ { success: true, data: $json } }}",
          "options": {}
        },
        "type": "n8n-nodes-base.respondToWebhook",
        "typeVersion": 1.1,
        "position": [440, 0],
        "name": "Respond",
        "id": "respond-node"
      }
    ];

    const updatedConnections = {
      "Webhook": {
        "main": [
          [
            {
              "node": "Update Airtable",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Update Airtable": {
        "main": [
          [
            {
              "node": "Respond",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    };

    const updatePayload = {
      name: "Madplan - Opdater Opskrift v3",
      nodes: updatedNodes,
      connections: updatedConnections,
      settings: {
        executionOrder: "v1"
      }
    };

    console.log('Updating workflow...');
    console.log('Using HTTP Request node to call Airtable API directly');
    console.log('This allows dynamic field updates for Favorit, Tags, etc.');

    const result = await updateWorkflow(updatePayload);
    console.log('\nWorkflow updated! Name:', result.data?.name || result.name);

    console.log('\nActivating workflow...');
    await activateWorkflow();
    console.log('Workflow activated!');

    console.log('\nDone! Test with:');
    console.log('curl -X POST https://n8n.srv965476.hstgr.cloud/webhook/madplan/opskrift/opdater \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"opskriftId":"recXXX","fields":{"Favorit":true}}\'');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
