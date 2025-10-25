/* eslint-disable no-console */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { LokaliseApi } from '@lokalise/node-api';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const LOKALISE_PROJECT_ID = process.env.LOKALISE_PROJECT_ID;
const EN_JSON_PATH = path.join(__dirname, '../i18n/en.json');

if (!process.env.LOKALISE_API_TOKEN) {
  console.error('❌ LOKALISE_API_TOKEN environment variable is required');
  process.exit(1);
}

if (!process.env.LOKALISE_PROJECT_ID) {
  console.error('❌ LOKALISE_PROJECT_ID environment variable is required');
  process.exit(1);
}

if (!fs.existsSync(EN_JSON_PATH)) {
  console.error(`❌ English translation file not found at: ${EN_JSON_PATH}`);
  process.exit(1);
}

// Initialize Lokalise API client
const lokaliseApi = new LokaliseApi({ apiKey: process.env.LOKALISE_API_TOKEN });

await uploadTranslations();

async function uploadTranslations() {
  // check if all required env variables are set

  try {
    // Read and validate JSON
    const fileContent = fs.readFileSync(EN_JSON_PATH, 'utf8');
    const translationData = JSON.parse(fileContent);

    // Convert JSON to base64 for Lokalise API
    const base64Content = Buffer.from(
      JSON.stringify(translationData, null, 2)
    ).toString('base64');

    console.log('📤 Uploading translations to Lokalise...');
    console.log('ℹ️  This will replace existing keys and clean up duplicates');

    // Upload file to Lokalise
    const response = await lokaliseApi.files().upload(LOKALISE_PROJECT_ID, {
      data: base64Content,
      filename: 'en.json',
      lang_iso: 'en',
      convert_placeholders: false, // we only have one react native project, thus we do not need universal placeholders
      replace_modified: true,
      cleanup_mode: false,
      apply_tm: false,
    });

    if (response.status === 'failed') {
      console.warn('⚠️  Some errors occurred:', response.message);
      process.exit(1);
    }

    console.log('✅ Upload successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
}
