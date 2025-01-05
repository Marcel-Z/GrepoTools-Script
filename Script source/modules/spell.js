// module script
// Discrption: this module will add the spells to the barracks and docks
// Last Updated: 2024/12/25

let spells = {
  module: "spells",
  rendered: false,
  styleDiv: `GrepoTools_spells`,

  init() {
    if (grepolisLoaded) {
      this.createStyle();
    }
  },

  createStyle() {
    if (!this.rendered) {
      $("head").append(
        $(`<style id="${this.styleDiv}">`).append(`
          #docksSpells {
            padding-top:5px
          }
          #docksSpells > .call_of_the_ocean{
            margin-left:5px
          }
          #barracksSpells {
            padding-top:5px
          }
          #barracksSpells > .spartan_training{
            margin-left:5px
          }
          #barracksSpells > .fertility_improvement{
            clear:left;margin-left:5px
          }
          .spellCounter{
            margin-top:50px;
          }
        `)
      );
      this.rendered = true;
    }
  },

  render() {
    function addSpells(containerSelector, spellsContainerId, spellsToAdd) {
      if ($(containerSelector)[0] && !$(spellsContainerId)[0]) {
        $('<div id="' + spellsContainerId.slice(1) + '"></div>').appendTo(
          $(containerSelector + " > #units")
        );
        spellsToAdd.forEach((spell) => {
          spells.addSpell(spellsContainerId.slice(1), spell.name, spell.god);
        });
      }
    }

    // Harbour window is open
    addSpells(".docks_building", "#harbourSpells", [
      { name: "call_of_the_ocean", god: "poseidon" },
    ]);

    // Barracks window is open
    addSpells(".barracks_building", "#barracksSpells", [
      { name: "spartan_training", god: "ares" },
      { name: "fertility_improvement", god: "hera" },
    ]);
  },

  isSpellActive(spell) {
    let spellsActive = MM.checkAndPublishRawModel("Town", {
      id: Game.townId,
    }).getCastedPowers();

    return spellsActive.some(
      (spellActive) => spellActive.attributes.power_id === spell
    );
  },

  getAllActiveSpells() {
    return MM.checkAndPublishRawModel("Town", {
      id: Game.townId,
    }).getCastedPowers();
  },

  getSpellCost(spell) {
    return GameData.powers[spell].favor;
  },

  getGodFavor(god) {
    return MM.checkAndPublishRawModel("PlayerGods", { id: Game.player_id }).get(
      god + "_favor"
    );
  },

  getAllGodsFavorAndProduction() {
    return MM.checkAndPublishRawModel("PlayerGods", {
      id: Game.player_id,
    }).getProductionOverview();
  },

  addSpell(divId, spell, god) {
    let _classAdd = "";

    if (spells.getGodFavor(god) - spells.getSpellCost(spell) < 0) {
      _classAdd = " disabled";
    }

    if (spells.isSpellActive(spell)) {
      _classAdd =
        " active_animation extendable animated_power_icon animated_power_icon_45x45";
    }

    $("#" + divId).append(
      $("<div/>", {
        class: "js-power-icon power_icon45x45 " + spell + " power" + _classAdd,
        "data-spell": spell,
      })
        .append(
          $("<div/>", { class: "extend_spell" })
            .append($("<div/>", { class: "gold" }))
            .append($("<div/>", { class: "amount" }))
        )
        .append($("<div/>", { class: "js-caption" }))
        .append($("<div/>", { class: `spellCounter ${god}` }))

        .on("mouseover", function (e) {
          var tooltip = {
            show_costs: true,
          };

          casted = HelperPower.createCastedPowerModel(spell, Game.townId);
          spells.getAllActiveSpells().forEach((elem) => {
            if (elem.getPowerId() === spell) {
              casted = elem;
            }
          });

          if (typeof casted.getId != "undefined") {
            (tooltip.casted_power_end_at = casted.getEndAt()),
              (tooltip.extendable = casted.isExtendable());
          }
          $(this)
            .tooltip(
              TooltipFactory.createPowerTooltip(casted.getPowerId(), tooltip)
            )
            .showTooltip(e);
        })

        .on("click", function (e) {
          casted = HelperPower.createCastedPowerModel(spell, Game.townId);
          spells.getAllActiveSpells().forEach((elem) => {
            if (elem.getPowerId() === spell) {
              casted = elem;
            }
          });

          let activeWindow;
          $.each(Layout.wnd.getAllOpen(), function (ind, elem) {
            activeWindow = elem;
          });

          CM.unregister(
            { main: activeWindow.getContext().main, sub: "casted_powers" },
            "harbourSpells" + casted.getId()
          );

          var _btn = CM.register(
              { main: activeWindow.getContext().main, sub: "casted_powers" },
              "#harbourSpells" + casted.getId(),
              activeWindow
                .getJQElement()
                .find($("#harbourSpells .new_ui_power_icon .gold"))
                .button()
            ),
            power = HelperPower.createCastedPowerModel(spell, Game.townId);
          if (casted.getId() == undefined) {
            power.cast();
          } else {
            if (casted.isExtendable()) {
              BuyForGoldWindowFactory.openExtendPowerForGoldWindow(
                _btn,
                casted
              );
              $(this).addClass(_classAdd); // -> Check if this line is necessary
            }
          }
        })
    );
  },
};
