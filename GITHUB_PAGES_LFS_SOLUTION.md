# GitHub Pages + Git LFS Solution

## Problem

GitHub Pages **does not support Git LFS** (Large File Storage). When you commit large files with LFS and serve them via GitHub Pages, users download the LFS pointer files (134 bytes) instead of the actual files.

### Symptoms
- Files appear as 134 bytes on GitHub Pages
- Downloads fail or download tiny pointer files instead of real binaries
- LFS works fine in git repository but not when served via Pages

## Root Cause

GitHub Pages serves files directly from the git repository without processing LFS pointers. The `.gitattributes` configuration works for git operations but Pages ignores it and serves the raw pointer files.

## Solution: Use GitHub Releases

GitHub Releases **fully supports large files** without size limits and works seamlessly with electron-updater.

### Implementation Steps

1. **Keep Git LFS enabled** in the repository (for version control)
   ```bash
   # .gitattributes
   *.dmg filter=lfs diff=lfs merge=lfs -text
   *.zip filter=lfs diff=lfs merge=lfs -text
   *.exe filter=lfs diff=lfs merge=lfs -text
   ```

2. **Create GitHub Release** with build files
   ```bash
   gh release create v2.9.87 \
     --title "v2.9.87 - Spine 4.1 Texture Loading Fix" \
     --notes "Critical bug fixes for Spine 4.1.21/4.1.22 texture loading" \
     "Pixi Studio-2.9.87-mac.zip" \
     "Pixi Studio-2.9.87-arm64-mac.zip" \
     "PIXI-STUDIO-Setup-2.9.87.exe" \
     "PIXI-STUDIO-Portable-2.9.87.exe" \
     "latest-mac.yml" \
     "latest.yml"
   ```

3. **Update landing page links** to point to Release downloads
   ```html
   <!-- Before: GitHub Pages (broken with LFS) -->
   <a href="Pixi%20Studio-2.9.87-mac.zip">Download</a>
   
   <!-- After: GitHub Releases (works correctly) -->
   <a href="https://github.com/ObaWan/pixistudio-updates/releases/download/v2.9.87/Pixi.Studio-2.9.87-mac.zip">Download</a>
   ```

4. **Important: GitHub replaces spaces with dots** in Release filenames
   - Upload: `Pixi Studio-2.9.87-mac.zip`
   - Actual URL: `Pixi.Studio-2.9.87-mac.zip` (space → dot)

## Architecture

```
┌─────────────────────────────────────────────────┐
│  GitHub Repository (pixistudio-updates)         │
│  - Uses Git LFS for version control             │
│  - Stores build files with LFS pointers         │
└─────────────────────────────────────────────────┘
                    │
                    ├─────────────────────┬─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
        ┌─────────────────────┐  ┌──────────────────┐  ┌─────────────────┐
        │  GitHub Pages       │  │ GitHub Releases  │  │ electron-updater│
        │  (HTML/CSS/JS only) │  │ (Binary files)   │  │ (auto-update)   │
        └─────────────────────┘  └──────────────────┘  └─────────────────┘
                    │                     │                     │
                    │                     │                     │
                    ▼                     ▼                     ▼
        Landing page HTML          Download files         Update files
        obawan.github.io/          (110 MB, 105 MB,      (latest-mac.yml)
        pixistudio-updates/        86 MB, 86 MB)         (latest.yml)
```

## electron-updater Configuration

The `app-update.yml` file configures electron-updater to use GitHub Releases:

```yaml
owner: ObaWan
repo: pixistudio-updates
provider: github
updaterCacheDirName: pixi-studio-updater
```

electron-updater automatically:
1. Checks for `latest-mac.yml` or `latest.yml` in the Release
2. Downloads update files from Release assets
3. No GitHub Pages involvement for auto-updates

## File Structure

```
pixistudio-updates/
├── index.html                    # Landing page (served by Pages)
├── changelog.json                # Version history (served by Pages)
├── README.md                     # Documentation (served by Pages)
├── latest-mac.yml                # Uploaded to Release
├── latest.yml                    # Uploaded to Release
├── Pixi Studio-2.9.87-*.zip      # Tracked by LFS, uploaded to Release
└── PIXI-STUDIO-*.exe             # Tracked by LFS, uploaded to Release
```

## Benefits

✅ **No file size limits** - GitHub Releases supports any size
✅ **Fast downloads** - Optimized CDN for binary distribution
✅ **Works with electron-updater** - Native support for Releases
✅ **Clean separation** - HTML on Pages, binaries on Releases
✅ **Version control** - Still uses Git LFS for repository management

## Limitations of Alternative Solutions

### ❌ Disabling Git LFS
```bash
git lfs untrack "*.zip" "*.exe"
git add *.zip *.exe  # Commit directly
```
**Problem**: GitHub rejects files > 100 MB without LFS
```
remote: error: File Pixi Studio-2.9.87-mac.zip is 109.54 MB; 
this exceeds GitHub's file size limit of 100.00 MB
```

### ❌ Git LFS with GitHub Pages
**Problem**: Pages serves LFS pointer files (134 bytes) instead of actual files

### ❌ External CDN
**Problem**: Requires separate infrastructure, loses GitHub integration

## Workflow for New Releases

1. Build new version (e.g., v2.9.88)
2. Update `changelog.json` with new version
3. Create GitHub Release:
   ```bash
   gh release create v2.9.88 \
     --title "v2.9.88 - New Features" \
     --notes "Release notes here" \
     "Pixi Studio-2.9.88-mac.zip" \
     "Pixi Studio-2.9.88-arm64-mac.zip" \
     "PIXI-STUDIO-Setup-2.9.88.exe" \
     "PIXI-STUDIO-Portable-2.9.88.exe" \
     "latest-mac.yml" \
     "latest.yml"
   ```
4. Update `index.html` links to new version
5. Commit and push changes
6. GitHub Pages auto-deploys in ~1 minute

## References

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git LFS Documentation](https://git-lfs.github.com/)
- [GitHub Releases Documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [electron-updater Documentation](https://www.electron.build/auto-update)

## Result

Users download full files from GitHub Releases:
- https://obawan.github.io/pixistudio-updates/ → Landing page
- Click download → https://github.com/ObaWan/pixistudio-updates/releases/download/v2.9.87/Pixi.Studio-2.9.87-mac.zip
- File downloads: ✅ 110 MB (not 134 bytes)
