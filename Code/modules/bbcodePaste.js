// Module: bbcodePaste
// Description: This is the main module for the bbcode paste
// Last Updated: 2024/12/22

const bbcodePaste = {
  module: "bbcodePaste",
  rendered: false,
  styleDiv: `GrepoTools_bbcodePaste`,
  buttonAction: true,

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
            width:20px;
            height:20px;
          }
          .buttonText {
            height:23px;
            float:right
          }
        `)
      );
      this.rendered = true;
    }
  },

  addBBCodeButton(containerSelector, buttonClass, wrapperSelector) {
    if ($(containerSelector).get(0) && !$(buttonClass).get(0)) {
      $(wrapperSelector).append(
        $("<div/>", {
          id: `${containerSelector}`,
          class: `button_new GrepoToolsButtonPaste ${buttonClass.substring(1)}`,
        }).button({
          caption: `
          <img class="buttonLogo" src="https://www.grepotools.nl/grepotools/images/logoStable.png">
          <span class="buttonText">BBCode</span>`,
        })
      );
    }
  },

  render() {
    if (bbcodePaste.rendered) {
      // Forum new topic / post reply
      bbcodePaste.addBBCodeButton(
        "#bbcodes",
        ".gtForum",
        "#bbcodes .bb_button_wrapper"
      );
      bbcodePaste.addBBCodeButton(
        "#post_save_form",
        ".gtForum",
        "#post_save_form .bb_button_wrapper"
      );

      // Message / message reply
      bbcodePaste.addBBCodeButton(
        "#message_new_message",
        ".gtMesage",
        "#message_bbcodes .bb_button_wrapper"
      );
      bbcodePaste.addBBCodeButton(
        ".bb_button_wrapper",
        ".gtMesage",
        "#message_bbcodes .bb_button_wrapper"
      );

      // Note
      this.addBBCodeButton(
        ".notes_container",
        ".gtNotes",
        ".notes_container .bb_button_wrapper"
      );

      $(".GrepoToolsButtonPaste").click((e) => {
        if (this.buttonAction) {
          this.buttonAction = false;

          const classMapping = {
            "button_new GrepoToolsButtonPaste gtForum": {
              location: "forum",
              elementId: "forum_post_textarea",
            },
            "button_new GrepoToolsButtonPaste gtMesage": {
              location: "message",
              elementIds: ["message_new_message", "message_reply_message"],
            },
            "button_new GrepoToolsButtonPaste gtNotes": {
              location: "notes",
              elementQuery: "#txta_notes > div.middle > textarea",
            },
          };

          const mapping =
            classMapping[
              $(e.target).closest("div.GrepoToolsButtonPaste").attr("class")
            ];

          if (mapping) {
            this.location = mapping.location;
            this.messageElement = this.getmessageElement(mapping);
            this.start = this.messageElement.selectionStart;
            this.end = this.messageElement.selectionEnd;
            this.textBefore = this.messageElement.value.substring(
              0,
              this.start
            );
            this.textAfter = this.messageElement.value.substring(this.end);

            bbcodeWindow.init();
            WF.open("bbcodeWindow");

            this.setActivePage();

            setTimeout(() => {
              this.buttonAction = true;
            }, 500);
          }
        }
      });

      this.setupPasteButton(
        "#GrepoToolsPasteIslandButton",
        bbcodePasteIsland.createOutput.bind(bbcodePasteIsland)
      );
      this.setupPasteButton(
        "#GrepoToolsPastePlayerButton",
        bbcodePastePlayer.createOutput.bind(bbcodePastePlayer)
      );
      this.setupPasteButton(
        "#GrepoToolsPasteAllianceButton",
        bbcodePasteAlliance.createOutput.bind(bbcodePasteAlliance)
      );
    }
  },

  getmessageElement(mapping) {
    if (mapping.elementId) {
      return document.getElementById(mapping.elementId);
    } else if (mapping.elementIds) {
      for (const id of mapping.elementIds) {
        if ($(`#${id}`).length) {
          return document.getElementById(id);
        }
      }
    } else if (mapping.elementQuery) {
      return document.querySelector(mapping.elementQuery);
    }
  },

  setActivePage() {
    if (bbcodeCopyAlliance.data.size) {
      bbcodeWindow.windowId.setActivePageNr(2);
    } else if (bbcodeCopyIsland.data.size) {
      bbcodeWindow.windowId.setActivePageNr(1);
    } else if (bbcodeCopyPlayer.data.size) {
      bbcodeWindow.windowId.setActivePageNr(0);
    } else {
      bbcodeWindow.windowId.setActivePageNr(0);
    }
  },

  setupPasteButton(selector, createOutput) {
    $(selector).click(() => {
      if (this.buttonAction) {
        this.buttonAction = false;
        const data = createOutput();

        switch (this.location) {
          case "message":
          case "forum":
            if (this.messageElement) {
              this.messageElement.value = `${this.textBefore}${data}${this.textAfter}`;
              this.messageElement.focus();
            } else {
              bbcodeWindow.windowId.close();
            }
            break;
          case "notes":
            const textarea = $("#txta_notes > div.middle > textarea");
            if (textarea.length) {
              textarea
                .val(`${this.textBefore}${data}${this.textAfter}`)
                .keyup();
              this.messageElement.focus();
            } else {
              bbcodeWindow.windowId.close();
            }
            break;
        }
        bbcodeWindow.windowId.close();
        setTimeout(() => {
          this.buttonAction = true;
        }, 500);
      }
    });
  },
};
