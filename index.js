#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const projectName = process.argv[2];

if (!projectName) {
  console.error('Please specify a project name!');
  console.log('Usage: npx degit-custom armangrewal007/template my-project');
  process.exit(1);
}

async function main() {
  try {
    // Clone the template using degit
    console.log('🚀 Cloning template...');
    execSync(`npx degit armangrewal007/template ${projectName}`);

    // Initialize git
    console.log('📦 Initializing git repository...');
    execSync('git init', { cwd: projectName });

    // Update vite.config.js
    console.log('⚙️ Configuring Vite...');
    const viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ghPages } from "vite-plugin-gh-pages";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), ghPages()],
    base: mode === "production" ? "/${projectName}/" : "/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
`;

    fs.writeFileSync(path.join(projectName, 'vite.config.js'), viteConfig);

    // Read and update package.json
    const packageJsonPath = path.join(projectName, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Update package name
    packageJson.name = projectName;

    // Write back the updated package.json
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log('\n✅ Setup complete! Your project is ready.');
    console.log(`\nNext steps:
    cd ${projectName}
    npm install
    npm run dev
    
To deploy to GitHub Pages:
    1. Create a new repository on GitHub
    2. Push your code
    3. Run: npm run deploy`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();