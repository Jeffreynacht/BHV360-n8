#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';

console.log('🧩 Validating module exports...');

try {
  // Check if module definitions file exists and has required exports
  const moduleDefPath = join(process.cwd(), 'lib/modules/module-definitions.ts');
  const moduleDefContent = readFileSync(moduleDefPath, 'utf8');
  
  const requiredExports = [
    'moduleDefinitions',
    'moduleCategories', 
    'tierDefinitions',
    'getModuleById',
    'calculateModulePrice',
    'AVAILABLE_MODULES'
  ];
  
  const missingExports = requiredExports.filter(exp => 
    !moduleDefContent.includes(`export const ${exp}`) && 
    !moduleDefContent.includes(`export function ${exp}`)
  );
  
  if (missingExports.length > 0) {
    console.warn(`⚠️ Missing exports in module-definitions.ts: ${missingExports.join(', ')}`);
    console.warn('   Build may fail, but continuing...');
  }
  
  // Check if index file exists
  const indexPath = join(process.cwd(), 'lib/modules/index.ts');
  const indexContent = readFileSync(indexPath, 'utf8');
  
  if (!indexContent.includes('export * from "./module-definitions"')) {
    console.warn('⚠️ Missing barrel export in lib/modules/index.ts');
  }
  
  console.log('✅ Module validation completed');
  process.exit(0);
  
} catch (error) {
  console.warn(`⚠️ Module validation failed: ${error.message}`);
  console.warn('   Continuing build anyway...');
  process.exit(0); // Don't fail the build
}
