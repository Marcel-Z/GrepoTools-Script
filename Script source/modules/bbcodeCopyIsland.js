// Module: bbcodeCopyAlliance
// Discrption: This module will add a button to the island page to copy the island bbcode.
// Last Updated: 2024/12/15

let bbcodeCopyIsland = {
  module: "bbcodeCopyIsland",
  rendered: false,
  styleDiv: `GrepoTools_bbcodeCopyIsland`,
  buttonAction: true,
  data: new Map(),

  init() {
    if (grepolisLoaded) {
      this.createStyle();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          .buttonLogo {
            margin-right:10px;
          }
          .buttonText {
            height:23px;
            float:right;
          }
          .bbcodeIslandButton {
            float:right;
            padding-top:3px;
          }
        `)
      );
      this.rendered = true;
    }
  },

  animate() {
    if (!this.rendered == true) {
      return;
    }

    Layout.wnd.getAllOpen().forEach((elem) => {
      if (elem.getController() === "island_info") {
        if (!$(`#bbcodeIslandButton${elem.getElement().id}`).length) {
          otherScripts.checkActiveScripts();
          this.hideDiotoolsBbcodeButton();
          this.hideGrcrtBbcodeButton();
          this.addButton(elem.getElement().id);
        }
      }
    });
  },

  addButton(id) {
    $(`#${id} .island_info_left .game_header`).append(
      $("<div/>", {
        id: `bbcodeIslandButton${id}`,
        class: `button_new bbcodeIslandButton ${id}`,
      }).button({
        caption: `
          <img class="buttonLogo" src="https://www.grepotools.nl/grepotools/images/logoStable.png">
          <span class="buttonText">BBCode</span>`,
      })
    );
    $(`#${id} .island_info_left .game_header`).css("height", "27px");

    $(`#bbcodeIslandButton${id}`).tooltip(
      `${language[language.settingActiveLanguage].bbcodeIsland}`
    );

    $(`#bbcodeIslandButton${id}`).click(function (e) {
      if (bbcodeCopyIsland.buttonAction) {
        bbcodeCopyIsland.buttonAction = false;
        bbcodeCopyIsland.data.clear();

        const islandInfo = bbcodeCopyIsland.getIslandInfo(e, $(this));
        bbcodeCopyIsland.data.set(0, islandInfo);

        const selectedOption = $(this)
          .closest(".game_border")
          .find("#island_towns_sort")
          .val();

        const selectedOptionMap = {
          name: "#island_info_towns_left_sorted_by_name",
          score: "#island_info_towns_left_sorted_by_score",
          player: "#island_info_towns_left_sorted_by_player",
        };

        const ulElement = $(this)
          .closest(".game_border")
          .find(selectedOptionMap[selectedOption]);

        let i = 0;

        ulElement.find("li").each(function () {
          const aTag = $(this).find("a");
          if (aTag.length > 0 && aTag.attr("href")) {
            i++;
            const bbcodeTownData = JSON.parse(
              atob($(this).find("a").attr("href").split("#")[1])
            );

            let alliance;
            if (
              externalData.townData.get(bbcodeTownData.id.toString())
                .allianceName == null
            ) {
              alliance = "";
            } else {
              alliance = decodeURI(
                externalData.townData
                  .get(bbcodeTownData.id.toString())
                  .allianceName.split("+")
                  .join(" ")
              );
            }

            let playerName;

            // Code playerName modified so it also works if GRCRT is active
            const playerNameElement = $(this).find("span.player_name");

            if (playerNameElement.find("a").length > 0) {
              playerName = playerNameElement.find("a").text();
            } else {
              playerName = playerNameElement.text();
            }

            townInfo = {
              townId: parseInt(bbcodeTownData.id),
              townName: externalData.townData.name,
              townPoints: parseInt(
                $(this).find("span.small").first().text().match(/\d+/)[0]
              ),
              player: playerName,
              alliance,
            };

            bbcodeCopyIsland.data.set(i, townInfo);
          } else {
            HumanMessage.error(
              `${language[language.settingActiveLanguage].bbcodeIslandCopyFail}`
            );
            bbcodeCopyIsland.data.clear();
          }
        });

        setTimeout(() => {
          if (bbcodeCopyIsland.data.size > 0) {
            $(".bbcodeIslandButton").removeClass("disabled");
            $("#ajax_loader").css("visibility", "hidden");
            HumanMessage.success(
              `${
                language[language.settingActiveLanguage].bbcodeIslandCopySucces
              }`
            );
          }
          bbcodeCopyIsland.buttonAction = true;
        }, 500);
      }
    });
  },

  getIslandInfo(event, target) {
    const windowClass = event.currentTarget.classList[2];

    const islandNumber = parseInt(
      target.closest(`#${windowClass}`).find("h4").text().match(/\d+/g)
    );

    const islandInfo = target
      .closest(`#${windowClass}`)
      .find(".islandinfo_coords")
      .text()
      .trim();

    const regex = /(\w+):\s*(\d+)\s*\((\d+)\/(\d+)\)/;
    const match = islandInfo.match(regex);
    let ocean, islandX, islandY;

    if (match) {
      ocean = parseInt(match[2]);
      islandX = parseInt(match[3]);
      islandY = parseInt(match[4]);
    }

    const islandFreeSpace = parseInt(
      target
        .closest(`#${windowClass}`)
        .find(".islandinfo_free")
        .text()
        .match(/\d+/g)
    );

    // Search islandData for islandNumber
    let islandTag, islandRes;

    for (let [key, value] of externalData.islandData.entries()) {
      const islandObject = value.find(
        (item) => parseInt(item.id) === islandNumber
      );
      if (islandObject) {
        islandTag = islandObject.tagData;
        islandRes = islandObject.res;
        break;
      }
    }

    return {
      islandNumber: parseInt(islandNumber),
      islandTag,
      islandRes,
      islandFreeSpace: parseInt(islandFreeSpace),
      ocean: parseInt(ocean),
      islandX: parseInt(islandX),
      islandY: parseInt(islandY),
    };
  },

  hideDiotoolsBbcodeButton() {
    if (
      otherScripts.diotoolsActive &&
      otherScripts.getSettingValue("diotoolsBbcodeButton")
    ) {
      $("#dio_island_info").hide();
    }
  },

  hideGrcrtBbcodeButton() {
    if (
      otherScripts.grcrtActive &&
      otherScripts.getSettingValue("grcrtBbcodeButton")
    ) {
      $("div[name='BBCode']").hide();
    }
  },
};
