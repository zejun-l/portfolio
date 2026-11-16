// Run with Playwright available in NODE_PATH. Baselines stay outside the repository.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const { PNG } = require('pngjs');
const baseline = process.argv[2];
const record = process.argv.includes('--record');
const root = path.resolve(__dirname, '..');
const reference = new Map();
const referenceCommit = process.argv.find(argument => argument.startsWith('--reference='))?.slice('--reference='.length);
if (referenceCommit) {
 const { execFileSync } = require('node:child_process');
 const files = execFileSync('git',['ls-tree','-r','--name-only',referenceCommit],{cwd:root,encoding:'utf8'}).trim().split('\n');
 for (const file of files.filter(file => /\.(html|js|css|json)$/.test(file))) reference.set(path.join(root,file),execFileSync('git',['show',referenceCommit+':'+file],{cwd:root}));
}
const types = {'.pdf':'application/pdf','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.gif':'image/gif'};
const server = http.createServer((req, res) => {
 let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/portfolio\//, '/');
 let file = path.join(root, name);
 if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end(); return; }
 if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
 if (!fs.existsSync(file)) { file = path.join(root, '404.html'); res.statusCode = 404; }
 res.setHeader('Content-Type', types[path.extname(file)] || 'text/html');
 res.end(reference.get(file) || fs.readFileSync(file));
});
(async () => {
 const { default: pixelmatch } = await import(require('node:url').pathToFileURL(require.resolve('pixelmatch')).href);
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
 const origin = 'http://127.0.0.1:' + server.address().port;
 const browser = await chromium.launch({channel:'msedge', headless:true});
 try {
  if (baseline) {
   fs.mkdirSync(baseline, {recursive:true});
   for (const width of [1280, 390]) for (const theme of ['light', 'dark']) {
    const page = await browser.newPage({viewport:{width,height:844}});
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.addInitScript(theme => localStorage.setItem('theme', theme), theme);
    const routes = ['', '?route=projects', '?route=about', ...['um-gpt','motimuse','stardew-valley','counter-strike-2','snap-finance'].map(slug => 'projects/'+slug+'/')];
    for (const [index, route] of routes.entries()) {
     await page.goto(origin+'/'+route);
     await page.waitForFunction(() => document.querySelector('.project-card, .case-study-tags'));
     await page.locator('body').evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(img => img.loading !== 'lazy').map(img => img.decode().catch(()=>{}))); });
     await page.waitForFunction(() => [...document.images].filter(img => { const r = img.getBoundingClientRect(); return r.width && r.height && r.top < innerHeight && r.bottom > 0; }).every(img => img.complete));
     await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
     const key = width+'-'+theme+'-'+index;
     const text = await page.locator('body').innerText();
     const screenshotOptions = {animations:'disabled', mask:[page.locator('img, iframe')]};
     let png = await page.screenshot(screenshotOptions);
     const imageFile = path.join(baseline,key+'.png');
     const textFile = path.join(baseline,key+'.txt');
     if (record) { fs.writeFileSync(imageFile,png); fs.writeFileSync(textFile,text); }
     else {
      assert.equal(text,fs.readFileSync(textFile,'utf8'),key+' content changed');
      const before = PNG.sync.read(fs.readFileSync(imageFile));
      let changed;
      for (let attempt = 0; attempt < 4; attempt++) {
       const after = PNG.sync.read(png);
       changed = pixelmatch(before.data,after.data,null,before.width,before.height,{threshold:0.1});
       if (changed <= 10) break;
       await page.waitForTimeout(250);
       png = await page.screenshot(screenshotOptions);
      }
      if (changed) fs.writeFileSync(path.join(baseline,key+'-actual.png'),png);
      assert.ok(changed <= 10,key+' appearance changed ('+changed+' pixels)');
     }
    }
    await page.close();
   }
   console.log(record ? 'Recorded 32 desktop/mobile/light/dark baselines' : 'PASS: 32 appearance and content comparisons');
  }
  if (!record) {
   const page = await browser.newPage({acceptDownloads:true});
   const errors = [];
   page.on('pageerror', error => errors.push(error.message));
   for (const prefix of ['/', '/portfolio/']) {
    const response = await page.goto(origin+prefix+'resume/');
    assert.equal(response.status(),200,'Direct routes must not rely on 404 recovery');
    await page.locator('#resumeDownloadLink').waitFor({state:'visible'});
    const pdf = origin+prefix+encodeURI('assets/Li, Zejun Resume.pdf');
    for(const id of ['resumeFrame','resumeOpenLink','resumeDownloadLink']) assert.equal(await page.locator('#'+id).evaluate(el=>el.src||el.href),pdf);
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#resumeDownloadLink').click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(),'Li, Zejun Resume.pdf');
    assert.ok(fs.readFileSync(await download.path()).equals(fs.readFileSync(path.join(root,'assets/Li, Zejun Resume.pdf'))));
   }
   assert.deepEqual(errors,[]);
   console.log('PASS: direct resume routes at root/subpath and exact PDF downloads');
   await page.goto(origin+'/');
   await page.locator('.nav-item[data-id=about]').click();
   await page.locator('.nav-item[data-id=projects]').click();
   await page.goBack();
   await page.locator('#page-about').waitFor({state:'visible'});
   await page.goForward();
   await page.locator('#page-projects').waitFor({state:'visible'});
   await page.locator('#searchInput').fill('U-M GPT');
   await page.locator('#searchInput').press('Enter');
   assert.equal(new URL(page.url()).searchParams.get('search'),'U-M GPT');
   await page.reload();
   await page.locator('#projectsPageTitle').filter({hasText:'Search results'}).waitFor();
   assert.ok((await page.locator('#projectsGrid').innerText()).includes('U-M GPT'));
   await page.goto(origin+'/projects/um-gpt/');
   await page.locator('#searchInput').fill('music');
   assert.equal(await page.locator('.search-suggestion-title').first().innerText(),'MotiMuse');
   const image = page.locator('.case-study-media img').first();
   await image.click();
   await page.locator('.image-lightbox').waitFor({state:'visible'});
   await page.keyboard.press('Escape');
   await page.locator('.image-lightbox').waitFor({state:'hidden'});
   console.log('PASS: back/forward navigation, reloadable search, case-study suggestions and lightbox');
   const blocked = await browser.newPage();
   const blockedErrors = [];
   blocked.on('pageerror',error=>blockedErrors.push(error.message));
   await blocked.addInitScript(() => {
    for(const key of ['localStorage','sessionStorage']) Object.defineProperty(window,key,{get(){throw new DOMException('Storage blocked','SecurityError');}});
   });
   await blocked.goto(origin+'/');
   await blocked.locator('#featuredGrid .project-card').first().waitFor();
   await blocked.locator('#themeToggle').click();
   assert.ok(await blocked.locator('body').evaluate(body=>body.classList.contains('dark-mode')));
   await blocked.goto(origin+'/projects/snap-finance/');
   await blocked.locator('#snapPassword').fill('not-the-password');
   await blocked.locator('#snapPasswordForm button').click();
   await blocked.locator('#snapPasswordError').filter({hasText:'Incorrect password'}).waitFor();
   assert.deepEqual(blockedErrors,[]);
   await blocked.close();
   await page.goto(require('node:url').pathToFileURL(path.join(root,'index.html')).href);
   await page.locator('#featuredGrid .project-card').first().waitFor();
   console.log('PASS: storage-blocked browsers and file:// data loading');
   await page.close();
  }
 } finally { await browser.close(); server.close(); }
})().catch(error => {console.error(error); server.close(); process.exitCode=1;});
