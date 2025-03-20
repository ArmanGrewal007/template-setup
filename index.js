#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

let projectName = process.argv[2];

if (!projectName) {
  console.error('Please specify a project name!');
  console.log('Usage: npx degit-custom armangrewal007/template my-project');
  process.exit(1);
}

let projectPath = projectName; // projectPath = '.'
// If the user runs `npx create-armangrewal007-app .`
if (projectName === '.') {
  projectName = path.basename(process.cwd());
}

async function main() {
  try {
    debugger;
    // Clone the template using degit
    console.log('🚀 Cloning template...');
    execSync(`npx degit armangrewal007/template "${projectPath}"`);

    // Initialize git
    console.log('📦 Initializing git repository...');
    execSync('git init', { cwd: projectPath });

    // Update vite.config.js
    console.log('⚙️ Configuring Vite ...');
    const viteConfigPath = path.join(projectPath, 'vite.config.js');
    let viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');
    viteConfigContent = viteConfigContent.replace(
      /base:\s*mode === "production" \? "(.*?)" : "\/",/,
      `base: mode === "production" ? "/${projectName}/" : "/",`
    );
    fs.writeFileSync(viteConfigPath, viteConfigContent);

    // Update package.json
    console.log('⚙️ Updating package name in package.json ...');
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    // Update index.html title
    console.log('⚙️ Updating package name in index.html ...');
    const indexPath = path.join(projectPath, 'index.html');
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    indexHtml = indexHtml.replace(/<title>(.*?)<\/title>/, `<title>${projectName}</title>`);
    fs.writeFileSync(indexPath, indexHtml);

    // Updating App.jsx heading
    console.log('⚙️ Updating package name in App.jsx heading ...');
    const appPath = path.join(projectPath, 'src', 'App.jsx');
    let appContent = fs.readFileSync(appPath, 'utf8');
    appContent = appContent.replace(/Arman's Template/, projectName);
    fs.writeFileSync(appPath, appContent);

    console.log('\n✅ Setup complete! Your project is ready.\nNext steps:');
    if (projectName !== path.basename(process.cwd())) {
      console.log(`\x1b[1m\x1b[36m    cd "${projectName}"\x1b[0m`);
    }
    console.log(`\x1b[1m\x1b[36m    code .\x1b[0m
\x1b[1m\x1b[36m    npm install\x1b[0m
\x1b[1m\x1b[36m    npm run dev\x1b[0m
    
To deploy to GitHub Pages:
    1. Create a new repository on GitHub
    2. Push your code
    3. Run: npm run deploy to publish to github pages`);    

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();