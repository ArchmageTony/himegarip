# himegarip
[Himegari Imperial Meister](http://pc-play.games.dmm.co.jp/play/himegari/) asset tools

## Setup

### Requirements
* [NodeJS 8.x+](https://nodejs.org)
* [UABE](https://github.com/DerPopo/UABE/releases)
* [AssetStudio](https://ci.appveyor.com/project/Perfare/assetstudio/branch/master/artifacts)

### Install
```
npm install
```

### Prepare Directories
```
/assets
  /ab-chara       | Where AB for character sprites are stored
  /ab-event       | Where AB for event CG are stored
  /ab-ignore      | Where other possibly useful AB are stored
  /ab-new         | New AB you download should be placed here
  /ab-source      | After processing, move original AB here from ab-new
  /icon-chara     | Character list as seen from in-game's srpite viewer list
  /icon-event     | Character list as seen from in-game's event viewer list
  /img-chara      | Finished exports. Character PNG
  /img-event      | Finished exports. Event PNG
  /missing-chara  | Character list that shows which sprites are still missing
  /missing-event  | Character list that shows which events are still missing
/decomp
  /uabe           | The UABE in "Requirements" section
  /decomp.bat
/extension
  /...
/scripts
  /...
```

### Prepare other files
`/decomp/uabe/files.bat`
```
+DIR <path_to_project>\assets\ab-new
```
```
+DIR C:\projects\himegarip\assets\ab-new
```

---

## Usage

### Chrome Extension
* Navigate Chrome to: `chrome://extensions/`
* Enable "Developer Mode" on top-right
* Click on "Load unpacked" button on top-left
* Set directory to `<path_to_project>/extension`
* A new Himegari icon should show on your Chrome toolbar (right of address bar)
* Open the game
* Once the game is finished loading, press on the Himegari icon on toolbar
* A new page will show up like this `chrome-extension://<random_extension_id>/rip.html`
* Pressing "Turn On" button with listen to game
  * It will show when new AB files are loaded
  * The AB files that show up are clickable to download

### Categorize Assets
* When you download AB files, place them into `/assets/ab-new`
* Run `/decomp/decomp.bat` and wait for it to finish
* Using NodeJS, run the main script `npm run process` and wait for it to finish
* Review if AB files are properly categorized under `/assets/ab-chara` and `/assets/ab-event`
* Move the remaining files in `/assets/ab-new` into `/assets/ab-source`

### Extract Images
* Open **AssetStudio** and open the files in `/assets/ab-chara`
  * _Filter_ > _Texture2D_
  * _Export_ > _Filtered assets_
  * Browse to `/assets/img-chara` to export
* Again, use **AssetStudio** and open the files in `/assets/ab-event`
  * _Filter_ > _Texture2D_
  * _Export_ > _Filtered assets_
  * Browse to `/assets/img-event` to export

### Optional: Refresh Character List
* _TBD_
* _TBD_
* _TBD_