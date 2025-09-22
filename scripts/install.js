#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate a unique UUID for this installation
const siteUuid = crypto.randomUUID();

console.log(`Generating SITE_UUID: ${siteUuid}`);

// Paths to .env files and config
const backendEnvPath = path.join(__dirname, '..', 'backend', '.env');
const frontendEnvPath = path.join(__dirname, '..', '.env.local');
const frontendConfigPath = path.join(__dirname, '..', 'frontend', 'src', 'config.js');

// Function to add or update SITE_UUID in .env file
function updateEnvFile(filePath, useVitePrefix = false) {
  let envContent = '';

  // Read existing content if file exists
  if (fs.existsSync(filePath)) {
    envContent = fs.readFileSync(filePath, 'utf8');
  }

  // Determine the key name based on file type
  const keyName = useVitePrefix ? 'VITE_SITE_UUID' : 'SITE_UUID';

  // Check if SITE_UUID already exists
  const lines = envContent.split('\n');
  const siteUuidIndex = lines.findIndex(line => line.startsWith(`${keyName}=`));

  if (siteUuidIndex !== -1) {
    // Update existing UUID
    lines[siteUuidIndex] = `${keyName}=${siteUuid}`;
    console.log(`Updated ${keyName} in ${filePath}`);
  } else {
    // Add new UUID
    lines.push(`${keyName}=${siteUuid}`);
    console.log(`Added ${keyName} to ${filePath}`);
  }

  // Write back to file
  fs.writeFileSync(filePath, lines.join('\n'));
}

// Ensure scripts directory exists
const scriptsDir = path.dirname(__filename);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// Function to update frontend config.js with SITE_UUID
function updateFrontendConfig() {
  let configContent = '';

  // Read existing config.js
  if (fs.existsSync(frontendConfigPath)) {
    configContent = fs.readFileSync(frontendConfigPath, 'utf8');
  }

  // Check if siteUuid export already exists
  const lines = configContent.split('\n');
  const siteUuidIndex = lines.findIndex(line => line.includes('export const siteUuid'));

  if (siteUuidIndex !== -1) {
    // Update existing siteUuid
    lines[siteUuidIndex] = `export const siteUuid = '${siteUuid}';`;
    console.log('Updated siteUuid in frontend config.js');
  } else {
    // Add new siteUuid export
    lines.push(`export const siteUuid = '${siteUuid}';`);
    console.log('Added siteUuid to frontend config.js');
  }

  // Write back to file
  fs.writeFileSync(frontendConfigPath, lines.join('\n'));
}

// Update .env files and config
updateEnvFile(backendEnvPath); // Backend uses SITE_UUID
updateEnvFile(frontendEnvPath, true); // Frontend uses VITE_SITE_UUID
updateFrontendConfig(); // Frontend config.js gets siteUuid

console.log('Installation UUID setup complete!');