# Pixi Studio Updates

Public distribution repository for **Pixi Studio**.

🔗 **Download page:** https://obawan.github.io/pixistudio-updates/

> The Pixi Studio source code is kept in a separate private repository. This public repository contains only distribution assets and public-facing update information.

## What lives here

- Public download page (`index.html`)
- Dynamic download metadata (`update-downloads.js`)
- Public changelog (`changelog.json`)
- Electron auto-update metadata (`latest.yml`, `latest-mac.yml`)
- GitHub Releases containing Windows and macOS builds
- Public icons/assets required by the download page

## Distribution architecture

```text
Private source repository
ObaWan/pixistudio
        │
        │ build / release
        ▼
Public distribution repository
ObaWan/pixistudio-updates
        │
        ├── GitHub Releases → installers and update packages
        ├── GitHub Pages → public download page
        └── update metadata → Electron Updater
```

The download page queries the latest GitHub Release and updates the displayed version, download URLs, sizes and dates automatically. New releases therefore do not require manually editing `index.html`.

## Auto-update

The desktop app is configured to use this repository as its GitHub update provider. Electron Updater reads release metadata and assets from the public releases here, while the application source remains private.

Public changelog endpoint:

```text
https://obawan.github.io/pixistudio-updates/changelog.json
```

## Publishing a release

1. Update the version and changelog in the private `ObaWan/pixistudio` repository.
2. Build the Windows/macOS packages from the private source tree.
3. Publish the generated files as a GitHub Release in this repository.
4. Verify the public download page.
5. Verify automatic update from an older Pixi Studio build.

The detailed build/release procedure is maintained in the private source repository (`PIXI Studio/RELEASE_GUIDE.md`).

## Privacy boundary

This repository must contain **distribution-only material**. Do not copy application source code, private development documentation, credentials, signing secrets or proprietary source assets here.
