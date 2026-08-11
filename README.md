# Portfolio

A static, Google Drive–inspired UX portfolio. 
## Project structure

```text
assets/             Images and documents
css/                Shared portfolio and case-study styles
js/                 Homepage and case-study behavior
projects/           Standalone project case studies
data.json           Profile, navigation, project, and search data
index.html          Main portfolio shell
```

## Run locally

Serve the folder over HTTP so `index.html` can fetch `data.json`:

```powershell
python -m http.server 8765
```

Then open `http://127.0.0.1:8765/`.

## Editing content

- Update project-card summaries and URLs in `data.json`.
- Edit long-form project content in the corresponding file under `projects/`.
- Add case-study images under `assets/images/` and replace the labeled placeholders.
- Shared homepage styles live in `css/styles.css`; case-study-specific styles live in `css/case-study.css`.
