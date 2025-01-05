// module main
// Discrption: this module will initialize and startup the main script
// Last Updated: 2025/01/05

const uw = unsafeWindow || window;
const $ = uw.jQuery || jQuery;

let grepolisLoaded = false;

const modulesInit = [
  statistics,
  externalData,
  version,
  settingsMenu,
  otherScripts,
  oceanGrid,
  oceanNumbers,
  islandNumbers,
  coordinatesGrid,
  coordinates,
  mapTags,
  nightMode,
  attackNotification,
  spells,
  bbcodePaste,
  bbcodeCopyAlliance,
  bbcodePasteAlliance,
  bbcodeCopyIsland,
  bbcodePasteIsland,
  bbcodeCopyPlayer,
  bbcodePastePlayer,
  messageAlliance,
  messageIsland,
];

const modulesAnimate = [
  oceanGrid,
  oceanNumbers,
  islandNumbers,
  mapTags,
  coordinatesGrid,
  attackNotification,
];

$(function () {
  const intervalId = setInterval(function () {
    const loaderContent = $("#loader_content").get(0);
    if (!loaderContent) {
      grepolisLoaded = true;
      script.startUp();
      clearInterval(intervalId);
    }
  }, 50);
});
