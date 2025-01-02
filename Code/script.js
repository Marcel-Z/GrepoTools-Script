// module script
// Discrption: this module will initialize the script and render the modules
// Last Updated: 2024/12/29

let script = {
  async startUp() {
    await version.getScriptVersionData();
    version.getScriptVersions();

    language.init();

    console.log(
      `%cGrepolis Grepotools Script: ${
        language[language.settingActiveLanguage].active
      }| ${language[language.settingActiveLanguage].version}: ${
        GM_info.script.version
      } ${version.release} | ${
        language[language.settingActiveLanguage].world
      }: ${Game.world_id} | ${
        language[language.settingActiveLanguage].language
      }: ${
        language.settingActiveLanguage
      } \nDiscord: https://discord.com/invite/K4jV7hFSRu`,
      `color: green; font-size: 1em; font-weight: bolder;`
    );

    script.initInterval = setInterval(script.modulesInit, 500);
    script.renderInterval = setInterval(script.modulesRenderActions, 250);
    script.versionUpdateInterval = setInterval(version.checkUpdate, 10000);
  },

  modulesInit() {
    modulesInit.forEach((module) => module.init());
    clearInterval(script.initInterval);
  },

  modulesRenderActions() {
    $.each(Layout.wnd.getAllOpen(), function (ind, elem) {
      let window = elem.getController();
      switch (window) {
        case "player":
          settingsMenu.addSettingsLinkToMenu(); // Grepolis settingsmenu
          bbcodeCopyPlayer.animate(); // Grepolis bbcode player
          break;
        case "island_info":
          bbcodeCopyIsland.animate();
          messageIsland.animate();
          break;
        case "town_info":
          bbcodeCopyPlayer.animate();
          break;
        case "alliance":
          bbcodeCopyAlliance.animate();
          messageAlliance.animate();
          break;
        case "building_barracks":
          spells.render();
          break;
        case "building_docks":
          spells.render();
          break;
        case "alliance_forum":
          bbcodePaste.render();
          break;
        case "message":
          bbcodePaste.render();
          break;
        default:
          break;
      }
    });

    // check for notes window
    if ($(".notes_container").get(0)) {
      bbcodePaste.render();
    }

    // check for farm towns window
    if ($(".farm_towns").get(0)) {
    }

    ocean.visibleOnScreen();
    modulesAnimate.forEach((module) => module.animate());
  },
};
