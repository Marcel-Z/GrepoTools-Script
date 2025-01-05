// Module: nightMode
// Discrption: This module will toggle the night mode on and off.
// Last Updated: 2024/12/29

let nightMode = {
  module: "nightMode",
  rendered: false,
  styleDiv: `GrepoTools_nightMode`,
  strategicMapDiv: `GrepoTools_nightMode_strategic_map`,
  nightModeActive: null,

  init() {
    if (grepolisLoaded) {
      this.cityViewElement = $(".ui_city_overview");
      this.islandViewElement = $(".map");
      this.strategicViewElement = $("#minimap_canvas");

      this.nightModeActive = Game.night_mode;

      this.createDiv();
      this.createStyle();
      if (Game.ui_scale.enlarged_ui_size) {
        this.addNightModeButton();
      } else {
        this.addNightModeMenu();
      }
      this.IntervalCityView = setInterval(this.intervalCityView, 100);
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .nightMode {
            position: absolute;
            left: 0;
            top: 0;
            width: 25600px;
            height: 25600px;
            background-color: #07142d;
            opacity: 0.7;
            z-index:2;
          }
          .nightModeButton{
            position: absolute;
             z-index:2;
          }
          .nightModeButtonIcon{ { 
            margin:5px 0px 0px 4px;
            width:21px; height:21px; 
          }
        `)
      );
      this.rendered = true;
    }
  },

  createDiv() {
    if (!this.rendered) {
      if (!$(`#${this.strategicMapDiv}`).length) {
        $(
          `<div id='${this.strategicMapDiv}'><div class="nightMode"></div></div>`
        ).insertAfter("#minimap_islands_layer");
        if (!this.nightModeActive) {
          $(`#${this.strategicMapDiv}`).css("display", "none");
        }
      }
    }
  },

  checkNightMode() {
    $(nightMode.islandViewElement).hasClass("night")
      ? (nightMode.nightModeActive = true)
      : (nightMode.nightModeActive = false);
    Game.night_mode = nightMode.nightModeActive;
  },

  intervalCityView() {
    if ($(nightMode.strategicViewElement).hasClass("night")) {
      nightMode.strategicViewElement.removeClass("night");
    }

    if (nightMode.nightModeActive) {
      if (!$(nightMode.cityViewElement).hasClass("night")) {
        nightMode.cityViewElement.addClass("night");
      }
    } else {
      if ($(nightMode.cityViewElement).hasClass("night")) {
        nightMode.cityViewElement.removeClass("night");
      }
    }
  },

  toggleNightMode() {
    if (nightMode.nightModeActive) {
      // nightmode is active -> turn off
      if ($(nightMode.cityViewElement).hasClass("night")) {
        nightMode.cityViewElement.removeClass("night");
      }
      if ($(nightMode.islandViewElement).hasClass("night")) {
        nightMode.islandViewElement.removeClass("night");
      }
      if ($(nightMode.strategicViewElement).hasClass("night")) {
        nightMode.strategicViewElement.removeClass("night");
      }
      $(`#${nightMode.strategicMapDiv}`).css("display", "none");
    } else {
      // nightmode is not active -> turn on
      if (!$(nightMode.cityViewElement).hasClass("night")) {
        nightMode.cityViewElement.addClass("night");
      }
      if (!$(nightMode.islandViewElement).hasClass("night")) {
        nightMode.islandViewElement.addClass("night");
      }
      $(`#${nightMode.strategicMapDiv}`).css("display", "block");
    }

    nightMode.checkNightMode();
  },

  // Old Small Ui
  addNightModeMenu() {
    let imgSrc = this.nightModeActive
      ? "https://www.grepotools.nl/grepotools/images/moon.png"
      : "https://www.grepotools.nl/grepotools/images/sun.png";

    let nightModeMenuHTML = `
      <li id="nightMode_button" class="nightModeButton" style="margin-bottom:3px; margin-top: -1px;">
          <span class="content_wrapper">
              <span class="button_wrapper">
                  <span class="button">
                      <span class="icon nightModeButtonIconImage"><img src="${imgSrc}"></span>
                  </span>
              </span>
              <span class="name_wrapper">
                  <span class="name">GrepoTools</span>
              </span>
          </span>
      </li>
    `;

    $(nightModeMenuHTML).prependTo(".nui_main_menu ul");
    nightMode.updateMenu();

    $("#nightMode_button").on("click", function () {
      nightMode.toggleNightMode();
      nightMode.updateMenu();
    });
  },

  // Old Small Ui
  updateMenu() {
    if (nightMode.nightModeActive) {
      $(".nightModeButtonIconImage img").attr(
        "src",
        "https://www.grepotools.nl/grepotools/images/moon.png"
      );
      $(".nightModeButtonIconImage img").css({
        "margin-left": "-1px",
        "margin-top": "0px",
        width: "18px",
        height: "18px",
      });
      $("#nightMode_button .name").html(
        `${language[language.settingActiveLanguage].dayMode}`
      );
    } else {
      $(".nightModeButtonIconImage img").attr(
        "src",
        "https://www.grepotools.nl/grepotools/images/sun.png"
      );
      $(".nightModeButtonIconImage img").css({
        "margin-left": "-3px",
        "margin-top": "1px",
        width: "18px",
        height: "18px",
      });
      $("#nightMode_button .name").html(
        `${language[language.settingActiveLanguage].nightMode}`
      );
    }
  },

  // New Big Ui
  addNightModeButton() {
    let imgSrc = this.nightModeActive
      ? "https://www.grepotools.nl/grepotools/images/moon.png"
      : "https://www.grepotools.nl/grepotools/images/sun.png";

    const nightModeButtonHTML = `
      <div class="btn_settings circle_button nightModeButton GrepoToolsSettingsButton">
        <div class="nightModeButtonIcon">
          <img class="nightModeButtonIconImage" src="${imgSrc}">
        </div>
      </div>
      `;

    $(nightModeButtonHTML).appendTo("body");

    $(".nightModeButton").css("top", "168px");
    $(".nightModeButton").css("right", "85px");
    nightMode.updateButton();

    $(".nightModeButton").on("click", function () {
      nightMode.toggleNightMode();
      nightMode.updateButton();
    });
  },

  // New Big Ui
  updateButton() {
    if (nightMode.nightModeActive) {
      $(".nightModeButtonIconImage").attr(
        "src",
        "https://www.grepotools.nl/grepotools/images/moon.png"
      );
      $(".nightModeButtonIconImage").css({
        "margin-left": "1px",
        "margin-top": "7px",
        width: "18px",
        height: "18px",
      });
    } else {
      $(".nightModeButtonIconImage").attr(
        "src",
        "https://www.grepotools.nl/grepotools/images/sun.png"
      );
      $(".nightModeButtonIconImage").css({
        "margin-left": "0px",
        "margin-top": "8px",
        width: "18px",
        height: "18px",
      });
    }
  },
};
