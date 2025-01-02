// module ocean
// Discrption: this module will calculate the visible oceans on the screen on the strategic map and island view.
// Last Updated: 2024/11/30

let ocean = {
  oceanSize: "",
  visibleOceans: [],
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,

  visibleOnScreen() {
    if (Game.layout_mode === "city_overview") return;

    ocean.getGameLayoutInfo();

    this.visibleOceans.length = 0;

    const positions = [
      this.calculateOcean(this.left, this.top),
      this.calculateOcean(this.left, this.bottom),
      this.calculateOcean(this.right, this.top),
      this.calculateOcean(this.right, this.bottom),
    ];

    positions.forEach((position) => {
      if (!this.visibleOceans.includes(position)) {
        this.visibleOceans.push(position);
      }
    });
  },

  getGameLayoutInfo() {
    const convertToPositiveInt = (value) =>
      parseInt(value.replace("-", "").replace("px", ""));

    switch (Game.layout_mode) {
      case "strategic_map":
        this.oceanSize = 2560;

        [this.left, this.top] = $("#minimap")
          .css("translate")
          .split(",")
          .map(convertToPositiveInt);
        break;
      case "island_view":
        this.oceanSize = 12800;

        [this.left, this.top] = [
          convertToPositiveInt($("#map_move_container").css("left")),
          convertToPositiveInt($("#map_move_container").css("top")),
        ];
        break;
    }
    this.right = this.left + window.innerWidth;
    this.bottom = this.top + window.innerHeight;
  },

  calculateOcean(x, y) {
    return parseInt(
      Math.floor(x / this.oceanSize).toString() +
        Math.floor(y / this.oceanSize).toString()
    );
  },
};
