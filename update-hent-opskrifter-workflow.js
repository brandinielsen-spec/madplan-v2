const fs = require('fs');
const https = require('https');
const path = require('path');

// Load config
const configPath = path.join(__dirname, '..', '.n8n-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_KEY = config.apiKey;
const BASE_URL = new URL(config.baseUrl).hostname;
const WORKFLOW_ID = '3dOMqLfiJuaQruh2'; // Hent Opskrifter workflow

function getWorkflow() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `/api/v1/workflows/${WORKFLOW_ID}`,
      method: 'GET',
      headers: { 'X-N8N-API-KEY': API_KEY }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

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
          reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 500)}`));
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function activateWorkflow() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `/api/v1/workflows/${WORKFLOW_ID}/activate`,
      method: 'POST',
      headers: { 'X-N8N-API-KEY': API_KEY }
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
    console.log('Fetching Hent Opskrifter workflow...');
    const response = await getWorkflow();
    const workflow = response.data || response;

    console.log('Current name:', workflow.name);

    // Find and update the Transform node
    const transformNode = workflow.nodes.find(n => n.name === 'Transform');
    if (!transformNode) {
      throw new Error('Transform node not found');
    }

    // Update the Transform code to include favorit and tags
    const newTransformCode = `const query = $('Webhook').first().json.query;
const items = $input.all().filter(i => i.json.EjerId === query.ejerId);
const opskrifter = items.map(i => ({
  id: i.json.id,
  ejerId: i.json.EjerId,
  titel: i.json.Titel,
  portioner: i.json.Portioner || 4,
  ingredienser: (i.json.Ingredienser || '').split('\\n').filter(x => x.trim()),
  fremgangsmaade: i.json.Fremgangsmaade || '',
  oprettetDato: i.json.Dato,
  billedeUrl: i.json.BilledeUrl || null,
  kilde: i.json.Kilde || null,
  favorit: i.json.Favorit || false,
  tags: i.json.Tags || []
}));
return [{ json: { success: true, data: opskrifter } }];`;

    transformNode.parameters.jsCode = newTransformCode;

    const updatePayload = {
      name: workflow.name,
      nodes: workflow.nodes,
      connections: workflow.connections,
      settings: workflow.settings || {}
    };

    console.log('\nUpdating workflow...');
    console.log('Adding favorit and tags fields to Transform node');

    const result = await updateWorkflow(updatePayload);
    console.log('\nWorkflow updated!');

    console.log('\nActivating workflow...');
    await activateWorkflow();
    console.log('Workflow activated!');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
