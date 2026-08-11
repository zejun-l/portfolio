let portfolioData = {};
        let navigationItems = [];
        let projects = [];
        let skills = [];
        const appScriptUrl = new URL(document.currentScript.src);
        const portfolioRootUrl = new URL('../', appScriptUrl);
        const cleanPageUrls = {
            home: portfolioRootUrl.pathname,
            projects: `${portfolioRootUrl.pathname}projects/`,
            about: `${portfolioRootUrl.pathname}about/`,
            resume: `${portfolioRootUrl.pathname}resume/`
        };

        const localPortfolioFallback = {
            profile: {
                name: 'Zejun Li',
                siteTitle: "Welcome to Zejun's Drive",
                homeSubtitle: 'Suggested projects',
                aboutTitle: 'About me',
                aboutText: "Hi, I'm Zejun (aka Ting Ting)! I'm a junior at the University of Michigan studying User Experience Design. I'm passionate about exploring the unique problems that arise from the convergence of different disciplines in UX and designing experiences that spark joy :)\n\nOutside of school and design, I play a lot of ultimate frisbee! I also enjoy fishing (trying to get into fly fishing this summer), birdwatching, reading looong fantasy and sci-fi books (check out The Priory of the Orange Tree), and watching food reviews on YouTube.",
                skillsTitle: 'Skills',
                resumeTitle: 'Resume',
                profilePhotoUrl: 'assets/images/profile-photo.jpg',
                resumeUrl: 'assets/documents/zejun-li-resume.pdf',
                email: 'zejunli@umich.edu',
                linkedinUrl: 'https://www.linkedin.com/in/zejli/',
                githubUrl: 'https://github.com/zejun-l',
                footerNote: 'This portfolio is inspired by Google Drive’s interaction patterns and Material Design. It is not affiliated with Google.'
            },
            navigationItems: [
                { icon: 'home', label: 'Home', id: 'home' },
                { icon: 'folder', label: 'Projects', id: 'projects' },
                { icon: 'user', label: 'About', id: 'about' },
                { icon: 'description', label: 'Resume', id: 'resume' }
            ],
            projects: [
                { id: 5, title: 'Snap Finance UXR Internship', url: 'projects/snap-finance/', image: 'assets/images/snap-finance/Snap_logo337X150.jpg', description: 'Coming soon', date: 'Aug 2026', status: 'In progress', timeline: 'May 18, 2026 - August 13, 2026', tags: ['UXR'], fullDescription: 'Case study details coming soon.' },
                { id: 1, title: 'U-M GPT', url: 'projects/um-gpt/', image: 'assets/images/um-gpt/umgpt cover slide.png', description: "Redesigning Michigan's AI chatbot", date: 'Dec 2025', status: 'Completed', tags: ['UXD', 'UI/UX'], role: 'Product Designer', teamSize: '1', timeline: 'Aug 2025 - Dec 2025' },
                { id: 2, title: 'MotiMuse', url: 'projects/motimuse/', image: 'assets/images/motimuse/motimuse cover slide.png', description: 'Designing a mobile app to encourage music practice', date: 'Nov 2025', status: 'Completed', tags: ['UXR', 'UXD', 'UI/UX'], role: 'Product Manager & UX Designer', teamSize: '5', timeline: 'Oct 2025 - Nov 2025' },
                { id: 3, title: 'Stardew Valley Game Remake', url: 'projects/stardew-valley/', image: 'assets/images/stardew-valley/stardew valley cover slide.jpg', description: 'Improving the co-op player experience', date: 'Mar 2025', status: 'Completed', tags: ['UXR', 'UXD'], role: 'UX Researcher & Designer', teamSize: '4', timeline: 'Jan 2025 - Mar 2025' },
                { id: 4, title: 'Counter-Strike 2 Game UX Study', url: 'projects/counter-strike-2/', image: 'assets/images/counter-strike-2/player status.jpg', description: 'Analyzing CS2 using UX heuristics', date: 'Mar 2025', status: 'Completed', tags: ['Article'], metaFields: [{ label: 'Author', value: 'Zejun Li' }, { label: 'Date', value: 'March 16, 2025' }, { label: '', value: '' }] }
            ],
            skills: ['UI/UX Design', 'Web Design', 'Prototyping', 'Front-end Development', 'React', 'HTML/CSS', 'JavaScript', 'Figma', 'Adobe XD', 'User Research', 'Wireframing'].map((title, index) => ({ id: index + 1, title })),
            searchPages: [
                { type: 'page', icon: 'person', title: 'About me', description: 'Learn more about Zejun.', date: 'Page', pageId: 'about', keywords: 'About me Zejun Ting Ting University of Michigan User Experience Design' },
                { type: 'page', icon: 'description', title: 'Resume', description: "View Zejun's resume.", date: 'Page', pageId: 'resume', keywords: 'Resume CV experience education projects' },
                { type: 'page', icon: 'home', title: 'Home', description: "Return to Zejun's Drive home page and suggested projects.", date: 'Page', pageId: 'home', keywords: 'Home Welcome Zejun Drive suggested projects portfolio' }
            ]
        };

        function initializePortfolio(data) {
            portfolioData = data;
            navigationItems = portfolioData.navigationItems || [];
            projects = portfolioData.projects || [];
            skills = portfolioData.skills || [];
            applyPortfolioData();
            renderNavigation();
            updateStickyOffsets();
            const initialParams = new URLSearchParams(window.location.search);
            const initialSearch = initialParams.get('search');
            const recoveredRoute = initialParams.get('route');
            const pathRoute = window.location.pathname.startsWith(portfolioRootUrl.pathname)
                ? window.location.pathname.slice(portfolioRootUrl.pathname.length).split('/').filter(Boolean)[0]
                : '';
            const hashRoute = window.location.hash.replace('#', '');
            const requestedPage = initialSearch ? 'projects' : (recoveredRoute || pathRoute || hashRoute);
            showPage(['projects', 'about', 'resume'].includes(requestedPage) ? requestedPage : 'home');
            if (initialSearch) {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.value = initialSearch;
                showPage('projects');
                renderSearchResults(getSearchResults(initialSearch), initialSearch);
            }
        }

        async function loadPortfolioData() {
            if (window.location.protocol === 'file:') {
                initializePortfolio(localPortfolioFallback);
                return;
            }

            try {
                const response = await fetch('data.json', { cache: 'no-cache' });
                if (!response.ok) {
                    throw new Error(`Could not load data.json (${response.status})`);
                }
                initializePortfolio(await response.json());
            } catch (error) {
                console.info('Using embedded portfolio data because data.json could not be fetched.', error);
                initializePortfolio(localPortfolioFallback);
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
                profilePhoto.src = resolvePortfolioUrl(profile.profilePhotoUrl);
                profilePhoto.alt = `${profile.name || 'Profile'} profile photo`;
            }

            const resumeFrame = document.getElementById('resumeFrame');
            if (resumeFrame && profile.resumeUrl) {
                resumeFrame.src = resolvePortfolioUrl(profile.resumeUrl);
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

        function resolvePortfolioUrl(path) {
            return new URL(String(path || ''), portfolioRootUrl).href;
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

        function renderProjectCover(project) {
            if (!project?.image) return '<div class="project-icon"><span class="material-symbols-outlined">folder</span></div>';
            return `<div class="project-cover"><img src="${escapeHTML(resolvePortfolioUrl(project.image))}" alt="${escapeHTML(project.title)} cover"></div>`;
        }

        function renderNavigation() {
            const nav = document.getElementById('nav');
            nav.innerHTML = navigationItems.map(item => `
                <a class="nav-item ${item.id === 'home' ? 'active' : ''}" data-id="${escapeHTML(item.id)}" href="${escapeHTML(cleanPageUrls[item.id] || cleanPageUrls.home)}">
                    <div class="nav-icon">${getIcon(item.icon)}</div>
                    <span>${escapeHTML(item.label)}</span>
                </a>
            `).join('');

            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', event => {
                    event.preventDefault();
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
            const targetUrl = cleanPageUrls[pageId] || cleanPageUrls.home;
            if (window.location.pathname !== targetUrl || window.location.hash || window.location.search) {
                try {
                    history.replaceState(null, '', targetUrl);
                } catch (error) {
                    window.location.href = targetUrl;
                }
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
                <a class="project-card" href="${escapeHTML(resolvePortfolioUrl(project.url))}">
                    ${renderProjectCover(project)}
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

            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

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
            if (project?.url) window.location.href = resolvePortfolioUrl(project.url);
        }

        document.getElementById('backBtn')?.addEventListener('click', () => {
            showPage('projects');
        });

        function renderFeaturedProjects() {
            const featured = projects.slice(0, 4);
            const grid = document.getElementById('featuredGrid');
            grid.innerHTML = featured.map(project => `
                <a class="project-card" href="${escapeHTML(resolvePortfolioUrl(project.url))}">
                    ${renderProjectCover(project)}
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

        const searchInput = document.getElementById('searchInput');
        const searchContainer = searchInput.closest('.top-bar-search');
        const searchSuggestions = document.createElement('div');
        searchSuggestions.className = 'search-suggestions';
        searchSuggestions.id = 'searchSuggestions';
        searchSuggestions.setAttribute('role', 'listbox');
        searchSuggestions.hidden = true;
        searchContainer.appendChild(searchSuggestions);

        function closeSearchSuggestions() {
            searchSuggestions.hidden = true;
            searchSuggestions.innerHTML = '';
            searchInput.setAttribute('aria-expanded', 'false');
        }

        function openSearchResult(result) {
            if (result.type === 'project') {
                const project = projects.find(item => item.id === result.projectId);
                if (project?.url) window.location.href = resolvePortfolioUrl(project.url);
            } else if (result.pageId) {
                showPage(result.pageId);
                closeSearchSuggestions();
            }
        }

        function updateSearchSuggestions(query) {
            if (!query) {
                closeSearchSuggestions();
                return;
            }
            const results = getSearchResults(query).slice(0, 6);
            searchSuggestions.hidden = false;
            searchInput.setAttribute('aria-expanded', 'true');
            if (!results.length) {
                searchSuggestions.innerHTML = '<div class="search-suggestion-empty">No suggestions found</div>';
                return;
            }
            searchSuggestions.innerHTML = results.map((result, index) => `
                <button class="search-suggestion" type="button" role="option" data-suggestion-index="${index}">
                    <span class="material-symbols-outlined" aria-hidden="true">${escapeHTML(result.icon)}</span>
                    <span class="search-suggestion-copy"><span class="search-suggestion-title">${escapeHTML(result.title)}</span><span class="search-suggestion-meta">${escapeHTML(result.description || result.date || '')}</span></span>
                </button>`).join('');
            searchSuggestions.querySelectorAll('.search-suggestion').forEach(button => {
                button.addEventListener('click', () => openSearchResult(results[Number(button.dataset.suggestionIndex)]));
            });
        }

        searchInput.setAttribute('role', 'combobox');
        searchInput.setAttribute('aria-autocomplete', 'list');
        searchInput.setAttribute('aria-controls', 'searchSuggestions');
        searchInput.setAttribute('aria-expanded', 'false');
        searchInput.addEventListener('input', event => updateSearchSuggestions(event.target.value.trim()));
        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeSearchSuggestions();
            if (event.key === 'Enter') {
                const query = searchInput.value.trim();
                if (!query) return;
                event.preventDefault();
                showPage('projects');
                renderSearchResults(getSearchResults(query), query);
                closeSearchSuggestions();
            }
        });
        searchContainer.addEventListener('click', event => event.stopPropagation());
        document.addEventListener('click', closeSearchSuggestions);

        document.addEventListener('click', event => {
            const projectLink = event.target.closest('a.project-card');
            if (!projectLink) return;
            const visiblePage = Array.from(document.querySelectorAll('.page')).find(page => page.style.display === 'block');
            const returnPage = visiblePage?.id === 'page-home' ? 'home' : 'projects';
            sessionStorage.setItem('caseStudyReturnPage', returnPage);
        });

        window.addEventListener('resize', updateStickyOffsets);
        window.addEventListener('orientationchange', updateStickyOffsets);
        window.addEventListener('load', updateStickyOffsets);
        loadPortfolioData();
