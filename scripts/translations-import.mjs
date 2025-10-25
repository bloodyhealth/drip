/* eslint-disable no-console */
import 'dotenv/config';
import AdmZip from 'adm-zip';
import { LokaliseApi } from '@lokalise/node-api';
import https from 'https';
import path from 'path';

const TRANSLATION_FILES_FOLDER = './i18n'; // relative to root of project

if (!process.env.LOKALISE_API_TOKEN) {
  console.error('Error: LOKALISE_API_TOKEN not found in .env file');
  process.exit(1);
}

if (!process.env.LOKALISE_PROJECT_ID) {
  console.error('Error: LOKALISE_PROJECT_ID not found in .env file');
  process.exit(1);
}

const lokaliseApi = new LokaliseApi({ apiKey: process.env.LOKALISE_API_TOKEN });

await importTranslations();

async function importTranslations() {
  try {
    console.log('Starting translation download...');
    const downloadResponse = await downloadFiles();
    console.log('Download completed, extracting files...');
    await unzipBuffer(downloadResponse);
    console.log('Translation files extracted successfully!');
  } catch (error) {
    console.error('Error downloading translations:', error.message);
    process.exit(1);
  }
}

async function downloadFiles() {
  return await lokaliseApi.files().download(process.env.LOKALISE_PROJECT_ID, {
    format: 'json',
    original_filenames: false,
    filter_langs: ['en', 'de'],
    export_empty_as: 'base',
    export_sort: 'a_z',
    replace_breaks: false,
    indentation: '2sp',
    json_unescaped_slashes: true,
    bundle_structure: '%LANG_ISO%.json',
    plural_format: 'i18next_v4',
    placeholder_format: 'i18n',
  });
}

async function zipBuffer(translationsUrl) {
  return new Promise((resolve, reject) => {
    https
      .get(translationsUrl, (response) => {
        const chunks = [];

        response.on('data', (chunk) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });

        response.on('error', (error) => {
          reject(error);
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

async function unzipBuffer(downloadResponse) {
  const translationsUrl = downloadResponse.bundle_url;

  const zip = new AdmZip(await zipBuffer(translationsUrl));

  // Check if the target directory exists
  const targetPath = path.resolve(TRANSLATION_FILES_FOLDER);
  console.log('Target path:', targetPath);

  zip.extractAllTo(TRANSLATION_FILES_FOLDER, true);
}
