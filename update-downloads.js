// Auto-update download information from GitHub Releases
async function updateDownloadInfo() {
    try {
        const response = await fetch('https://api.github.com/repos/ObaWan/pixistudio-updates/releases/tags/v2.9.87');
        const release = await response.json();
        
        const fileMap = {
            'Pixi.Studio-2.9.87-mac.zip': { selector: '[data-file="mac-intel"]', name: 'macOS Intel' },
            'Pixi.Studio-2.9.87-arm64-mac.zip': { selector: '[data-file="mac-arm"]', name: 'macOS ARM' },
            'PIXI-STUDIO-Setup-2.9.87.exe': { selector: '[data-file="win-setup"]', name: 'Windows Setup' },
            'PIXI-STUDIO-Portable-2.9.87.exe': { selector: '[data-file="win-portable"]', name: 'Windows Portable' }
        };
        
        release.assets.forEach(asset => {
            const mapping = fileMap[asset.name];
            if (mapping) {
                const card = document.querySelector(mapping.selector);
                if (card) {
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
            }
        });
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
