const fs = require('fs');
const filepath = 'app/api/analyze/route.js';
let text = fs.readFileSync(filepath, 'utf8');

// Fix the backslashes that were double-escaped during earlier code patching
text = text.split('\\\\n').join('\\n');
text = text.split('\\\\s').join('\\s');

fs.writeFileSync(filepath, text);
console.log('Fixed double-escaped backslashes in route.js');
