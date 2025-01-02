// Module: settings
// Discrption: This module will handle all the settings for the modules.
// Last Updated: 2024/11/30

let settings = {
  colors: {
    white: "#FFFFFF",
    grey: "#969696",
    lightred: "#FF5555",
    red: "#FF0000",
    brown: "#BB5511",
    lightblue: "#00FFFF",
    blue: "#0099FF",
    purple: "#FF00FF",
    pink: "#FF95FF",
    lightgreen: "#00FF00",
    green: "#399B1E",
    yellow: "#FFFF00",
  },

  loadSetting(name, defaultValue) {
    let value;
    if (typeof GM !== "undefined" && GM_getValue) {
      value = GM_getValue(name, defaultValue);
    } else {
      value = localStorage.getItem(name) || defaultValue;
    }
    if (value === undefined || value === null) {
      value = defaultValue;
      settings.safeSetting(name, value);
    }
    return value;
  },

  safeSetting(name, val) {
    if (typeof GM !== "undefined" && GM_setValue) {
      setTimeout(() => {
        GM_setValue(name, val);
      }, 0);
    } else {
      localStorage.setItem(name, val);
    }
  },
};
