// Reason: One-off utility/temp file moved to archive during codebase cleanup.
const fs = require('fs'); const txt = fs.readFileSync('recovery_maps.txt', 'utf8'); if (!txt.trim()) { console.log('Empty'); process.exit(0); } const line = JSON.parse(txt); const lines = line.content.split('\n').filter(l => /^\d+: /.test(l)).map(l => l.replace(/^\d+: /, '')); fs.writeFileSync('app/(tabs)/maps.tsx', lines.join('\n')); console.log('Recovered ' + lines.length + ' lines');

