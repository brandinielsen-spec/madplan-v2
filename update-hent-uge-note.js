const fs = require('fs');
const https = require('https');
const path = require('path');

// Load config
const configPath = path.join(__dirname, '..', '.n8n-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_KEY = config.apiKey;
const BASE_URL = new URL(config.baseUrl).hostname;
const WORKFLOW_ID = 'D9gPjXM9IXPLdg2b'; // Madplan - Hent Uge

// Get current workflow
function getWorkflow() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE_URL,
      path: `/api/v1/workflows/${WORKFLOW_ID}`,
      method: 'GET',
      headers: {
        'X-N8N-API-KEY': API_KEY
      }
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data.substring(0, 200)));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

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
          reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 500)}`));
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
    console.log('Fetching workflow...');
    const response = await getWorkflow();
    const workflow = response.data || response;

    console.log('Current name:', workflow.name);
    console.log('Active:', workflow.active);

    // Updated Transform node code that includes note fields
    const updatedTransformCode = `const query = $('Webhook').first().json.query;
const ejerId = query.ejerId;
const aar = parseInt(query.aar);
const uge = parseInt(query.uge);

const items = $input.all();
const found = items.find(i =>
  i.json.EjerId === ejerId &&
  i.json.Aar === aar &&
  i.json.Uge === uge
);

if (!found) {
  return [{ json: { success: true, data: null } }];
}

const u = found.json;
return [{ json: {
  success: true,
  data: {
    id: u.id,
    ejerId: u.EjerId,
    aar: u.Aar,
    uge: u.Uge,
    dage: {
      mandag: { ret: u.Mandag || null, opskriftId: u.MandagOpskriftId || null, note: u.Mandag_Note || null },
      tirsdag: { ret: u.Tirsdag || null, opskriftId: u.TirsdagOpskriftId || null, note: u.Tirsdag_Note || null },
      onsdag: { ret: u.Onsdag || null, opskriftId: u.OnsdagOpskriftId || null, note: u.Onsdag_Note || null },
      torsdag: { ret: u.Torsdag || null, opskriftId: u.TorsdagOpskriftId || null, note: u.Torsdag_Note || null },
      fredag: { ret: u.Fredag || null, opskriftId: u.FredagOpskriftId || null, note: u.Fredag_Note || null },
      loerdag: { ret: u.Loerdag || null, opskriftId: u.LoerdagOpskriftId || null, note: u.Loerdag_Note || null },
      soendag: { ret: u.Soendag || null, opskriftId: u.SoendagOpskriftId || null, note: u.Soendag_Note || null }
    }
  }
} }];`;

    // Create updated nodes
    const updatedNodes = workflow.nodes.map(node => {
      if (node.name === 'Transform') {
        return {
          ...node,
          parameters: {
            ...node.parameters,
            jsCode: updatedTransformCode
          }
        };
      }
      return node;
    });

    // Prepare update payload
    const updatePayload = {
      name: workflow.name,
      nodes: updatedNodes,
      connections: workflow.connections,
      settings: workflow.settings || {}
    };

    console.log('\nUpdating workflow...');
    console.log('Changes:');
    console.log('  - Updated Transform node to include note field in each day entry');

    const result = await updateWorkflow(updatePayload);
    console.log('\nWorkflow updated!');

    // Activate the workflow
    console.log('\nActivating workflow...');
    await activateWorkflow();
    console.log('Workflow activated!');

    console.log('\nNote fields now returned:');
    ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'loerdag', 'soendag'].forEach(day => {
      console.log(`  - dage.${day}.note`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
