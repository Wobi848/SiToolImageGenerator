"use strict";
// Version
const debug = false;
const version = "0.7.11";
const versionElement = document.getElementById("version");
if (versionElement)
    versionElement.innerText = `v${version}`;
console.log(`%cv${version} %c- Alle anregungen an %ct.rappo@kieback-peter.ch`, "color: yellow; font-weight:bold", "color: white; font-weight:bold", "color: orange; font-weight:bold");
// XML Variables
let inputsIndex = [0];
let backgroundLayer = [];
let backgroundLayerY = 42;
let freeComponent = [];
let freeComponentCount = 1;
let freeComponentRows = 1;
const freeComponentComp = 268;
const freeComponentVar = 153231;
const freeComponentX = 0;
const freeComponentY = 22;
let freeComponentWidth = 300;
const freeComponentWidthmin = 300;
const freeComponentAddress = "tOff";
// Inputs
const widthInput = document.getElementById("width-input");
const ratInput = document.getElementById("rat-input");
const imageNameInput = document.getElementById("imagename-input");
widthInput.addEventListener("input", () => {
    freeComponentWidth = parseInt(widthInput.value, 10);
    if (freeComponentWidth <= 300)
        freeComponentWidth = freeComponentWidthmin;
});
//# sourceMappingURL=main.js.map