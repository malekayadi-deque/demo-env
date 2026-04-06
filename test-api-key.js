#!/usr/bin/env node
/**
 * Standalone script to test axe DevTools API key validity
 * Run with: node test-api-key.js
 * Or with a specific key: node test-api-key.js YOUR_API_KEY
 */

require("dotenv").config();

const apiKey = process.argv[2] || process.env.PLAYWRIGHT_API_KEY;
const serverUrl = process.env.SERVER_URL || "https://axe.deque.com";

if (!apiKey) {
  console.error("❌ No API key provided.");
  console.error("Usage: node test-api-key.js [API_KEY]");
  console.error("Or set PLAYWRIGHT_API_KEY in your .env file");
  process.exit(1);
}

console.log("🔍 Testing axe DevTools API Key");
console.log("================================");
console.log(`Server URL: ${serverUrl}`);
console.log(
  `API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`,
);
console.log("");

async function testApiKey() {
  try {
    // The axe-watcher validates the API key by making a request to the axe server
    // We'll simulate this by making a direct request to the API
    const response = await fetch(`${serverUrl}/api/v1/projects`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`Response Status: ${response.status}`);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ API Key is VALID!");
      console.log("");
      console.log("Available Projects:");
      if (data && data.length > 0) {
        data.forEach((project, index) => {
          console.log(`  ${index + 1}. ${project.name || project.id}`);
          console.log(`     ID: ${project.id}`);
        });
      } else {
        console.log(
          "  No projects found. You may need to create a project first.",
        );
      }
      return true;
    } else if (response.status === 401 || response.status === 403) {
      console.log("❌ API Key is INVALID or EXPIRED");
      const text = await response.text();
      console.log(`Server response: ${text}`);
      return false;
    } else {
      console.log(`⚠️  Unexpected response: ${response.status}`);
      const text = await response.text();
      console.log(`Server response: ${text}`);
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing API key:", error.message);
    return false;
  }
}

// Alternative: Test using the watcher initialization directly
async function testWithWatcher() {
  console.log("");
  console.log("🔍 Testing with @axe-core/watcher initialization...");
  console.log("================================================");

  try {
    const { playwrightTest } = require("@axe-core/watcher");

    // This will throw if the API key is invalid
    const { test, expect } = playwrightTest({
      axe: {
        apiKey: apiKey,
        buildID: process.env.BUILD_ID || "test-build",
        projectID: process.env.PROJECT_ID, // Now recommended
      },
      headless: true,
    });

    console.log("✅ Watcher initialized successfully - API key is valid!");
    return true;
  } catch (error) {
    console.log("❌ Watcher initialization failed:");
    console.log(`   ${error.message}`);
    return false;
  }
}

async function main() {
  // First try direct API call
  const directResult = await testApiKey();

  // Then try watcher initialization
  const watcherResult = await testWithWatcher();

  console.log("");
  console.log("================================");
  console.log("Summary:");
  console.log(`  Direct API test: ${directResult ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`  Watcher test:    ${watcherResult ? "✅ PASS" : "❌ FAIL"}`);
  console.log("");

  if (!directResult && !watcherResult) {
    console.log("Troubleshooting steps:");
    console.log("1. Verify your API key at https://axe.deque.com");
    console.log(
      "2. Check if the key is for the correct product (axe DevTools for Web)",
    );
    console.log("3. Ensure the key hasn't expired");
    console.log(
      "4. Try generating a new API key from the axe DevTools dashboard",
    );
    console.log("5. Make sure you're using the correct SERVER_URL");
    process.exit(1);
  }
}

main();
