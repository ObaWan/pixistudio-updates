// Auto-update download information from GitHub Releases (latest release)
async function updateDownloadInfo() {
    try {
        // Get the latest release
        const response = await fetch('https://api.github.com/repos/ObaWan/pixistudio-updates/releases/latest');
        const release = await response.json();
        
        if (!release || !release.assets) {
            console.error('No release data found');
            return;
        }
        
        const version = release.tag_name.replace('v', '');
        
        // Update version in all cards
        document.querySelectorAll('[data-version]').forEach(el => {
            el.textContent = el.textContent.replace(/v?\d+\.\d+\.\d+/, `v${version}`);
        });
        
        // Map asset names to card selectors (more flexible patterns)
        const assetPatterns = {
            'mac-intel': { 
                pattern: /mac\.zip$/i,  // Matches any file ending with "mac.zip"
                notPattern: /arm64/i,   // But not containing "arm64"
                selector: '[data-file="mac-intel"]' 
            },
            'mac-arm': { 
                pattern: /arm64.*mac\.zip$/i,  // Matches "arm64" before "mac.zip"
                selector: '[data-file="mac-arm"]' 
            },
            'win-setup': { 
                pattern: /setup.*\.exe$/i,  // Matches "Setup" before ".exe"
                selector: '[data-file="win-setup"]' 
            },
            'win-portable': { 
                pattern: /portable.*\.exe$/i,  // Matches "Portable" before ".exe"
                selector: '[data-file="win-portable"]' 
            }
        };
        
        // Process each asset
        release.assets.forEach(asset => {
            // Find which platform this asset belongs to
            for (const [platform, config] of Object.entries(assetPatterns)) {
                const matchesPattern = config.pattern.test(asset.name);
                const matchesNotPattern = config.notPattern ? !config.notPattern.test(asset.name) : true;
                
                if (matchesPattern && matchesNotPattern) {
                    const card = document.querySelector(config.selector);
                    if (card) {
                        // Update download link
                        card.href = asset.browser_download_url;
                        
                        // Update size
                        const sizeEl = card.querySelector('[data-info="size"]');
                        if (sizeEl) {
                            const sizeMB = (asset.size / (1024 * 1024)).toFixed(1);
                            sizeEl.textContent = `${sizeMB} MB`;
                        }
                        
                        // Update date
                        const dateEl = card.querySelector('[data-info="date"]');
                        if (dateEl) {
                            const date = new Date(asset.updated_at);
                            const formatted = date.toLocaleDateString('it-IT', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                            });
                            dateEl.textContent = formatted;
                        }
                    }
                    break;
                }
            }
        });
        
        console.log(`✅ Updated to version ${version} with ${release.assets.length} assets`);
    } catch (error) {
        console.error('Failed to fetch release info:', error);
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateDownloadInfo);
} else {
    updateDownloadInfo();
}
