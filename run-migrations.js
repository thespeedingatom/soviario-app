#!/usr/bin/env node

/**
 * This script runs the Better Auth database migrations.
 * It creates the necessary tables in your database for Better Auth to work.
 * 
 * Usage:
 * node run-migrations.js
 */

const { execSync } = require('child_process');

console.log('Running Better Auth database migrations...');

try {
  // Run the Better Auth CLI migrate command
  execSync('npx @better-auth/cli migrate', { stdio: 'inherit' });
  
  console.log('\n✅ Database migrations completed successfully!');
  console.log('\nThe following tables have been created:');
  console.log('- user');
  console.log('- account');
  console.log('- session');
  console.log('- verification');
  
  console.log('\nNext steps:');
  console.log('1. Run the user migration script: node migration.js');
  console.log('2. Update your environment variables');
  console.log('3. Restart your application');
  
} catch (error) {
  console.error('\n❌ Error running database migrations:', error.message);
  console.error('\nPossible causes:');
  console.error('- DATABASE_URL environment variable is not set or is incorrect');
  console.error('- Database server is not running');
  console.error('- Insufficient permissions to create tables');
  
  process.exit(1);
}
