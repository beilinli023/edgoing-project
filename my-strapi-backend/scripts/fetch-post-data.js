const path = require('path');

// Import from the package again, assuming the build process made it work
const strapiFactory = require('@strapi/strapi').createStrapi; 

if (typeof strapiFactory !== 'function') {
    console.error('Error: createStrapi function not found in @strapi/strapi import after build.');
    process.exit(1);
}

const strapiRootPath = path.join(__dirname, '..');
const distDir = path.join(strapiRootPath, 'dist'); // Define dist directory path

let instance;

async function runScript() {
  try {
    console.log('Bootstrapping Strapi (post-build, specifying distDir)...');
    // Load Strapi, explicitly specifying the dist directory
    instance = await strapiFactory({
      appDir: strapiRootPath,
      distDir: distDir, // Add distDir back
      serveAdminPanel: false 
    }).load();

    const strapi = instance;
    // Assuming the documentId is still the same one we found.
    // If the en/zh posts you mentioned have a different documentId, please provide it.
    const targetDocumentId = 'sr78q6aaf8eysibhamuoq0gj'; 

    console.log(`Attempting to fetch documentId: ${targetDocumentId}`);

    try {
      console.log('\n--- Fetching English Version (locale: en) ---');
      const englishPost = await strapi.documents('api::blogpost.blogpost').findOne({
        documentId: targetDocumentId,
        locale: 'en' // Specify English
      });

      if (englishPost) {
        console.log('Found English Post (en):');
        console.log(JSON.stringify(englishPost, null, 2));
      } else {
        console.log('English post (en) not found for this documentId.');
      }

    } catch (error) {
      console.error('\nError fetching English post (en):', error);
    }

    try {
      console.log('\n--- Fetching Chinese Version (locale: zh) ---');
      const chinesePost = await strapi.documents('api::blogpost.blogpost').findOne({
          documentId: targetDocumentId,
          locale: 'zh' // Specify Chinese
      });

      if (chinesePost) {
        console.log('Found Chinese Post (zh):');
        console.log(JSON.stringify(chinesePost, null, 2));
      } else {
        console.log('Chinese post (zh) not found for this documentId.');
      }

    } catch (error) {
      console.error('\nError fetching Chinese post (zh):', error);
    }

  } catch (err) {
    console.error('Error during script execution:', err);
    process.exitCode = 1; 
  } finally {
    if (instance) {
      try {
          await instance.destroy();
          console.log('Strapi instance destroyed.');
      } catch (destroyErr) {
          console.error('Error destroying Strapi instance:', destroyErr);
      }
    }
    process.exit();
  }
}

runScript(); 