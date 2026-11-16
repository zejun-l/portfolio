import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
async function walk(directory) {
    const files = await readdir(directory, { withFileTypes: true });
    return (await Promise.all(files.filter(file => !file.name.startsWith('.')).map(file => {
        const name = path.join(directory, file.name);
        return file.isDirectory() ? walk(name) : [name];
    }))).flat();
}
let checked = 0;
for (const file of (await walk(root)).filter(file => file.endsWith('.html'))) {
    const html = await readFile(file, 'utf8');
    const documentUrl = pathToFileURL(file);
    const base = new URL(html.match(/<base\s+href="([^"]+)"/)?.[1] || '', documentUrl);
    for (const [, value] of html.replace(/<base\b[^>]*>/g, '').matchAll(/(?:src|href|data-src)="([^"]+)"/g)) {
        const url = new URL(value.replaceAll('&amp;', '&'), base);
        if (url.protocol !== 'file:') continue;
        let target = fileURLToPath(url);
        const info = await stat(target).catch(() => null);
        if (info?.isDirectory()) target = path.join(target, 'index.html');
        if (!(await stat(target).catch(() => null))?.isFile()) throw new Error(`${path.relative(root,file)}: missing ${value}`);
        checked++;
    }
}
const data = JSON.parse(await readFile(new URL('../data.json', import.meta.url), 'utf8'));
for (const relative of [data.profile.resumeUrl, data.profile.profilePhotoUrl, ...data.projects.flatMap(project => [project.image, project.url + 'index.html'])]) {
    if (!(await stat(path.join(root, relative)).catch(() => null))?.isFile()) throw new Error(`data.json: missing ${relative}`);
    checked++;
}
console.log(`PASS: ${checked} local file references`);
