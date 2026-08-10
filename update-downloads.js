// Populate the public download page from GitHub Releases.
// Each platform resolves independently so a macOS-only release does not break
// Windows download buttons (and vice versa).

const RELEASES_API = 'https://api.github.com/repos/ObaWan/pixistudio-updates/releases?per_page=30';

const assetConfigs = {
    'mac-intel': {
        pattern: /mac\.zip$/i,
        notPattern: /arm64/i,
        selector: '[data-file="mac-intel"]'
    },
    'mac-arm': {
        pattern: /arm64.*mac\.zip$/i,
        selector: '[data-file="mac-arm"]'
    },
    'win-setup': {
        pattern: /setup.*\.exe$/i,
        selector: '[data-file="win-setup"]'
    },
    'win-portable': {
        pattern: /portable.*\.exe$/i,
        selector: '[data-file="win-portable"]'
    }
};

function versionFromRelease(release) {
    return (release.tag_name || '').replace(/^v/i, '');
}

function formatSize(bytes) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function findLatestAsset(releases, config) {
    for (const release of releases) {
        if (release.draft || release.prerelease || !Array.isArray(release.assets)) continue;

        const asset = release.assets.find(candidate => {
            const matches = config.pattern.test(candidate.name);
            // Reset regex state defensively if a future pattern gains the global flag.
            config.pattern.lastIndex = 0;

            let allowed = true;
            if (config.notPattern) {
                allowed = !config.notPattern.test(candidate.name);
                config.notPattern.lastIndex = 0;
            }
            return matches && allowed;
        });

        if (asset) return { release, asset };
    }

    return null;
}

function updateCard(config, match) {
    const card = document.querySelector(config.selector);
    if (!card) return;

    if (!match) {
        card.removeAttribute('href');
        card.setAttribute('aria-disabled', 'true');
        card.style.opacity = '0.55';
        card.style.cursor = 'not-allowed';

        const button = card.querySelector('.download-btn');
        if (button) button.textContent = 'Download non disponibile';
        return;
    }

    const { release, asset } = match;
    const version = versionFromRelease(release);

    card.href = asset.browser_download_url;
    card.removeAttribute('aria-disabled');
    card.style.opacity = '';
    card.style.cursor = '';

    const versionEl = card.querySelector('[data-version]');
    if (versionEl) {
        versionEl.textContent = versionEl.textContent.replace(/v?\d+\.\d+\.\d+/, `v${version}`);
    }

    const sizeEl = card.querySelector('[data-info="size"]');
    if (sizeEl) sizeEl.textContent = formatSize(asset.size);

    const dateEl = card.querySelector('[data-info="date"]');
    if (dateEl) dateEl.textContent = formatDate(asset.updated_at || release.published_at);
}

async function updateDownloadInfo() {
    try {
        const response = await fetch(RELEASES_API, {
            headers: { 'Accept': 'application/vnd.github+json' }
        });

        if (!response.ok) {
            throw new Error(`GitHub Releases API returned ${response.status}`);
        }

        const releases = (await response.json())
            .filter(release => !release.draft && !release.prerelease)
            .sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at));

        if (!releases.length) {
            throw new Error('No public releases found');
        }

        // Header represents the newest release overall.
        const latestVersion = versionFromRelease(releases[0]);
        const headerBadge = document.querySelector('header [data-version]');
        if (headerBadge && latestVersion) {
            headerBadge.textContent = `Latest release: v${latestVersion}`;
        }

        // Resolve each download independently. This is important because a release
        // can contain only macOS or only Windows artifacts.
        for (const config of Object.values(assetConfigs)) {
            updateCard(config, findLatestAsset(releases, config));
        }

        console.log(`✅ Download page updated from ${releases.length} public releases`);
    } catch (error) {
        // Keep the static fallback links from index.html if GitHub's API is temporarily unavailable.
        console.error('Failed to update download information:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDownloadInfo);
} else {
    updateDownloadInfo();
}
