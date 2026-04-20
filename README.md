# Pixi Studio Updates

📦 **Release files hosting** for Pixi Studio via GitHub Pages.

🔗 **Base URL**: https://obawan.github.io/pixistudio-updates/

## Purpose

Fornisce **link HTTP diretti** ai file di installazione per:
- Microsoft Store (verifica versione)
- Mac App Store (verifica versione)
- Auto-update system dell'app
- Download diretto

## File Disponibili

### macOS
- `Pixi-Studio-2.9.87-mac.zip` (115 MB) - Intel (x64)
- `Pixi-Studio-2.9.87-arm64-mac.zip` (107 MB) - Apple Silicon (ARM64)

### Windows
- `PIXI-STUDIO-Setup-2.9.87.exe` (86 MB) - Installer
- `PIXI-STUDIO-Portable-2.9.87.exe` (86 MB) - Versione portabile

### API
- `changelog.json` - Storico versioni per auto-update check

## Link Diretti

```
https://obawan.github.io/pixistudio-updates/Pixi%20Studio-2.9.87-mac.zip
https://obawan.github.io/pixistudio-updates/Pixi%20Studio-2.9.87-arm64-mac.zip
https://obawan.github.io/pixistudio-updates/PIXI-STUDIO-Setup-2.9.87.exe
https://obawan.github.io/pixistudio-updates/PIXI-STUDIO-Portable-2.9.87.exe
https://obawan.github.io/pixistudio-updates/changelog.json
```

## Auto-Update Implementation

```javascript
const response = await fetch('https://obawan.github.io/pixistudio-updates/changelog.json');
const data = await response.json();
const latestVersion = data.releases[0].version;
```

## Updating Releases

1. Build new version: `npm run build` or `npm run build-win`
2. Copy files from `dist/` to this repo with name: `Pixi-Studio-X.X.X.dmg`
3. Update `changelog.json` with new version
4. Commit and push → GitHub Pages auto-deploys in ~1 min

## Notes

- No index.html — repo serves static files only
- Direct links work immediately
- CORS enabled automatically by GitHub Pages
- Downloads also available from [Releases](https://github.com/ObaWan/pixistudio-updates/releases)
