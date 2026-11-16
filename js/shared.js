// Shared utilities work on static hosting, repository subpaths, and local files.
(() => {
    const root = new URL('../', document.currentScript.src);
    function storage(kind) {
        return {
            getItem(key) { try { return window[kind].getItem(key); } catch { return null; } },
            setItem(key, value) { try { window[kind].setItem(key, value); } catch { /* Storage is optional. */ } }
        };
    }
    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
    }
    window.Portfolio = {
        data: window.PORTFOLIO_DATA,
        root,
        escapeHTML,
        local: storage('localStorage'),
        session: storage('sessionStorage'),
        resolveUrl: value => new URL(String(value || ''), root).href,
        updateStickyOffsets() {
            const bar = document.querySelector('.top-bar');
            if (bar) document.documentElement.style.setProperty('--top-bar-height', `${bar.offsetHeight}px`);
        }
    };
})();
