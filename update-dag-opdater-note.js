const fs = require('fs');
const https = require('https');
const path = require('path');

// Load config
const configPath = path.join(__dirname, '..', '.n8n-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const API_KEY = config.apiKey;
const BASE_URL = new URL(config.baseUrl).hostname;
const WORKFLOW_ID = '5v4SnWULtmPUW8Iu';

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

    // Updated Prepare node code that includes note field
    const updatedPrepareCode = `// Output med id felt for matching og dag-felt + opskriftId + note for opdatering
const body = $input.first().json.body;

const feltNavn = body.feltNavn;
const ret = body.ret || '';
const opskriftId = body.opskriftId || '';
const note = body.note !== undefined ? body.note : null;  // null = don't update, '' = clear
const recordId = body.id;

if (!recordId) throw new Error('Mangler id');
if (!feltNavn) throw new Error('Mangler feltNavn');

// Output: id bruges af matchingColumns, dag-felt, opskriftId og note opdateres
const result = {
  id: recordId
};

// Only include ret and opskriftId if provided (not for note-only updates)
if (body.ret !== undefined) {
  result[feltNavn] = ret;
  result[feltNavn + 'OpskriftId'] = opskriftId;
}

// Include note if provided (including empty string to clear)
if (note !== null) {
  result[feltNavn + '_Note'] = note;
}

return [{ json: result }];`;

    // Day names for generating schema entries
    const days = ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Loerdag', 'Soendag'];

    // Create updated nodes
    const updatedNodes = workflow.nodes.map(node => {
      if (node.name === 'Prepare') {
        return {
          ...node,
          parameters: {
            ...node.parameters,
            jsCode: updatedPrepareCode
          }
        };
      }
      if (node.name === 'Airtable') {
        // Add Note fields to the mapping
        const currentValue = { ...node.parameters.columns.value };
        const currentSchema = [...node.parameters.columns.schema];

        // Add Note field mappings for each day
        days.forEach(day => {
          const noteField = day + '_Note';
          currentValue[noteField] = `={{ $json.${noteField} }}`;
          currentSchema.push({
            id: noteField,
            displayName: noteField,
            required: false,
            defaultMatch: false,
            display: true,
            type: 'string',
            canBeUsedToMatch: true,
            removed: false
          });
        });

        return {
          ...node,
          parameters: {
            ...node.parameters,
            columns: {
              ...node.parameters.columns,
              value: currentValue,
              schema: currentSchema
            }
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
    console.log('  - Updated Prepare node to handle note field');
    console.log('  - Added {Dag}_Note field mappings to Airtable node');

    const result = await updateWorkflow(updatePayload);
    console.log('\nWorkflow updated!');

    // Activate the workflow
    console.log('\nActivating workflow...');
    await activateWorkflow();
    console.log('Workflow activated!');

    console.log('\nNote fields added for:');
    days.forEach(day => console.log(`  - ${day}_Note`));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
