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

⚠️ **macOS Users**: L'app non è notarizzata da Apple. Dopo il download:
1. **Decomprimi** lo ZIP
2. **Tasto destro** su `Pixi Studio.app` → **Apri** (prima volta)
3. Conferma apertura nel dialog di sicurezza
4. Oppure usa terminale: `xattr -cr "/path/to/Pixi Studio.app" && open "/path/to/Pixi Studio.app"`

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

## Aggiornare Releases

1. Compila nuova versione: `npm run build` o `npm run build-win`
2. Copia file da `dist/` a questo repo con nome: `Pixi-Studio-X.X.X.dmg`
3. Aggiorna `changelog.json` con nuova versione
4. Commit e push → GitHub Pages auto-deploys in ~1 min

## Note

- Nessun index.html - repo serve solo file statici
- Link diretti funzionano immediatamente
- CORS abilitato automaticamente da GitHub Pages
- Download disponibili anche da [Releases](https://github.com/ObaWan/pixistudio-updates/releases)
