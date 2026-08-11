const caseStudyTags = {
    'um-gpt.html': ['UXD', 'UI/UX'],
    'motimuse.html': ['UXR', 'UXD', 'UI/UX'],
    'stardew-valley.html': ['UXR', 'UXD'],
    'counter-strike-2.html': ['ARTICLE']
};

function renderSharedTopBar() {
    const topBar = document.querySelector('.top-bar');
    if (!topBar) return;

    topBar.innerHTML = `
        <a class="top-bar-branding" href="../index.html#home" style="text-decoration: none;">Zejun Li</a>
        <form class="top-bar-search search-bar" id="caseStudySearch" role="search">
            <span class="material-symbols-outlined search-icon" aria-hidden="true">search</span>
            <input type="search" id="searchInput" placeholder="Search in Drive" aria-label="Search in Drive">
        </form>
        <div class="top-bar-actions">
            <div class="email-popover-wrapper">
                <button id="emailButton" class="social-icon" title="Email" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="emailPopover">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z"/></svg>
                </button>
                <div id="emailPopover" class="email-popover" role="dialog" aria-label="Email contact" hidden>
                    <div class="email-popover-header"><div class="email-popover-icon" aria-hidden="true"><span class="material-symbols-outlined">mail</span></div><div><p class="email-popover-title">Email</p><p class="email-popover-address">zejunli@umich.edu</p></div></div>
                    <div class="email-popover-actions"><button id="copyEmailButton" class="email-popover-action" type="button"><span class="material-symbols-outlined" aria-hidden="true">content_copy</span><span id="copyEmailText">Copy</span></button><a class="email-popover-action" href="mailto:zejunli@umich.edu"><span class="material-symbols-outlined" aria-hidden="true">open_in_new</span><span>Open email</span></a></div>
                </div>
            </div>
            <a href="https://www.linkedin.com/in/zejli/" target="_blank" rel="noopener" class="social-icon" title="LinkedIn" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 2H3.5C2.67 2 2 2.67 2 3.5V20.5C2 21.33 2.67 22 3.5 22H20.5C21.33 22 22 21.33 22 20.5V3.5C22 2.67 21.33 2 20.5 2ZM8 19H5V9H8V19ZM6.5 7.5C5.5 7.5 4.7 6.7 4.7 5.8C4.7 4.9 5.5 4.1 6.5 4.1C7.5 4.1 8.3 4.9 8.3 5.8C8.3 6.7 7.5 7.5 6.5 7.5ZM19 19H16V13.5C16 12.5 15.5 11.7 14.5 11.7C13.7 11.7 13.2 12.2 13 12.7C12.9 12.9 12.9 13.2 12.9 13.5V19H9.9V9H12.9V10.2C13.3 9.5 14.3 8.5 16 8.5C18.5 8.5 19 10.2 19 12.5V19Z"/></svg></a>
            <a href="https://github.com/zejun-l" target="_blank" rel="noopener" class="social-icon" title="GitHub" aria-label="GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
            <button id="themeToggle" class="theme-toggle" title="Toggle dark mode" type="button" aria-label="Toggle dark mode"><svg class="sun-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"/></svg><svg class="moon-icon" viewBox="0 0 24 24" style="display:none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg></button>
            <a class="avatar" href="../index.html#about" title="Profile" aria-label="Zejun Li profile"><img src="../assets/images/profile-photo.jpg" alt="Zejun Li profile photo"></a>
        </div>`;
}

function renderSharedSidebar() {
    const shell = document.querySelector('.case-study-shell');
    if (!shell || shell.parentElement?.classList.contains('case-study-layout')) return;

    const layout = document.createElement('div');
    layout.className = 'case-study-layout';
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar case-study-sidebar';
    sidebar.setAttribute('aria-label', 'Portfolio navigation');
    sidebar.innerHTML = `
        <div class="sidebar-content">
            <nav class="nav">
                <a class="nav-item" href="../index.html#home"><div class="nav-icon"><span class="material-symbols-outlined">home</span></div><span>Home</span></a>
                <a class="nav-item active" href="../index.html#projects" aria-current="page"><div class="nav-icon"><span class="material-symbols-outlined">folder</span></div><span>Projects</span></a>
                <a class="nav-item" href="../index.html#about"><div class="nav-icon"><span class="material-symbols-outlined">person</span></div><span>About</span></a>
                <a class="nav-item" href="../index.html#resume"><div class="nav-icon"><span class="material-symbols-outlined">description</span></div><span>Resume</span></a>
            </nav>
        </div>`;

    shell.parentNode.insertBefore(layout, shell);
    layout.appendChild(sidebar);
    layout.appendChild(shell);
}

function renderCaseStudyTags() {
    const fileName = window.location.pathname.split('/').pop() || '';
    const tags = caseStudyTags[fileName];
    const hero = document.querySelector('.case-study-hero');
    const title = hero?.querySelector('h1');
    if (!tags || !hero || !title) return;
    const tagRow = document.createElement('div');
    tagRow.className = 'case-study-tags';
    tagRow.setAttribute('aria-label', 'Project tags');
    tags.forEach(tag => {
        const chip = document.createElement('span');
        chip.className = 'case-study-tag';
        chip.textContent = tag.toUpperCase();
        tagRow.appendChild(chip);
    });
    hero.insertBefore(tagRow, title);
}

function renderCaseStudyFooter() {
    const footer = document.querySelector('.case-study-footer');
    if (footer) footer.textContent = '© 2026 Zejun Li · This portfolio is inspired by Google Drive’s interaction patterns and Material Design. It is not affiliated with Google.';
}

function setupImageLightbox() {
    const images = document.querySelectorAll('.case-study-media img, .case-study-cover-image img');
    if (!images.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.hidden = true;
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded project image');
    lightbox.innerHTML = `
        <div class="image-lightbox-viewport">
            <img class="image-lightbox-image" alt="" draggable="false">
        </div>
        <div class="image-lightbox-controls" aria-label="Image zoom controls">
            <button type="button" data-lightbox-action="zoom-out" aria-label="Zoom out"><span class="material-symbols-outlined" aria-hidden="true">remove</span></button>
            <output class="image-lightbox-level" aria-live="polite">100%</output>
            <button type="button" data-lightbox-action="zoom-in" aria-label="Zoom in"><span class="material-symbols-outlined" aria-hidden="true">add</span></button>
            <button type="button" data-lightbox-action="reset" aria-label="Reset zoom"><span class="material-symbols-outlined" aria-hidden="true">fit_screen</span></button>
        </div>
        <p class="image-lightbox-help">Scroll or pinch to zoom · Drag to move · Double-click to zoom in</p>
        <button class="image-lightbox-close" type="button" aria-label="Close expanded image"><span class="material-symbols-outlined" aria-hidden="true">close</span></button>`;
    document.body.appendChild(lightbox);

    const expandedImage = lightbox.querySelector('.image-lightbox-image');
    const viewport = lightbox.querySelector('.image-lightbox-viewport');
    const zoomLevel = lightbox.querySelector('.image-lightbox-level');
    const closeButton = lightbox.querySelector('.image-lightbox-close');
    let triggerImage = null;
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let dragStart = null;
    let pinchStart = null;
    const pointers = new Map();

    function clampPan() {
        const maxX = Math.max(0, (expandedImage.offsetWidth * zoom - viewport.clientWidth) / 2) + 40;
        const maxY = Math.max(0, (expandedImage.offsetHeight * zoom - viewport.clientHeight) / 2) + 40;
        panX = Math.max(-maxX, Math.min(maxX, panX));
        panY = Math.max(-maxY, Math.min(maxY, panY));
    }

    function renderTransform() {
        clampPan();
        expandedImage.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoom})`;
        zoomLevel.textContent = `${Math.round(zoom * 100)}%`;
        viewport.classList.toggle('is-zoomed', zoom > 1);
    }

    function setZoom(nextZoom, clientX, clientY) {
        const oldZoom = zoom;
        const rect = viewport.getBoundingClientRect();
        const focusX = (clientX ?? rect.left + rect.width / 2) - (rect.left + rect.width / 2);
        const focusY = (clientY ?? rect.top + rect.height / 2) - (rect.top + rect.height / 2);
        zoom = Math.max(1, Math.min(8, nextZoom));
        if (zoom !== oldZoom) {
            panX = focusX - ((focusX - panX) * zoom / oldZoom);
            panY = focusY - ((focusY - panY) * zoom / oldZoom);
        }
        if (zoom === 1) panX = panY = 0;
        renderTransform();
    }

    function resetView() {
        zoom = 1;
        panX = panY = 0;
        renderTransform();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        expandedImage.removeAttribute('src');
        resetView();
        document.body.classList.remove('lightbox-open');
        triggerImage?.focus();
    }

    function openLightbox(image) {
        triggerImage = image;
        expandedImage.src = image.currentSrc || image.src;
        expandedImage.alt = image.alt;
        lightbox.hidden = false;
        document.body.classList.add('lightbox-open');
        expandedImage.addEventListener('load', resetView, { once: true });
        closeButton.focus();
    }

    images.forEach(image => {
        image.classList.add('case-study-zoomable');
        image.tabIndex = 0;
        image.setAttribute('role', 'button');
        image.setAttribute('aria-label', `Expand image: ${image.alt || 'project image'}`);
        image.addEventListener('click', () => openLightbox(image));
        image.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(image);
            }
        });
    });

    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
    lightbox.querySelector('[data-lightbox-action="zoom-in"]').addEventListener('click', () => setZoom(zoom * 1.3));
    lightbox.querySelector('[data-lightbox-action="zoom-out"]').addEventListener('click', () => setZoom(zoom / 1.3));
    lightbox.querySelector('[data-lightbox-action="reset"]').addEventListener('click', resetView);

    viewport.addEventListener('wheel', event => {
        event.preventDefault();
        setZoom(zoom * Math.exp(-event.deltaY * .002), event.clientX, event.clientY);
    }, { passive: false });

    viewport.addEventListener('dblclick', event => {
        event.preventDefault();
        setZoom(zoom > 1 ? 1 : 2.5, event.clientX, event.clientY);
    });

    viewport.addEventListener('pointerdown', event => {
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        viewport.setPointerCapture(event.pointerId);
        if (pointers.size === 1) dragStart = { x: event.clientX, y: event.clientY, panX, panY };
        if (pointers.size === 2) {
            const [a, b] = [...pointers.values()];
            pinchStart = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom };
        }
    });

    viewport.addEventListener('pointermove', event => {
        if (!pointers.has(event.pointerId)) return;
        pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
        if (pointers.size === 2 && pinchStart) {
            const [a, b] = [...pointers.values()];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            setZoom(pinchStart.zoom * distance / Math.max(1, pinchStart.distance), (a.x + b.x) / 2, (a.y + b.y) / 2);
        } else if (dragStart && zoom > 1) {
            panX = dragStart.panX + event.clientX - dragStart.x;
            panY = dragStart.panY + event.clientY - dragStart.y;
            renderTransform();
        }
    });

    function endPointer(event) {
        pointers.delete(event.pointerId);
        dragStart = null;
        pinchStart = null;
    }
    viewport.addEventListener('pointerup', endPointer);
    viewport.addEventListener('pointercancel', endPointer);

    document.addEventListener('keydown', event => {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') closeLightbox();
        if (event.key === '+' || event.key === '=') setZoom(zoom * 1.3);
        if (event.key === '-') setZoom(zoom / 1.3);
        if (event.key === '0') resetView();
    });
}

renderSharedTopBar();
renderSharedSidebar();

const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle?.querySelector('.sun-icon');
const moonIcon = themeToggle?.querySelector('.moon-icon');

function applyTheme(theme) {
    const dark = theme === 'dark';
    document.body.classList.toggle('dark-mode', dark);
    if (sunIcon) sunIcon.style.display = dark ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = dark ? 'block' : 'none';
}

function setEmailPopoverOpen(open) {
    const button = document.getElementById('emailButton');
    const popover = document.getElementById('emailPopover');
    if (!button || !popover) return;
    popover.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
}

applyTheme(localStorage.getItem('theme') || 'light');
renderCaseStudyTags();
renderCaseStudyFooter();
setupImageLightbox();

themeToggle?.addEventListener('click', () => {
    const theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    applyTheme(theme);
});

document.getElementById('caseStudySearch')?.addEventListener('submit', event => {
    event.preventDefault();
    const query = document.getElementById('searchInput')?.value.trim() || '';
    window.location.href = `../index.html?search=${encodeURIComponent(query)}#projects`;
});

const caseStudySearchItems = [
    { icon: 'folder', title: 'U-M GPT', meta: "Redesigning Michigan's AI chatbot", keywords: 'um gpt ai chatbot uxd ui ux', url: 'um-gpt.html' },
    { icon: 'folder', title: 'MotiMuse', meta: 'Designing a mobile app to encourage music practice', keywords: 'motimuse music practice uxr uxd ui ux', url: 'motimuse.html' },
    { icon: 'folder', title: 'Stardew Valley Game Remake', meta: 'Improving the co-op player experience', keywords: 'stardew valley games ux research uxr uxd', url: 'stardew-valley.html' },
    { icon: 'article', title: 'Counter-Strike 2 Game UX Study', meta: 'Analyzing CS2 using UX heuristics', keywords: 'counter strike cs2 article games ux heuristics', url: 'counter-strike-2.html' },
    { icon: 'person', title: 'About me', meta: 'Learn more about Zejun', keywords: 'about profile skills zejun', url: '../index.html#about' },
    { icon: 'description', title: 'Resume', meta: "View Zejun's resume", keywords: 'resume cv experience education', url: '../index.html#resume' }
];

const caseStudySearchInput = document.getElementById('searchInput');
const caseStudySearchForm = document.getElementById('caseStudySearch');
const caseStudySuggestions = document.createElement('div');
caseStudySuggestions.className = 'search-suggestions';
caseStudySuggestions.id = 'searchSuggestions';
caseStudySuggestions.setAttribute('role', 'listbox');
caseStudySuggestions.hidden = true;
caseStudySearchForm?.appendChild(caseStudySuggestions);

function closeCaseStudySuggestions() {
    caseStudySuggestions.hidden = true;
    caseStudySuggestions.innerHTML = '';
    caseStudySearchInput?.setAttribute('aria-expanded', 'false');
}

function updateCaseStudySuggestions(query) {
    if (!query) {
        closeCaseStudySuggestions();
        return;
    }
    const normalized = query.toLowerCase();
    const matches = caseStudySearchItems.filter(item => `${item.title} ${item.meta} ${item.keywords}`.toLowerCase().includes(normalized)).slice(0, 6);
    caseStudySuggestions.hidden = false;
    caseStudySearchInput?.setAttribute('aria-expanded', 'true');
    if (!matches.length) {
        caseStudySuggestions.innerHTML = '<div class="search-suggestion-empty">No suggestions found</div>';
        return;
    }
    caseStudySuggestions.innerHTML = matches.map(item => `<a class="search-suggestion" role="option" href="${item.url}"><span class="material-symbols-outlined" aria-hidden="true">${item.icon}</span><span class="search-suggestion-copy"><span class="search-suggestion-title">${item.title}</span><span class="search-suggestion-meta">${item.meta}</span></span></a>`).join('');
}

caseStudySearchInput?.setAttribute('role', 'combobox');
caseStudySearchInput?.setAttribute('aria-autocomplete', 'list');
caseStudySearchInput?.setAttribute('aria-controls', 'searchSuggestions');
caseStudySearchInput?.setAttribute('aria-expanded', 'false');
caseStudySearchInput?.addEventListener('input', event => updateCaseStudySuggestions(event.target.value.trim()));
caseStudySearchInput?.addEventListener('keydown', event => { if (event.key === 'Escape') closeCaseStudySuggestions(); });
caseStudySearchForm?.addEventListener('click', event => event.stopPropagation());
document.addEventListener('click', closeCaseStudySuggestions);

document.getElementById('emailButton')?.addEventListener('click', event => {
    event.stopPropagation();
    const popover = document.getElementById('emailPopover');
    setEmailPopoverOpen(popover?.hidden ?? true);
});

document.getElementById('emailPopover')?.addEventListener('click', event => event.stopPropagation());
document.addEventListener('click', () => setEmailPopoverOpen(false));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setEmailPopoverOpen(false); });

document.getElementById('copyEmailButton')?.addEventListener('click', async () => {
    const copyText = document.getElementById('copyEmailText');
    try {
        await navigator.clipboard.writeText('zejunli@umich.edu');
        if (copyText) copyText.textContent = 'Copied';
    } catch (error) {
        if (copyText) copyText.textContent = 'Copy failed';
    }
    window.setTimeout(() => { if (copyText) copyText.textContent = 'Copy'; }, 1600);
});

document.querySelector('.case-study-back')?.addEventListener('click', event => {
    event.preventDefault();
    let cameFromPortfolio = false;
    if (document.referrer) {
        try {
            const referrer = new URL(document.referrer);
            cameFromPortfolio = referrer.origin === window.location.origin && referrer.pathname !== window.location.pathname;
        } catch (error) {
            cameFromPortfolio = false;
        }
    }

    if (cameFromPortfolio) {
        window.history.back();
        return;
    }

    const returnPage = sessionStorage.getItem('caseStudyReturnPage');
    window.location.href = `../index.html#${returnPage === 'home' ? 'home' : 'projects'}`;
});
