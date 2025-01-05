// Module: bbcodeWindow
// Description: This is the window module for the bbcode paste settings
// Last Updated: 2024/12/21

let bbcodeWindow = {
  windowId: "",
  styleDiv: "GrepoTools_bbcode",
  rendered: false,
  listAction: true,
  subMenuItems: [],

  init() {
    if (grepolisLoaded) {
      bbcodeWindow.window("bbcodeWindow");
      bbcodeWindow.createStyle();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          #bbcodeContent { 
            height:500px;
            background-color:"#FFE3A1";
            margin:-5px
          }
          #bbcodeContent .infoTextSmall{
            margin-bottom:10px;
            margin-top:10px;
          }
          #bbcodeContent .checkbox_new{
            display:block;
            margin-bottom:3px;
          )
           #bbcodeContent label + .dropdown{
            margin-left:10px;
            margin-bottom: 5px;
          }
           #bbcodeContent .caption{
            padding-left: 5px !important;
            padding-right: 20px !important;
          }
        `)
      );
      this.rendered = true;
    }
  },

  createInfoText(infoText) {
    return $("<div/>", { class: "infoText" }).append(infoText);
  },

  createInfoTextSmall(infoText) {
    return $("<div/>", { class: "infoTextSmall" }).append(infoText);
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

  tab(tab) {
    switch (tab) {
      case 0:
        if (bbcodeCopyPlayer.data.size) {
          bbcodeWindow.createContent(0);
          bbcodeWindow.controlActionsPlayer();
        } else {
          $("#bbcodeContent").append(
            `<p><b style="margin-left:15px">${
              language[language.settingActiveLanguage].noDataAvailable
            }</b></p>`
          );
        }
        break;
      case 1:
        if (bbcodeCopyIsland.data.size) {
          bbcodeWindow.createContent(1);
        } else {
          $("#bbcodeContent").append(
            `<p><b style="margin-left:15px">${
              language[language.settingActiveLanguage].noDataAvailable
            }</b></p>`
          );
        }
        break;
      case 2:
        if (bbcodeCopyAlliance.data.size) {
          bbcodeWindow.createContent(2);
        } else {
          $("#bbcodeContent").append(
            `<p><b style="margin-left:15px">${
              language[language.settingActiveLanguage].noDataAvailable
            }</b></p>`
          );
        }
        break;
    }
  },

  createContent(tabNo) {
    bbcodeWindow.subMenuItems = [];
    switch (tabNo) {
      case 0:
        bbcodeWindow.subMenuItems = [
          {
            sectionId: "bbcodePastePlayerSettings",
            gameHeaderText: `${
              language[language.settingActiveLanguage].playerDataAvailable
            } ${bbcodeCopyPlayer.data.get(0).playerName} | ${
              bbcodeCopyPlayer.data.size - 1
            } ${
              bbcodeCopyPlayer.data.size - 1 > 1
                ? language[language.settingActiveLanguage].towns
                : language[language.settingActiveLanguage].town
            }`,
            display: "block",
            options: [
              {
                type: "infoText",
                caption: `${
                  language[language.settingActiveLanguage].showInfoAboveTable
                }`,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].player}`,
                id: "bbcodePlayerShowPlayerName",
                setting: bbcodePastePlayer.getSettingValue("showPlayerName"),
                functionToCall: bbcodePastePlayer.setShowPlayerName,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].alliance}`,
                id: "bbcodePlayerShowAllianceName",
                setting: bbcodePastePlayer.getSettingValue("showAllianceName"),
                functionToCall: bbcodePastePlayer.setShowAllianceName,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].grepolisRank
                }`,
                id: "bbcodePlayerShowGrepolisRank",
                setting: bbcodePastePlayer.getSettingValue("showGrepolisRank"),
                functionToCall: bbcodePastePlayer.setShowgrepolisRank,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].grepolisScore
                }`,
                id: "bbcodePlayerShowPlayerGrepolisScore",
                setting: bbcodePastePlayer.getSettingValue(
                  "showPlayerGrepolisScore"
                ),
                functionToCall: bbcodePastePlayer.setShowPlayerGrepolisScore,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].battlePoints
                }`,
                id: "bbcodePlayerShowPlayerBattlePoints",
                setting: bbcodePastePlayer.getSettingValue(
                  "showPlayerBattlePoints"
                ),
                functionToCall: bbcodePastePlayer.setShowPlayerBattlePoints,
              },
              {
                type: "infoText",
                caption: `${
                  language[language.settingActiveLanguage].showInfoInTable
                }`,
              },
              {
                type: "infoTextSmall",
                caption: `${
                  language[language.settingActiveLanguage].cityRequired
                }`,
              },
              {
                type: "dropDown",
                caption: `${
                  language[language.settingActiveLanguage].selectPage
                } `,
                id: "bbcodePlayerPage",
                setting: bbcodePastePlayer.tablePage,
                options: bbcodeWindow.selectPageOptions(),
                display:
                  bbcodeCopyPlayer.data.size - 1 >
                  bbcodePastePlayer.tableMaxRows
                    ? true
                    : false,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].number}`,
                id: "bbcodePlayerShowNumber",
                setting: bbcodePastePlayer.getSettingValue("showNumber"),
                functionToCall: bbcodePastePlayer.setShowNumber,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].points}`,
                id: "bbcodePlayerShowPoints",
                setting: bbcodePastePlayer.getSettingValue("showPoints"),
                functionToCall: bbcodePastePlayer.setShowPoints,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].ocean}`,
                id: "bbcodePlayerShowOcean",
                setting: bbcodePastePlayer.getSettingValue("showOcean"),
                functionToCall: bbcodePastePlayer.setShowOcean,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].islandNumber
                }`,
                id: "bbcodePlayerShowIslandNumber",
                setting: bbcodePastePlayer.getSettingValue("showIslandNumber"),
                functionToCall: bbcodePastePlayer.setShowIslandNumber,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].islandTag
                }`,
                id: "bbcodePlayerShowIslandTag",
                setting: bbcodePastePlayer.getSettingValue("showIslandTag"),
                functionToCall: bbcodePastePlayer.setShowIslandTag,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].emptyColumn
                }`,
                id: "bbcodePlayershowEmptyColumn",
                setting: bbcodePastePlayer.getSettingValue("showEmptyColumn"),
                functionToCall: bbcodePastePlayer.setShowEmptyColumn,
              },
              {
                type: "button",
                id: "GrepoToolsPastePlayerButton",
                caption: language[language.settingActiveLanguage].pasteData,
                disabled: false,
                functionToCall: bbcodePastePlayer.createOutput,
              },
            ],
          },
        ];
        break;
      case 1:
        bbcodeWindow.subMenuItems = [
          {
            sectionId: "bbcodePasteIslandSettings",
            gameHeaderText: `${
              language[language.settingActiveLanguage].islandDataAvailable
            } ${bbcodeCopyIsland.data.get(0).islandNumber} | ${
              bbcodeCopyIsland.data.size - 1
            } ${
              bbcodeCopyIsland.data.size - 1 > 1
                ? language[language.settingActiveLanguage].towns
                : language[language.settingActiveLanguage].town
            }`,
            display: "block",
            options: [
              {
                type: "infoText",
                caption: `${
                  language[language.settingActiveLanguage].showInfoAboveTable
                }`,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].islandNumber
                }`,
                id: "bbcodeIslandShowIslandNumber",
                setting: bbcodePasteIsland.getSettingValue("showIslandNumber"),
                functionToCall: bbcodePasteIsland.setShowIslandNumber,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].islandTag
                }`,
                id: "bbcodeIslandShowIslandTag",
                setting: bbcodePasteIsland.getSettingValue("showIslandTag"),
                functionToCall: bbcodePasteIsland.setShowIslandTag,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].islandOccupation
                }`,
                id: "bbcodeIslandShowIslandOccupation",
                setting: bbcodePasteIsland.getSettingValue(
                  "showIslandOccupation"
                ),
                functionToCall: bbcodePasteIsland.setShowIslandOccupation,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].resources
                }`,
                id: "bbcodeIslandShowIslandResources",
                setting: bbcodePasteIsland.getSettingValue(
                  "showIslandResources"
                ),
                functionToCall: bbcodePasteIsland.setShowIslandResources,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].ocean}`,
                id: "bbcodeIslandShowIslandOcean",
                setting: bbcodePasteIsland.getSettingValue("showIslandOcean"),
                functionToCall: bbcodePasteIsland.setShowIslandOcean,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].coordinates
                }`,
                id: "bbcodeIslandShowIslandCoordinates",
                setting: bbcodePasteIsland.getSettingValue(
                  "showIslandCoordinates"
                ),
                functionToCall: bbcodePasteIsland.setShowIslandCoordinates,
              },
              {
                type: "infoText",
                caption: `${
                  language[language.settingActiveLanguage].showInfoInTable
                }`,
              },
              {
                type: "infoTextSmall",
                caption: `${
                  language[language.settingActiveLanguage].cityRequired
                }`,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].number}`,
                id: "bbcodeIslandShowNumber",
                setting: bbcodePasteIsland.getSettingValue("showNumber"),
                functionToCall: bbcodePasteIsland.setShowNumber,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].points}`,
                id: "bbcodeIslandShowPoints",
                setting: bbcodePasteIsland.getSettingValue("showPoints"),
                functionToCall: bbcodePasteIsland.setShowPoints,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].player}`,
                id: "bbcodeIslandShowPlayer",
                setting: bbcodePasteIsland.getSettingValue("showPlayer"),
                functionToCall: bbcodePasteIsland.setShowPlayer,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].alliance}`,
                id: "bbcodeIslandShowAlliance",
                setting: bbcodePasteIsland.getSettingValue("showAlliance"),
                functionToCall: bbcodePasteIsland.setShowAlliance,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].emptyColumn
                }`,
                id: "bbcodeIslandshowEmptyColumn",
                setting: bbcodePasteIsland.getSettingValue("showEmptyColumn"),
                functionToCall: bbcodePasteIsland.setShowEmptyColumn,
              },
              {
                type: "button",
                id: "GrepoToolsPasteIslandButton",
                caption: language[language.settingActiveLanguage].pasteData,
                disabled: false,
                functionToCall: bbcodePasteIsland.createOutput,
              },
            ],
          },
        ];
        break;
      case 2:
        bbcodeWindow.subMenuItems = [
          {
            sectionId: "bbcodePasteAllianceSettings",
            gameHeaderText: `${
              language[language.settingActiveLanguage].allianceDataAvailable
            } ${bbcodeCopyAlliance.data.get(0).allianceName} | ${
              bbcodeCopyAlliance.data.size - 1
            } ${
              bbcodeCopyAlliance.data.size - 1 > 1
                ? language[language.settingActiveLanguage].members
                : language[language.settingActiveLanguage].member
            }`,
            display: "block",
            options: [
              {
                type: "infoText",
                caption: `${
                  language[language.settingActiveLanguage].showInfoAboveTable
                }`,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].alliance}`,
                id: "bbcodeAllianceShowAllianceName",
                setting:
                  bbcodePasteAlliance.getSettingValue("showAllianceName"),
                functionToCall: bbcodePasteAlliance.setShowAllianceName,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].allianceNumberPlayers
                }`,
                id: "bbcodeAllianceShowAllianceNumberPlayers",
                setting: bbcodePasteAlliance.getSettingValue(
                  "showAllianceNumberPlayers"
                ),
                functionToCall:
                  bbcodePasteAlliance.setShowAllianceNumberPlayers,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].alliancePoints
                }`,
                id: "bbcodeAllianceShowAlliancePoints",
                setting:
                  bbcodePasteAlliance.getSettingValue("showAlliancePoints"),
                functionToCall: bbcodePasteAlliance.setShowAlliancePoints,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].allianceRank
                }`,
                id: "bbcodeAllianceShowAllianceRank",
                setting:
                  bbcodePasteAlliance.getSettingValue("showAllianceRank"),
                functionToCall: bbcodePasteAlliance.setShowAllianceRank,
              },
              {
                type: "infoText",
                caption: `${
                  language[language.settingActiveLanguage].showInfoInTable
                }`,
              },
              {
                type: "infoTextSmall",
                caption: `${
                  language[language.settingActiveLanguage].playerRequired
                }`,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].number}`,
                id: "bbcodeAllianceshowNumber",
                setting: bbcodePasteAlliance.getSettingValue("showNumber"),
                functionToCall: bbcodePasteAlliance.setShowNumber,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].points}`,
                id: "bbcodeAllianceshowPoints",
                setting:
                  bbcodePasteAlliance.getSettingValue("showPlayerPoints"),
                functionToCall: bbcodePasteAlliance.setShowPlayerPoints,
              },
              {
                type: "checkBox",
                caption: `${language[language.settingActiveLanguage].towns}`,
                id: "bbcodeAllianceshowTowns",
                setting: bbcodePasteAlliance.getSettingValue("showPlayerTowns"),
                functionToCall: bbcodePasteAlliance.setShowPlayerTowns,
              },
              {
                type: "checkBox",
                caption: `${
                  language[language.settingActiveLanguage].emptyColumn
                }`,
                id: "bbcodeAllianceshowEmptyColumn",
                setting: bbcodePasteAlliance.getSettingValue("showEmptyColumn"),
                functionToCall: bbcodePasteAlliance.setShowEmptyColumn,
              },
              {
                type: "button",
                id: "GrepoToolsPasteAllianceButton",
                caption: language[language.settingActiveLanguage].pasteData,
                disabled: false,
                functionToCall: bbcodePasteAlliance.createOutput,
              },
            ],
          },
        ];
        break;
    }

    const container = document.getElementById("bbcodeContent");
    bbcodeWindow.subMenuItems.forEach((section) => {
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "section";
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
          case "infoTextSmall":
            optionDiv = this.createInfoTextSmall(option.caption);
            break;
          case "checkBox":
            optionDiv = this.createCheckbox(
              option.id,
              option.caption,
              option.setting
            );
            optionDiv.click(function () {
              option.setting = bbcodeWindow.toggleCheckbox($(this));
              option.functionToCall(option.setting);
            });
            break;
          case "dropDown":
            if (option.display != false) {
              optionDiv = bbcodeWindow.createDropdown(
                option.id,
                option.caption,
                option.setting,
                option.options
              );
            }
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

  controlActionsPlayer() {
    $("#bbcodePlayerPage_list").click(function () {
      if (!bbcodeWindow.listAction) return;

      $(".selected", this).each(function () {
        const name = $(this).attr("name");
        bbcodePastePlayer.setTablePage(name);
      });

      setTimeout(() => {
        bbcodeWindow.listAction = true;
      }, 500);
    });
  },

  selectPageOptions() {
    let dropdownOptions = [];
    const maxPage = Math.ceil(
      (bbcodeCopyPlayer.data.size - 1) / bbcodePastePlayer.tableMaxRows
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

  window(id) {
    ("use strict");

    var _IdS = id;
    var _windows = require("game/windows/ids");
    (_windows[_IdS.toUpperCase()] = _IdS),
      (function () {
        var a = uw.GameControllers.TabController,
          b = uw.GameModels.Progressable,
          _content = $("<div/>", { id: "#bbcodePasteSettings" }),
          c = a.extend({
            initialize: function (b) {
              a.prototype.initialize.apply(this, arguments);
              var _wnd = this.getWindowModel(),
                _$el = this.$el;
              bbcodeWindow.windowId = _wnd;
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
                `<img src="https://www.grepotools.nl/grepotools/images/logoStable.png" width="15" height="15"> 
                ${language[language.settingActiveLanguage].bbcodeWindowTitle}`
              ),
                this.getWindowModel().showLoading();
              setTimeout(function () {
                _wnd.setContent2('<div id="bbcodeContent"></div>'),
                  bbcodeWindow.tab(_wnd.getActivePageNr());

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
              minheight: 520,
              maxheight: 530,
              width: 622,
              tabs: [
                {
                  type: id,
                  title: `${language[language.settingActiveLanguage].player}`,
                  content_view_constructor: a["grepotools_" + _IdS],
                  hidden: 0,
                  disabled: 0,
                },
                {
                  type: id,
                  title: `${language[language.settingActiveLanguage].island}`,
                  content_view_constructor: a["grepotools_" + _IdS],
                  hidden: 0,
                  disabled: 0,
                },
                {
                  type: id,
                  title: `${language[language.settingActiveLanguage].alliance}`,
                  content_view_constructor: a["grepotools_" + _IdS],
                  hidden: 0,
                  disabled: 0,
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
