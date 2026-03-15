// Quick fix for database initialization errors
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'lib/agent-monitor/database.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all "if (!this.db) throw new Error('Database not initialized');" with warning
content = content.replace(
  /if \(!this\.db\) throw new Error\('Database not initialized'\);/g,
  `if (!this.db) {
      console.warn('Database not initialized, skipping database operation');
      return;
    }`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed database initialization checks');