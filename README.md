Google Drive-inspired portfolio

This is a static HTML/CSS/JavaScript site. No framework or server is required.

Edit `data.json` for profile details, project summaries, tags, skills, and search metadata. Edit `index.html` for the main layout and `projects/<slug>/index.html` for case-study content. Shared browser helpers live in `js/shared.js`.

After editing data or the main layout, run:

```sh
node scripts/build-data.mjs
node scripts/build-data.mjs --check
node scripts/check-links.mjs
```

Commit the generated `js/data.js` and route pages (`projects/index.html`, `about/index.html`, and `resume/index.html`) alongside the source changes. The generated data works over HTTP and when opening local files, without maintaining separate fallback content. GitHub Actions checks that these files stay synchronized and local links exist.

The resume is stored at `assets/zejun-li-resume.pdf`; replacing that file updates the preview, open link, and download. Keep `profile.resumeUrl` synchronized if renaming it.

Optional browser checks use Playwright, pngjs, and pixelmatch (available in the Codex runtime). With these packages on `NODE_PATH`, run `node scripts/browser-check.cjs`. To compare appearance and visible text, first capture baselines with `node scripts/browser-check.cjs /absolute/path/to/baselines --record`, then run the same command without `--record`. Baselines belong outside the repository. The checks cover desktop/mobile, both themes, direct routes, and resume downloads. External fonts are blocked for reproducible comparisons; bitmap images and PDF viewers are masked to avoid image-decoding and animation noise while still comparing their layout bounds. Image assets are unchanged by this refactor.

The Snap Finance password screen is a client-side gate on a static site. Actual access control would require authenticated hosting or a backend that withholds the protected HTML and assets.
