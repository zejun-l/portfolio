let portfolioData = {};
        let navigationItems = [];
        let projects = [];
        let skills = [];

        async function loadPortfolioData() {
            try {
                const response = await fetch('data.json', { cache: 'no-cache' });
                if (!response.ok) {
                    throw new Error(`Could not load data.json (${response.status})`);
                }
                portfolioData = await response.json();
                navigationItems = portfolioData.navigationItems || [];
                projects = portfolioData.projects || [];
                skills = portfolioData.skills || [];
                applyPortfolioData();
                renderNavigation();
                updateStickyOffsets();
                const initialPage = window.location.hash.replace('#', '');
                showPage(['projects', 'about', 'resume'].includes(initialPage) ? initialPage : 'home');
            } catch (error) {
                console.error(error);
                document.getElementById('featuredGrid').innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        Portfolio content could not load. Make sure data.json is uploaded in the same GitHub folder as index.html.
                    </div>
                `;
            }
        }

        function applyPortfolioData() {
            const profile = portfolioData.profile || {};
            setText('siteBranding', profile.name || 'Zejun Li');
            setText('homeTitle', profile.siteTitle || "Welcome to Zejun's Drive");
            setText('homeSubtitle', profile.homeSubtitle || 'Suggested projects');
            setText('aboutTitle', profile.aboutTitle || 'About me');
            setText('aboutText', profile.aboutText || '');
            setText('skillsTitle', profile.skillsTitle || 'Skills');
            setText('resumeTitle', profile.resumeTitle || 'Resume');
            setText('siteFooterYear', new Date().getFullYear());
            setText('siteFooterName', profile.name || 'Zejun Li');
            setText('siteFooterNote', profile.footerNote || 'This portfolio is inspired by Google Drive’s interaction patterns and Material Design. It is not affiliated with Google.');

            updateEmailContact(profile.email || 'zejunli@umich.edu');

            const linkedinLink = document.getElementById('linkedinLink');
            if (linkedinLink && profile.linkedinUrl) {
                linkedinLink.href = profile.linkedinUrl;
            }

            const githubLink = document.getElementById('githubLink');
            if (githubLink && profile.githubUrl) {
                githubLink.href = profile.githubUrl;
            }

            const profilePhoto = document.getElementById('profilePhoto');
            if (profilePhoto && profile.profilePhotoUrl) {
                profilePhoto.src = profile.profilePhotoUrl;
                profilePhoto.alt = `${profile.name || 'Profile'} profile photo`;
            }

            const resumeFrame = document.getElementById('resumeFrame');
            if (resumeFrame && profile.resumeUrl) {
                resumeFrame.src = profile.resumeUrl;
            }
        }

        function setText(id, value) {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        }

        function updateStickyOffsets() {
            const topBar = document.querySelector('.top-bar');
            if (topBar) {
                document.documentElement.style.setProperty('--top-bar-height', `${topBar.offsetHeight}px`);
            }
        }

        function escapeHTML(value) {
            return String(value || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        function getIcon(iconName) {
            const icons = {
                home: '<span class="material-symbols-outlined">home</span>',
                folder: '<span class="material-symbols-outlined">folder</span>',
                user: '<span class="material-symbols-outlined">person</span>',
                info: '<span class="material-symbols-outlined">info</span>',
                description: '<span class="material-symbols-outlined">description</span>',
                mail: '<span class="material-symbols-outlined">mail</span>',
                verified: '<span class="material-symbols-outlined">verified</span>',
            };
            return icons[iconName] || '';
        }

        function getTagClass(tag) {
            return String(tag || '')
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '');
        }

        function renderTags(tags = []) {
            return tags.map(tag => `<span class="project-tag tag-${getTagClass(tag)}">${escapeHTML(tag)}</span>`).join('');
        }

        function renderNavigation() {
            const nav = document.getElementById('nav');
            nav.innerHTML = navigationItems.map(item => `
                <a class="nav-item ${item.id === 'home' ? 'active' : ''}" data-id="${escapeHTML(item.id)}" href="#${escapeHTML(item.id)}">
                    <div class="nav-icon">${getIcon(item.icon)}</div>
                    <span>${escapeHTML(item.label)}</span>
                </a>
            `).join('');

            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', () => {
                    showPage(item.dataset.id);
                });
            });
        }

        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.style.display = 'none';
            });

            const page = document.getElementById(`page-${pageId}`);
            if (!page) return;
            page.style.display = 'block';
            if (window.location.hash !== `#${pageId}`) {
                history.replaceState(null, '', `#${pageId}`);
            }

            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.dataset.id === pageId) {
                    item.classList.add('active');
                }
            });

            if (pageId === 'home') {
                renderFeaturedProjects();
            } else if (pageId === 'projects') {
                renderProjects(projects);
            } else if (pageId === 'about') {
                renderSkills();
            }
        }

        function renderProjects(filtered = projects) {
            const grid = document.getElementById('projectsGrid');
            const emptyState = document.getElementById('emptyState');
            const projectCount = document.getElementById('projectCount');
            const projectsPageTitle = document.getElementById('projectsPageTitle');

            projectsPageTitle.textContent = 'Projects';
            projectCount.textContent = `${filtered.length} project${filtered.length === 1 ? '' : 's'} found`;

            if (filtered.length === 0) {
                grid.style.display = 'none';
                emptyState.style.display = 'block';
                emptyState.innerHTML = `No projects found matching "<span id="searchTerm"></span>"`;
                document.getElementById('searchTerm').textContent = document.getElementById('searchInput').value;
                return;
            }

            grid.style.display = 'grid';
            emptyState.style.display = 'none';
            grid.innerHTML = filtered.map(project => `
                <a class="project-card" href="${escapeHTML(project.url)}">
                    <div class="project-icon">
                        <span class="material-symbols-outlined">folder</span>
                    </div>
                    <h3>${escapeHTML(project.title)}</h3>
                    <p>${escapeHTML(project.description)}</p>
                    <div class="project-footer">
                        <span>${escapeHTML(project.date)}</span>
                        <div class="project-tags-footer">
                            ${renderTags(project.tags || [])}
                        </div>
                    </div>
                </a>
            `).join('');
        }

        function normalizeSearchText(value) {
            return String(value || '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, ' ')
                .trim();
        }

        function compactSearchText(value) {
            return normalizeSearchText(value).replace(/\s+/g, '');
        }

        function getProjectSearchText(project) {
            const metaText = project.metaFields
                ? project.metaFields.map(field => `${field.label} ${field.value}`).join(' ')
                : '';
            return normalizeSearchText([
                project.title,
                project.description,
                project.fullDescription,
                project.date,
                project.status,
                project.role,
                project.teamSize,
                project.timeline,
                metaText,
                project.tags ? project.tags.join(' ') : '',
                'project case study portfolio'
            ].join(' '));
        }

        function getSearchResults(query) {
            const normalizedQuery = normalizeSearchText(query);
            if (!normalizedQuery) return [];

            const searchableItems = [
                ...projects.map(project => ({
                    type: 'project',
                    icon: 'folder',
                    title: project.title,
                    description: project.description,
                    date: project.date,
                    tags: project.tags || [],
                    projectId: project.id,
                    searchText: getProjectSearchText(project),
                })),
                ...skills.map(skill => ({
                    type: 'skill',
                    icon: 'verified',
                    title: skill.title,
                    description: '',
                    date: 'Skill',
                    tags: [],
                    pageId: 'about',
                    searchText: normalizeSearchText(`${skill.title} skill expertise`),
                })),
                ...(portfolioData.searchPages || []).map(page => ({
                    ...page,
                    tags: page.tags || [],
                    searchText: normalizeSearchText(`${page.title} ${page.description} ${page.keywords}`),
                })),
            ];

            const compactQuery = compactSearchText(query);
            return searchableItems.filter(item => {
                const compactItemText = compactSearchText(item.searchText);
                return item.searchText.includes(normalizedQuery) || compactItemText.includes(compactQuery);
            });
        }

        function renderSearchResults(results, query) {
            const grid = document.getElementById('projectsGrid');
            const emptyState = document.getElementById('emptyState');
            const projectCount = document.getElementById('projectCount');
            const projectsPageTitle = document.getElementById('projectsPageTitle');

            projectsPageTitle.textContent = 'Search results';
            projectCount.textContent = `${results.length} result${results.length === 1 ? '' : 's'} found in Drive`;

            if (results.length === 0) {
                grid.style.display = 'none';
                emptyState.style.display = 'block';
                emptyState.innerHTML = `No results found matching "<span id="searchTerm"></span>"`;
                document.getElementById('searchTerm').textContent = query;
                return;
            }

            grid.style.display = 'grid';
            emptyState.style.display = 'none';
            grid.innerHTML = results.map((result, index) => `
                <div class="project-card" data-result-index="${index}" style="cursor: pointer;">
                    <div class="project-icon">
                        <span class="material-symbols-outlined">${escapeHTML(result.icon)}</span>
                    </div>
                    <h3>${escapeHTML(result.title)}</h3>
                    ${result.description ? `<p>${escapeHTML(result.description)}</p>` : ''}
                    <div class="project-footer">
                        <span>${escapeHTML(result.date)}</span>
                        <div class="project-tags-footer">
                            ${renderTags(result.tags || [])}
                        </div>
                    </div>
                </div>
            `).join('');

            grid.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('click', () => {
                    const result = results[parseInt(card.dataset.resultIndex, 10)];
                    if (result.type === 'project') {
                        const project = projects.find(p => p.id === result.projectId);
                        if (project) showProjectDetail(project);
                    } else if (result.pageId) {
                        showPage(result.pageId);
                    }
                });
            });
        }

        function showProjectDetail(project) {
            if (project?.url) window.location.href = project.url;
        }

        document.getElementById('backBtn')?.addEventListener('click', () => {
            showPage('projects');
        });

        function renderFeaturedProjects() {
            const featured = projects.slice(0, 3);
            const grid = document.getElementById('featuredGrid');
            grid.innerHTML = featured.map(project => `
                <a class="project-card" href="${escapeHTML(project.url)}">
                    <div class="project-icon">
                        <span class="material-symbols-outlined">folder</span>
                    </div>
                    <h3>${escapeHTML(project.title)}</h3>
                    <p>${escapeHTML(project.description)}</p>
                    <div class="project-footer">
                        <span>${escapeHTML(project.date)}</span>
                        <div class="project-tags-footer">
                            ${renderTags(project.tags || [])}
                        </div>
                    </div>
                </a>
            `).join('');
        }

        function renderSkills() {
            const grid = document.getElementById('skillsGrid');
            grid.innerHTML = skills.map(skill => `
                <div class="project-card">
                    <div class="project-icon">
                        <span class="material-symbols-outlined">verified</span>
                    </div>
                    <h3>${escapeHTML(skill.title)}</h3>
                </div>
            `).join('');
        }

        function updateEmailContact(email) {
            const emailButton = document.getElementById('emailButton');
            const emailPopoverAddress = document.getElementById('emailPopoverAddress');
            const openEmailLink = document.getElementById('openEmailLink');

            if (emailButton) {
                emailButton.title = `Email ${email}`;
                emailButton.setAttribute('aria-label', `Show email address: ${email}`);
            }

            if (emailPopoverAddress) {
                emailPopoverAddress.textContent = email;
            }

            if (openEmailLink) {
                openEmailLink.href = `mailto:${email}`;
            }
        }

        function setEmailPopoverOpen(isOpen) {
            const emailButton = document.getElementById('emailButton');
            const emailPopover = document.getElementById('emailPopover');

            if (!emailButton || !emailPopover) return;

            emailPopover.hidden = !isOpen;
            emailButton.setAttribute('aria-expanded', String(isOpen));
        }

        function toggleEmailPopover() {
            const emailPopover = document.getElementById('emailPopover');
            setEmailPopoverOpen(emailPopover ? emailPopover.hidden : true);
        }

        function setupEmailPopover() {
            const emailButton = document.getElementById('emailButton');
            const emailPopover = document.getElementById('emailPopover');
            const copyEmailButton = document.getElementById('copyEmailButton');
            const copyEmailText = document.getElementById('copyEmailText');

            if (!emailButton || !emailPopover) return;

            emailButton.addEventListener('click', (event) => {
                event.stopPropagation();
                toggleEmailPopover();
            });

            emailPopover.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            document.addEventListener('click', () => {
                setEmailPopoverOpen(false);
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    setEmailPopoverOpen(false);
                    emailButton.focus();
                }
            });

            if (copyEmailButton && copyEmailText) {
                copyEmailButton.addEventListener('click', async () => {
                    const email = document.getElementById('emailPopoverAddress')?.textContent?.trim() || 'zejunli@umich.edu';

                    try {
                        await navigator.clipboard.writeText(email);
                        copyEmailText.textContent = 'Copied';
                    } catch (error) {
                        copyEmailText.textContent = 'Copy failed';
                    }

                    window.setTimeout(() => {
                        copyEmailText.textContent = 'Copy';
                    }, 1600);
                });
            }
        }

        setupEmailPopover();

        // Dark mode toggle
        const themeToggle = document.getElementById('themeToggle');
        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
                localStorage.setItem('theme', 'dark');
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
                localStorage.setItem('theme', 'light');
            }
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query === '') {
                if (document.getElementById('page-home').style.display === 'block') {
                    renderFeaturedProjects();
                } else if (document.getElementById('page-projects').style.display === 'block') {
                    renderProjects(projects);
                } else if (document.getElementById('page-about').style.display === 'block') {
                    renderSkills();
                }
                return;
            }

            showPage('projects');
            renderSearchResults(getSearchResults(query), query);
        });

        window.addEventListener('resize', updateStickyOffsets);
        window.addEventListener('orientationchange', updateStickyOffsets);
        window.addEventListener('load', updateStickyOffsets);
        loadPortfolioData();
