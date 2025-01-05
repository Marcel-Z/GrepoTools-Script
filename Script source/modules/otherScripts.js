// Module: otherScripts
// Discrption: This module handles the interaction with other scripts and affects them based on the chosen settings.
// Last Updated: 2025/01/05

let otherScripts = {
  module: "otherScripts",
  diotoolsActive: false,
  grcrtActive: false,
  moleholeActive: false,
  mapenhancerActive: false,
  grepotdataActive: false,
  settingsKeys: [
    { key: "diotoolsMessageButton", value: null, default: true },
    { key: "diotoolsBbcodeButton", value: null, default: true },
    { key: "diotoolsCityOverviewHero", value: null, default: true },
    { key: "grcrtMessageButton", value: null, default: true },
    { key: "grcrtBbcodeButton", value: null, default: true },
    { key: "grcrtCityOverviewHero", value: null, default: true },
    { key: "grcrtHideSpells", value: null, default: true },
    { key: "moleholeMessageButton", value: null, default: true },
    { key: "moleholeBbcodeButton", value: null, default: true },
  ],

  init() {
    this.loadSettings();
    this.IntervalGrcrt = setInterval(this.intervalGrcrt, 100);
    this.IntervalDiotools = setInterval(this.intervalDiotools, 100);
  },

  loadSettings() {
    this.settingsKeys.forEach((setting) => {
      const { key, default: defaultValue } = setting;
      const value = settings.loadSetting(
        `${Game.world_id}|${this.module}.${key}`,
        defaultValue
      );
      setting.value = value;
    });
  },

  getSettingValue(settingKey) {
    const setting = this.settingsKeys.find(({ key }) => key === settingKey);
    return setting ? setting.value : null;
  },

  setSettingValue(settingKey, value) {
    const setting = otherScripts.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(`${Game.world_id}|otherScripts.${settingKey}`, value);
  },

  checkActiveScripts() {
    this.diotoolsActive = Boolean($("#diotools").get(0));
    this.grcrtActive = Boolean($(".grcrt").get(0));
    this.moleholeActive = Boolean($(".MoleHole").get(0));
    this.mapenhancerActive = Boolean($("#GMESetupLink").get(0));
    this.grepotdataActive = Boolean($(".gd_settings_icon").get(0));
  },

  setDiotoolsMessageButton(value) {
    otherScripts.setSettingValue("diotoolsMessageButton", value);
  },

  setGrcrtMessageButton(value) {
    otherScripts.setSettingValue("grcrtMessageButton", value);
  },

  setMoleholeMessageButton(value) {
    otherScripts.setSettingValue("moleholeMessageButton", value);
  },

  setDiotoolsBbcodeButton(value) {
    otherScripts.setSettingValue("diotoolsBbcodeButton", value);
  },

  setGrcrtBbcodeButton(value) {
    otherScripts.setSettingValue("grcrtBbcodeButton", value);
  },

  setMoleholeBbcodeButton(value) {
    otherScripts.setSettingValue("moleholeBbcodeButton", value);
  },

  setGrcrtHideSpells(value) {
    otherScripts.setSettingValue("grcrtHideSpells", value);
  },

  setGrcrtCityOverviewHero(value) {
    if ($(".town_group").get(0)) {
      $(".town_name").click();
    }
    otherScripts.setSettingValue("grcrtCityOverviewHero", value);
  },

  setDiotoolsCityOverviewHero(value) {
    if ($(".town_group").get(0)) {
      $(".town_name").click();
    }
    otherScripts.setSettingValue("diotoolsCityOverviewHero", value);
  },

  toggleDisplay(selector, condition) {
    $(selector).css("display", condition ? "none" : "block");
  },

  intervalGrcrt() {
    if (!Boolean($(".grcrt").get(0))) {
      return;
    }

    // Hide spells
    otherScripts.toggleDisplay(
      ".grcrt_power",
      otherScripts.getSettingValue("grcrtHideSpells")
    );

    // Hide or show the hero icon
    otherScripts.toggleDisplay(
      ".grcrt_hero",
      otherScripts.getSettingValue("grcrtCityOverviewHero")
    );

    // Hide or show the ocean numbers
    otherScripts.toggleDisplay(
      ".RepConvON",
      oceanNumbers.getSettingValue("visibleIslandView")
    );
  },

  intervalDiotools() {
    if (!Boolean($("#diotools").get(0))) {
      return;
    }

    // Hide or show the hero icon
    if (otherScripts.getSettingValue("diotoolsCityOverviewHero")) {
      $(".group_towns .hero_icon.hero25x25").css("display", "none");
    } else {
      $(".hero_icon.hero25x25").css("display", "inline-block");
    }

    // Hide or show the ocean numbers
    otherScripts.toggleDisplay(
      "#dio_oceanNumbers",
      oceanNumbers.getSettingValue("visibleIslandView")
    );
  },
};
