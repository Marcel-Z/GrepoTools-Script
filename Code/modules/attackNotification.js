// Module: attackNotification
// Discrption: This module handles the attack notification and changes the favicon based on the attack indicator.
// Last Updated: 2024/12/22

let attackNotification = {
  module: "attackNotification",
  settingVisibleattackNotification: true,
  defaultIcon: "https://gpnl.innogamescdn.com/images/game/start/favicon.ico",
  attackIcon: "https://www.grepotools.nl/grepotools/images/faviconAttack.ico",
  settingsKeys: [{ key: "attackNotification", value: null, default: true }],

  init() {
    if (grepolisLoaded) {
      this.loadSettings();
    }
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
    const setting = attackNotification.settingsKeys.find(
      ({ key }) => key === settingKey
    );
    setting.value = value;

    settings.safeSetting(
      `${Game.world_id}|attackNotification.${settingKey}`,
      value
    );
  },

  setVisibilityAttackNotification(value) {
    attackNotification.setSettingValue("attackNotification", value);
  },

  animate: function () {
    if (!attackNotification.getSettingValue("attackNotification")) {
      return;
    }

    const isAttackIndicatorActive = $(
      ".activity.attack_indicator.active"
    ).hasClass("active");
    const faviconElement = $('link[rel="shortcut icon"]');
    const standardIcon = this.defaultIcon;
    const attackIcon = this.attackIcon;

    const updateFavicon = (icon) => {
      faviconElement.attr("href", icon);
    };

    if (isAttackIndicatorActive) {
      const currentIcon = faviconElement.attr("href");
      const newIcon = currentIcon === standardIcon ? attackIcon : standardIcon;
      updateFavicon(newIcon);
    } else {
      updateFavicon(standardIcon);
    }
  },
};
