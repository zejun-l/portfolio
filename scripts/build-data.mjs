import { readFile, writeFile } from 'node:fs/promises';
const source = new URL('../data.json', import.meta.url);
const target = new URL('../js/data.js', import.meta.url);
const data = JSON.parse(await readFile(source, 'utf8'));
const output = '// Generated from data.json by scripts/build-data.mjs. Do not edit directly.\nwindow.PORTFOLIO_DATA = ' + JSON.stringify(data) + ';\n';
const index = (await readFile(new URL('../index.html', import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
const outputs = new Map([[target, output]]);
for (const route of ['projects', 'about', 'resume']) {
    outputs.set(new URL(`../${route}/index.html`, import.meta.url), index.replace('<head>', '<head>\n    <base href="../">'));
}
for (const [file, content] of outputs) {
    if (process.argv.includes('--check')) {
        if ((await readFile(file, 'utf8')).replace(/\r\n/g, '\n') !== content) throw new Error(`Run node scripts/build-data.mjs to update ${file.pathname}.`);
    } else {
        const { mkdir } = await import('node:fs/promises');
        await mkdir(new URL('./', file), {recursive: true});
        await writeFile(file, content);
    }
}
if (process.argv.includes('--check')) console.log('Portfolio data and route pages are up to date.');
