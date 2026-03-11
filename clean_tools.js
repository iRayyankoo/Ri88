/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const tsxDir = path.join(__dirname, 'src/components/tools');
let allCases = new Set();
fs.readdirSync(tsxDir).forEach(file => {
    if (file.endsWith('.tsx')) {
        const content = fs.readFileSync(path.join(tsxDir, file), 'utf-8');
        const matches = [...content.matchAll(/case\s+['"]([^'"]+)['"]/g)];
        matches.forEach(m => allCases.add(m[1]));
    }
});

const toolsTsPath = path.join(__dirname, 'src/data/tools.ts');
let toolsTs = fs.readFileSync(toolsTsPath, 'utf8');

const toolRegex = /\{[\s\n]*id:\s*'([^']+)',[\s\S]*?\}(?=\s*,|\s*\])/g;

toolsTs = toolsTs.replace(toolRegex, (match, id) => {
    if (allCases.has(id)) {
        return match;
    } else {
        console.log(`Removing unimplemented tool: ${id}`);
        return `null/*RM ${id}*/`;
    }
});

toolsTs = toolsTs.replace(/,\s*null\/\*RM [^\*]+\*\//g, '');
toolsTs = toolsTs.replace(/null\/\*RM [^\*]+\*\/\s*,/g, '');
toolsTs = toolsTs.replace(/null\/\*RM [^\*]+\*\//g, '');

fs.writeFileSync(toolsTsPath, toolsTs);
console.log(`Found ${allCases.size} implemented tools instances.`);
console.log('Done cleaning tools.ts!');
