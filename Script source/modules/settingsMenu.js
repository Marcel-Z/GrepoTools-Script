// Module: settingsMenu
// Description: This is the settings menu module.
// Last Updated: 2025/01/05

let settingsMenu = {
  rendered: false,
  styleDiv: `GrepoTools_settingsMenu`,
  listAction: true,

  init() {
    if (grepolisLoaded) {
      this.settingsMenu("GrepoTools_settingsMenu");
      this.createStyle();
      this.addSettingsButtonToGodsArea();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          #menuScreen { 
            height:500px;
            background-color:"#FFE3A1"; 
          }
          #menuScreen .settings-sub-menu{
            right:-6px;
            position: absolute;
            top: -4px;
            bottom: 0;
            left: 217px;
            padding: 0 10px;
            overflow: auto;
          }
          #menuScreen .checkbox_new{
            display:block;
            margin-bottom:3px;
          }
          label + .dropdown{
            margin-left:10px;
            margin-bottom: 5px;
          }
          .dropdown .caption{
            padding-left: 5px !important;
            padding-right: 20px !important;
          }
          .grepotools.settings-sub-menu{
            background:url(https://www.grepotools.nl/grepotools/images/settingsBackGround.png) no-repeat right 20px bottom;
          }
          .infoText{
            margin-bottom:10px;
            margin-top:10px;
            font-weight: bold
          }
          .group{
            margin-top:10px;
            margin-left:10px
          }
          #settings-index-menu b,#settings-index-menu li{
            margin-left:10px
          }
          img#version { 
            position:relative ; margin-top: 20px
          }
          .settings_godsarea_icon { 
            margin:5px 0px 0px 4px;
            width:23px; height:23px; 
          }
          #gt_menu {          
            font: 13px Verdana,Arial,Helvetica,sans-serif;
            text-align: left;    
            list-style: none;    
            margin: 0 auto;    
            height: 22px;    
            z-index: 15;    
            position: absolute;    
            width: auto;    
            border: 2px solid darkgreen;
            background: #2B241A;    
            padding: 1px 1px 0px 1px;    
            right: auto;    
            border-top-left-radius: 5px;    
            border-top-right-radius: 5px;    
            border-bottom: 0px; 
          }
          #menuVersionInfo {
            position:relative;
            bottom:90px;
            left:10px
          }
          .settings_godsarea{
            position: absolute
          }
          .grepoToolsSettingsMenu{
            width: 220px;
            background: url(https://gpnl.innogamescdn.com/images/game/border/border_v.png) repeat-y right 0;
            marginTop: -12px;
            height: 508px;
          }
          .grepoToolsSettingsMenu b {
            margin-top: 12px;
            display: block;
          }
          .grepoToolsSettingsMenu a,
          .grepoToolsSettingsMenu a:active,
          .grepoToolsSettingsMenu a:link,
          .grepoToolsSettingsMenu a:visited {
            font-weight: 400;
          }
          .grepoToolsSettingsMenu a.selected {
            text-decoration: underline;
          }
          .grepoToolsSettingsMenu ul {
            color: #8a401f;
            margin: 3px 0 0 10px;
          }
        `)
      );
      this.rendered = true;
    }
  },

  createInfoText(infoText) {
    return $("<div/>", { class: "infoText" }).append(infoText);
  },

  createCheckbox(id, caption, setting = false) {
    const checkbox = $("<div/>", { id, class: "checkbox_new large" })
      .append($("<div/>", { class: "cbx_icon" }))
      .append($("<div/>", { class: "cbx_caption" }).text(caption));

    if (setting) {
      checkbox.addClass("checked");
    }

    return checkbox;
  },

  toggleCheckbox(checkbox) {
    const setting = checkbox.hasClass("checked");
    checkbox.toggleClass("checked", !setting);
    return !setting;
  },

  createButton(id, caption, disabled = false, functionToCall) {
    const button = $("<div/>", {
      id,
      class: "button_new",
      style: "margin-top:10px",
    })
      .append($("<div/>", { class: "left" }))
      .append($("<div/>", { class: "right" }))
      .append(
        $("<div/>", { class: "caption js-caption" })
          .append($("<span/>").text(caption))
          .append($("<div/>", { class: "effect js-effect" }))
      );

    if (disabled) {
      button.addClass("disabled");
    }

    button.on("click", function () {
      if (
        !button.hasClass("disabled") &&
        typeof functionToCall === "function"
      ) {
        functionToCall();
      }
    });

    return button;
  },

  statusButton(buttonId, value) {
    const button = $(`#${buttonId}`);
    if (value) {
      button.removeClass("disabled");
    } else {
      button.addClass("disabled");
    }
  },

  createDropdown(id, label, value, options = "") {
    return $("<div/>")
      .append($("<label/>", { for: id }).text(label))
      .append(
        $("<div/>", { id: id, class: "dropdown default" }).dropdown({
          list_pos: "left",
          value: value,
          options: options,
        })
      );
  },

  createMenuContent(tab) {
    let url = "";

    switch (tab) {
      case 0:
        url =
          language.settingActiveLanguage === "nl"
            ? "https://www.grepotools.nl/gt_over_nl/"
            : "https://www.grepotools.nl/gt_over_en/";

        $("#menuScreen").append(`
        <iframe src="${url}" style="padding:0;margin:0;width: 100%; height: 100%; border: 0px; float: left;"></iframe>
      `);
        break;
      case 1:
        url =
          language.settingActiveLanguage === "nl"
            ? "https://www.grepotools.nl/gt_veranderingen_nl/"
            : "https://www.grepotools.nl/gt_veranderingen_en/";

        $("#menuScreen").append(`
        <iframe src="${url}" style="padding:0;margin:0;width: 100%; height: 100%; border: 0px; float: left;"></iframe>
      `);
        break;
      case 2:
        $(document).ready(function () {
          $("#settings-index-menu a").click(function (event) {
            event.preventDefault();
            $('[id^="indexMenu"]').removeClass("selected");
            $(this).addClass("selected");

            const selectedId = $(this).attr("id");
            const newId = selectedId.replace("indexMenu-", "submenu-");

            $('[id^="submenu"]').css("display", "none");
            $("#" + newId).css("display", "block");
          });
        });

        // indexmenu
        $("#menuScreen").append(`
          <div id="settings-index-menu" class="grepoToolsSettingsMenu"></div>
        `);

        // submenu
        $("#menuScreen").append(
          `<div id="settings-sub-menu" class="grepotools settings-sub-menu"></div>`
        );
        $("#menuScreen").append(
          `<div id="menuVersionInfo">
        ${language[language.settingActiveLanguage].script}
        <br>
        ${language[language.settingActiveLanguage].version}: 
        ${GM_info.script.version} ${version.release}
         <br><br>
         <a href="https://discord.com/invite/K4jV7hFSRu" target="_blank">GrepoTools Discord</a>
      </div>`
        );
        this.createIndexMenu();
        this.createSubMenu();
        this.controlActions();
        this.disableOptions();
        break;
      case 3:
        url =
          language.settingActiveLanguage === "nl"
            ? "https://www.grepotools.nl/gt_donatie_nl/"
            : "https://www.grepotools.nl/en/gt_donate_en/";

        $("#menuScreen").append(`
        <iframe src="${url}" style="padding:0;margin:0;width: 100%; height: 100%; border: 0px; float: left;"></iframe>
      `);
        break;
    }
  },

  createIndexMenu() {
    const menuItems = [
      {
        gameHeaderText: language[language.settingActiveLanguage].grepoTools,
        options: [
          {
            id: "indexMenu-oceannumbers",
            caption: language[language.settingActiveLanguage].oceanNumbers,
          },
          {
            id: "indexMenu-grid",
            caption: language[language.settingActiveLanguage].oceanGrid,
          },
          {
            id: "indexMenu-coordinates",
            caption: language[language.settingActiveLanguage].coordinates,
          },
          {
            id: "indexMenu-islandNumbersTags",
            caption: language[language.settingActiveLanguage].islandNumbersTags,
          },
          {
            id: "indexMenu-mapTags",
            caption: language[language.settingActiveLanguage].mapTags,
          },
          {
            id: "indexMenu-general",
            caption: `${
              language[language.settingActiveLanguage].general
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
        ],
      },
      {
        gameHeaderText: language[language.settingActiveLanguage].otherScripts,
        options: [
          {
            id: "indexMenu-GRCRT",
            caption: "GrcrTools",
          },
          {
            id: "indexMenu-DioTools",
            caption: "DioTools",
          },
          {
            id: "indexMenu-MoleHole",
            caption: "MoleHole",
          },
        ],
      },
    ];

    const settingMenuDiv = $("#settings-index-menu");

    menuItems.forEach((item) => {
      const header = $("<b>").text(item.gameHeaderText);
      const list = $("<ul>");

      item.options.forEach((option) => {
        const listItem = $("<li>").addClass("");
        const link = $("<a>")
          .addClass("settings-link")
          .attr("id", option.id)
          .attr("href", "#")
          .text(option.caption);

        listItem.append(link);
        list.append(listItem);
      });

      settingMenuDiv.append(header).append(list);
    });
  },

  createSubMenu() {
    const subMenuItems = [
      {
        sectionId: "submenu-oceannumbers",
        gameHeaderText: language[language.settingActiveLanguage].oceanNumbers,
        display: "block",
        options: [
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].strategicMap
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].oceanNumbers.toLowerCase()}`,
            id: "settingOceanNumbersStrategicMap",
            setting: oceanNumbers.getSettingValue("visibleStrategicMap"),
            functionToCall: oceanNumbers.setVisibilityStrategicMap,
          },
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].islandView
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].oceanNumbers.toLowerCase()}`,
            id: "settingOceanNumbersIslandView",
            setting: oceanNumbers.getSettingValue("visibleIslandView"),
            functionToCall: oceanNumbers.setVisibilityIslandView,
          },
        ],
      },
      {
        sectionId: "submenu-grid",
        gameHeaderText: language[language.settingActiveLanguage].oceanGrid,
        display: "none",
        options: [
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].strategicMap
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].oceanGrid.toLowerCase()}`,
            id: "settingOceanGridStrategicMap",
            setting: oceanGrid.getSettingValue("visibleStrategicMap"),
            functionToCall: oceanGrid.setVisibilityStrategicMap,
          },
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].islandView
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].oceanGrid.toLowerCase()}`,
            id: "settingOceanGridIslandView",
            setting: oceanGrid.getSettingValue("visibleIslandView"),
            functionToCall: oceanGrid.setVisibilityIslandView,
          },
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].color
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "dropDown",
            caption: `${language[language.settingActiveLanguage].oceanGrid} 
            ${language[language.settingActiveLanguage].text.toLowerCase()} 
            ${language[language.settingActiveLanguage].color.toLowerCase()}`,
            id: "settingOceanGridTextColor",
            setting: oceanGrid.getSettingValue("gridTextColor"),
            options: settingsMenu.selectColorOptions(),
          },
          {
            type: "dropDown",
            caption: `${language[language.settingActiveLanguage].oceanGrid} 
            ${language[language.settingActiveLanguage].color.toLowerCase()}`,
            id: "settingOceanGridColor",
            setting: oceanGrid.getSettingValue("gridColor"),
            options: settingsMenu.selectColorOptions(),
          },
        ],
      },
      {
        sectionId: "submenu-coordinates",
        gameHeaderText: language[language.settingActiveLanguage].coordinates,
        display: "none",
        options: [
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].strategicMap
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].coordinates.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].grid.toLowerCase()}`,
            id: "settingCoordinatesGridStrategicMap",
            setting: coordinatesGrid.getSettingValue("visibleStrategicMap"),
            functionToCall: coordinatesGrid.setVisibilityStrategicMap,
          },
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].islandView
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].coordinates.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].grid.toLowerCase()}`,
            id: "settingCoordinatesGridIslandView",
            setting: coordinatesGrid.getSettingValue("visibleIslandView"),
            functionToCall: coordinatesGrid.setVisibilityIslandView,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].coordinates.toLowerCase()} (X/Y)`,
            id: "settingCoordinatesIslandView",
            setting: coordinates.getSettingValue("visibleIslandView"),
            functionToCall: coordinates.setVisibilityIslandView,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].update
            } ${language[
              language.settingActiveLanguage
            ].coordinates.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].whileScrolling.toLowerCase()} (X/Y)`,
            id: "settingCoordinatesUpdateXYScrolling",
            setting: coordinates.getSettingValue("updateScrolling"),
            functionToCall: coordinates.setUpdateScrolling,
          },
        ],
      },
      {
        sectionId: "submenu-islandNumbersTags",
        gameHeaderText:
          language[language.settingActiveLanguage].islandNumbersTags,
        display: "none",
        options: [
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].strategicMap
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].farmerVillageIslandNumbers.toLowerCase()}`,
            id: "settingFarmerVillageIslandNumbersStrategicMap",
            setting: islandNumbers.getSettingValue(
              "visibleFarmingStrategicMap"
            ),
            functionToCall: islandNumbers.setVisibilityFarmingStrategicMap,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].farmerVillageIslandTags.toLowerCase()}`,
            id: "settingFarmerVillageIslandTagsStrategicMap",
            setting: islandNumbers.getSettingValue(
              "visibleFarmingTagsStrategicMap"
            ),
            functionToCall: islandNumbers.setVisibilityFarmingTagsStrategicMap,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].rockIslandNumbers.toLowerCase()}`,
            id: "settingRockIslandNumbersStrategicMap",
            setting: islandNumbers.getSettingValue("visibleRockStrategicMap"),
            functionToCall: islandNumbers.setVisibilityRockStrategicMap,
          },
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].islandView
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].farmerVillageIslandNumbers.toLowerCase()}`,
            id: "settingFarmerVillageIslandNumbersIslandView",
            setting: islandNumbers.getSettingValue("visibleFarmingIslandView"),
            functionToCall: islandNumbers.setVisibilityFarmingIslandView,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].farmerVillageIslandTags.toLowerCase()}`,
            id: "settingFarmerVillageIslandTagsIslandView",
            setting: islandNumbers.getSettingValue(
              "visibleFarmingTagsIslandView"
            ),
            functionToCall: islandNumbers.setVisibilityFarmingTagsIslandView,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].rockIslandNumbers.toLowerCase()}`,
            id: "settingRockIslandNumbersIslandView",
            setting: islandNumbers.getSettingValue("visibleRockIslandView"),
            functionToCall: islandNumbers.setVisibilityRockIslandView,
          },
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].general
            } ${language[
              language.settingActiveLanguage
            ].and.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].color.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].islandLinkIslandInfo.toLowerCase()}`,
            id: "settingIslandLinkIslandInfo",
            setting: islandNumbers.getSettingValue("link"),
            functionToCall: islandNumbers.setLink,
          },
          {
            type: "dropDown",
            caption: `${
              language[language.settingActiveLanguage]
                .farmerIslandNumbersTextColor
            }`,
            id: "islandNumbersFarmingTextColor",
            setting: islandNumbers.getSettingValue("farmingTextColor"),
            options: settingsMenu.selectColorOptions(),
          },
          {
            type: "dropDown",
            caption: `${
              language[language.settingActiveLanguage]
                .rockIslandNumbersTextColor
            }`,
            id: "islandNumbersRockTextColor",
            setting: islandNumbers.getSettingValue("rockTextColor"),
            options: settingsMenu.selectColorOptions(),
          },
        ],
      },
      {
        sectionId: "submenu-mapTags",
        gameHeaderText: language[language.settingActiveLanguage].mapTags,
        display: "none",
        options: [
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].allianceName.toLowerCase()}`,
            id: "settingAllianceName",
            setting: mapTags.getSettingValue("settingAllianceName"),
            functionToCall: mapTags.setAllianceName,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].playerName.toLowerCase()}`,
            id: "settingPlayerName",
            setting: mapTags.getSettingValue("settingPlayerName"),
            functionToCall: mapTags.setPlayerName,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].townName.toLowerCase()}`,
            id: "settingTownName",
            setting: mapTags.getSettingValue("settingTownName"),
            functionToCall: mapTags.setTownName,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].townPoints.toLowerCase()}`,
            id: "settingTownPoints",
            setting: mapTags.getSettingValue("settingTownPoints"),
            functionToCall: mapTags.setTownPoints,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[
              language.settingActiveLanguage
            ].inactiveTimePlayer.toLowerCase()}`,
            id: "settingInactiveTimePlayer",
            setting: mapTags.getSettingValue("settingInactiveTimePlayer"),
            functionToCall: mapTags.setInactiveTimePlayer,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].show
            } ${language[language.settingActiveLanguage].noWrap.toLowerCase()}`,
            id: "settingNoWrap",
            setting: mapTags.getSettingValue("settingNoWrap"),
            functionToCall: mapTags.setNoWrap,
          },
        ],
      },
      {
        sectionId: "submenu-general",
        gameHeaderText: `${
          language[language.settingActiveLanguage].general
        } ${language[language.settingActiveLanguage].settings.toLowerCase()}`,
        display: "none",
        options: [
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].general
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "checkBox",
            caption:
              language[language.settingActiveLanguage].attackNotification,
            id: "attackNotification",
            setting: attackNotification.getSettingValue("attackNotification"),
            functionToCall: attackNotification.setVisibilityAttackNotification,
          },
          {
            type: "checkBox",
            caption: language[language.settingActiveLanguage].joinBetaTesting,
            id: "attackNotification",
            setting: version.getSettingValue("joinBetaProgram"),
            functionToCall: version.setJoinBetaProgram,
          },
          {
            type: "infoText",
            caption: `${
              language[language.settingActiveLanguage].language
            } ${language[
              language.settingActiveLanguage
            ].settings.toLowerCase()}`,
          },
          {
            type: "dropDown",
            caption: `${language[language.settingActiveLanguage].language}`,
            id: "languageID",
            setting: language.settingActiveLanguage,
            options: settingsMenu.selectLanguageOpties(),
          },
          {
            type: "button",
            caption: language[language.settingActiveLanguage].safeAndReload,
            id: "saveAndReload",
            disabled: true,
            functionToCall: language.setActiveLanguage,
          },
        ],
      },
      {
        sectionId: "submenu-GRCRT",
        gameHeaderText: `GRCRT ${language[
          language.settingActiveLanguage
        ].settings.toLowerCase()} `,
        display: "none",
        options: [
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].hide
            } bbcode ${language[
              language.settingActiveLanguage
            ].button.toLowerCase()} (${
              language[language.settingActiveLanguage].alliance
            } ${language[
              language.settingActiveLanguage
            ].and.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].islandInformationWindow.toLowerCase()})`,
            id: "settingGrcrtBbcodeButton",
            setting: otherScripts.getSettingValue("grcrtBbcodeButton"),
            functionToCall: otherScripts.setGrcrtBbcodeButton,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].hide
            } ${language[
              language.settingActiveLanguage
            ].heroIcon.toLowerCase()}`,
            id: "settingGrcrtCityOverviewHero",
            setting: otherScripts.getSettingValue("grcrtCityOverviewHero"),
            functionToCall: otherScripts.setGrcrtCityOverviewHero,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].hide
            } ${language[
              language.settingActiveLanguage
            ].spellsHarborBarracks.toLowerCase()}`,
            id: "settingGrcrtHideSpells",
            setting: otherScripts.getSettingValue("grcrtHideSpells"),
            functionToCall: otherScripts.setGrcrtHideSpells,
          },
        ],
      },
      {
        sectionId: "submenu-DioTools",
        gameHeaderText: `DioTools ${language[
          language.settingActiveLanguage
        ].settings.toLowerCase()} `,
        display: "none",
        options: [
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].hide
            } ${language[
              language.settingActiveLanguage
            ].message.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].button.toLowerCase()} (${
              language[language.settingActiveLanguage].alliance
            } ${language[
              language.settingActiveLanguage
            ].and.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].islandInformationWindow.toLowerCase()})`,
            id: "settingDiotoolsMessageButton",
            setting: otherScripts.getSettingValue("diotoolsMessageButton"),
            functionToCall: otherScripts.setDiotoolsMessageButton,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].hide
            } bbcode ${language[
              language.settingActiveLanguage
            ].button.toLowerCase()} (${
              language[language.settingActiveLanguage].alliance
            } ${language[
              language.settingActiveLanguage
            ].and.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].islandInformationWindow.toLowerCase()})`,
            id: "settingDiotoolsBbcodeButton",
            setting: otherScripts.getSettingValue("diotoolsBbcodeButton"),
            functionToCall: otherScripts.setDiotoolsBbcodeButton,
          },
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].hide
            } ${language[
              language.settingActiveLanguage
            ].heroIcon.toLowerCase()}`,
            id: "settingDiotoolsCityOverviewHero",
            setting: otherScripts.getSettingValue("diotoolsCityOverviewHero"),
            functionToCall: otherScripts.setDiotoolsCityOverviewHero,
          },
        ],
      },
      {
        sectionId: "submenu-MoleHole",
        gameHeaderText: `MoleHole ${language[
          language.settingActiveLanguage
        ].settings.toLowerCase()} `,
        display: "none",
        options: [
          {
            type: "checkBox",
            caption: `${
              language[language.settingActiveLanguage].hide
            } ${language[
              language.settingActiveLanguage
            ].message.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].button.toLowerCase()} (${
              language[language.settingActiveLanguage].alliance
            } ${language[
              language.settingActiveLanguage
            ].and.toLowerCase()} ${language[
              language.settingActiveLanguage
            ].islandInformationWindow.toLowerCase()})`,
            id: "settingMoleholeMessageButton",
            setting: otherScripts.getSettingValue("moleholeMessageButton"),
            functionToCall: otherScripts.setMoleholeMessageButton,
          },
        ],
      },
    ];

    const container = document.getElementById("settings-sub-menu");
    subMenuItems.forEach((section) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "subMenSection";
      sectionDiv.id = section.sectionId;
      sectionDiv.style.display = section.display;

      const headerDiv = document.createElement("div");
      headerDiv.className = "game_header bold";
      headerDiv.textContent = section.gameHeaderText;
      sectionDiv.appendChild(headerDiv);

      const groupDiv = document.createElement("div");
      groupDiv.className = "group";

      section.options.forEach((option) => {
        switch (option.type) {
          case "infoText":
            optionDiv = this.createInfoText(option.caption);
            break;
          case "checkBox":
            optionDiv = this.createCheckbox(
              option.id,
              option.caption,
              option.setting
            );
            optionDiv.click(function () {
              option.setting = settingsMenu.toggleCheckbox($(this));
              option.functionToCall(option.setting);
            });
            break;
          case "dropDown":
            optionDiv = this.createDropdown(
              option.id,
              option.caption,
              option.setting,
              option.options
            );
            break;
          case "button":
            optionDiv = this.createButton(
              option.id,
              option.caption,
              option.disabled,
              option.functionToCall
            );
            break;
        }

        groupDiv.append(optionDiv.get(0));
      });
      sectionDiv.appendChild(groupDiv);
      container.appendChild(sectionDiv);
    });
  },

  selectPageOptions() {
    let dropdownOptions = [];
    const maxPage = Math.ceil(
      bbcodeCopyPlayer.data.size / (bbcodeCopyPlayer.data.size - 1)
    );

    for (let i = 1; i <= maxPage; i++) {
      dropdownOptions.push({
        value: i,
        name: ` ${
          language[language.settingActiveLanguage].page
        } ${i} ${language[
          language.settingActiveLanguage
        ].of.toLowerCase()} ${maxPage} `,
      });
    }

    return dropdownOptions;
  },

  controlActions() {
    $("#settingOceanGridTextColor_list").click(function () {
      if (!settingsMenu.listAction) return;
      settingsMenu.listAction = false;

      $(".selected", this).each(function () {
        oceanGrid.gridTextColor($(this).attr("name"));
      });
      setTimeout(() => {
        settingsMenu.listAction = true;
      }, 500);
    });

    $("#settingOceanGridColor_list").click(function () {
      if (!settingsMenu.listAction) return;
      settingsMenu.listAction = false;
      $(".selected", this).each(function () {
        oceanGrid.gridColor($(this).attr("name"));
        coordinatesGrid.gridColor($(this).attr("name"));
      });
      setTimeout(() => {
        settingsMenu.listAction = true;
      }, 500);
    });

    $("#islandNumbersFarmingTextColor_list").click(function () {
      if (!settingsMenu.listAction) return;
      settingsMenu.listAction = false;
      $(".selected", this).each(function () {
        islandNumbers.setFarmingTextColor($(this).attr("name"));
      });
      setTimeout(() => {
        settingsMenu.listAction = true;
      }, 500);
    });

    $("#islandNumbersRockTextColor_list").click(function () {
      if (!settingsMenu.listAction) return;
      settingsMenu.listAction = false;
      $(".selected", this).each(function () {
        islandNumbers.setRockTextColor($(this).attr("name"));
      });
      setTimeout(() => {
        settingsMenu.listAction = true;
      }, 500);
    });

    $("#languageID_list").click(function () {
      if (!settingsMenu.listAction) return;
      settingsMenu.listAction = false;

      $(".selected", this).each(function () {
        const name = $(this).attr("name");
        const isLanguageChanged = language.settingActiveLanguage !== name;

        language.dropdownValueNewLanguage = name;
        settingsMenu.statusButton("saveAndReload", isLanguageChanged);
      });

      setTimeout(() => {
        settingsMenu.listAction = true;
      }, 500);
    });
  },

  selectColorOptions() {
    let dropdown_opties = [];
    for (let key in settings.colors) {
      dropdown_opties.push({
        value: key,
        name: language[language.settingActiveLanguage].colors[key],
      });
    }

    dropdown_opties.sort(settingsMenu.sortList("name"));
    return dropdown_opties;
  },

  selectLanguageOpties() {
    let dropdown_opties = [];

    for (let i = 0; i < language.languages.length; ++i) {
      dropdown_opties.push({
        value: language.languages[i],
        name: language[language.settingActiveLanguage].languages[
          language.languages[i]
        ],
      });
    }
    dropdown_opties.sort(settingsMenu.sortList("name"));

    return dropdown_opties;
  },

  sortList(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  },

  disableOptions() {
    otherScripts.checkActiveScripts();
    if (!otherScripts.diotoolsActive) {
      $("#settingDiotoolsMessageButton").addClass("disabled");
      $("#settingDiotoolsMessageButton").off("click");
      $("#settingDiotoolsBbcodeButton").addClass("disabled");
      $("#settingDiotoolsBbcodeButton").off("click");
      $("#settingDiotoolsCityOverviewHero").addClass("disabled");
      $("#settingDiotoolsCityOverviewHero").off("click");
    }
    if (!otherScripts.grcrtActive) {
      $("#settingGrcrtBbcodeButton").addClass("disabled");
      $("#settingGrcrtBbcodeButton").off("click");
      $("#settingGrcrtCityOverviewHero").addClass("disabled");
      $("#settingGrcrtCityOverviewHero").off("click");
      $("#settingGrcrtHideSpells").addClass("disabled");
      $("#settingGrcrtHideSpells").off("click");
    }
    if (!otherScripts.moleholeActive) {
      $("#settingMoleholeMessageButton").addClass("disabled");
      $("#settingMoleholeMessageButton").off("click");
    }
  },

  addSettingsLinkToMenu() {
    if (!$("#menu_links").get(0)) {
      if ($("#player-apps").length) {
        const newItem = $("<li>", { class: "with-icon" })
          .append(
            $("<img/>", {
              class: "support-menu-item-icon",
              src: "https://www.grepotools.nl/grepotools/images/logoStable.png",
              style: "width: 15px;padding-top:2px",
            })
          )
          .append(
            $("<a/>", { id: "menu_links" })
              .html(
                "Grepotools - " +
                  language[language.settingActiveLanguage].settings
              )
              .click(function () {
                WF.open("GrepoTools_settingsMenu");
                settingsMenu.id.setActivePageNr(2);
              })
          );

        $("#player-apps").parent().after(newItem);
      }
    }
  },

  addSettingsButtonToGodsArea() {
    const imgSrc =
      version.release === "beta" || version.release === "development"
        ? "https://www.grepotools.nl/grepotools/images/logoBeta.png"
        : "https://www.grepotools.nl/grepotools/images/logoStable.png";

    const settingsButtonHTML = `
      <div class="btn_settings circle_button settings_godsarea GrepoToolsSettingsButton">
        <div class="settings_godsarea_icon">
          <img class="GrepoToolsSettingsIcon" src="${imgSrc}">
        </div>
      </div>
    `;

    $(settingsButtonHTML).appendTo("body");
    $(".GrepoToolsSettingsButton").tooltip("");
    $(".GrepoToolsSettingsButton").tooltip(`
      <div>
        ${language[language.settingActiveLanguage].script}
        <br>
        ${language[language.settingActiveLanguage].version}: 
        ${GM_info.script.version} ${version.release}
        <br>
        ${language[language.settingActiveLanguage].settings}
      </div>
    `);

    if (Game.ui_scale.enlarged_ui_size) {
      $(".settings_godsarea").css("top", "187px");
      $(".settings_godsarea").css("right", "52px");
      $(".settings_godsarea").css("z-index", "2");
    } else {
      $(".settings_godsarea").css("top", "140px");
      $(".settings_godsarea").css("right", "116px");
      $(".settings_godsarea").css("z-index", "51");
    }

    $(".settings_godsarea > div")
      .on("mouseover", function (event) {
        $("#popup_div").css({
          left: `${event.clientX - 180}px`,
          top: `${event.clientY + 15}px`,
          display: "block",
        });
      })
      .on("mouseout", function () {
        $("#popup_div").css("display", "none");
      })
      .on("click", function () {
        WF.open("GrepoTools_settingsMenu");
        settingsMenu.id.setActivePageNr(2);
      });
  },

  settingsMenu(id) {
    "use strict";
    var _IdS = id;
    var _windows = require("game/windows/ids");
    (_windows[_IdS.toUpperCase()] = _IdS),
      (function () {
        var a = uw.GameControllers.TabController,
          b = uw.GameModels.Progressable,
          _content = $("<div/>", { id: "menuScreen" }),
          c = a.extend({
            initialize: function (b) {
              a.prototype.initialize.apply(this, arguments);
              var _wnd = this.getWindowModel(),
                _$el = this.$el;
              settingsMenu.id = _wnd;
              this.$el.html(_content);
              _wnd.hideLoading();
              if (!_wnd.getJQElement) {
                _wnd.getJQElement = function () {
                  return _content;
                };
              }
              if (!_wnd.appendContent) {
                _wnd.appendContent = function (a) {
                  return _content.append(a);
                };
              }
              if (!_wnd.setContent2) {
                _wnd.setContent2 = function (a) {
                  return _content.html(a);
                };
              }
              this.bindEventListeners();
            },
            render: function () {
              this.reRender();
            },
            reRender: function () {
              var _wnd = this.getWindowModel(),
                _$el = this.$el;
              this.getWindowModel().setTitle(
                `<img src="https://www.grepotools.nl/grepotools/images/logoStable.png" width="15" height="15"> Grepotools ${
                  language[language.settingActiveLanguage].settings
                }`
              ),
                this.getWindowModel().showLoading();
              setTimeout(function () {
                _wnd.setContent2(""),
                  settingsMenu.createMenuContent(_wnd.getActivePageNr());

                _wnd.hideLoading();

                _$el.find(".js-scrollbar-viewport").skinableScrollbar({
                  orientation: "vertical",
                  template: "tpl_skinable_scrollbar",
                  skin: "narrow",
                  disabled: !1,
                  elements_to_scroll: _$el.find(".js-scrollbar-content"),
                  element_viewport: _$el.find(".js-scrollbar-viewport"),
                  scroll_position: 0,
                  min_slider_size: 16,
                });
              }, 100);
            },
            bindEventListeners: function () {
              this.$el
                .parents("." + _IdS)
                .on(
                  "click",
                  ".js-wnd-buttons .help",
                  this._handleHelpButtonClickEvent.bind(this)
                );
            },
            _handleHelpButtonClickEvent: function () {
              var a = this.getWindowModel().getHelpButtonSettings();
            },
          });
        uw.GameViews["grepotools_" + _IdS] = c;
      })(),
      (function () {
        "use strict";
        var a = uw.GameViews,
          b = uw.GameCollections,
          c = uw.GameModels,
          d = uw.WindowFactorySettings,
          e = require("game/windows/ids"),
          f = require("game/windows/tabs"),
          g = e[_IdS.toUpperCase()];
        d[g] = function (b) {
          b = b || {};
          return us.extend(
            {
              window_type: g,
              minheight: 550,
              maxheight: 560,
              width: 925,
              tabs: [
                {
                  type: id,
                  title: `${language[language.settingActiveLanguage].about}`,
                  content_view_constructor: a["grepotools_" + _IdS],
                  hidden: !1,
                },
                {
                  type: id,
                  title: `${language[language.settingActiveLanguage].changes}`,
                  content_view_constructor: a["grepotools_" + _IdS],
                  hidden: !1,
                },
                {
                  type: id,
                  title: `${language[language.settingActiveLanguage].settings}`,
                  content_view_constructor: a["grepotools_" + _IdS],
                  hidden: !1,
                },
                {
                  type: id,
                  title: `${language[language.settingActiveLanguage].donation}`,
                  content_view_constructor: a["grepotools_" + _IdS],
                  hidden: !1,
                },
              ],
              max_instances: 1,
              activepagenr: 0,
            },
            b
          );
        };
      })();
  },
};
