"use strict";
// Version
const version = "0.8.0";
const versionElement = document.getElementById("version");
if (versionElement)
    versionElement.innerText = `v${version}`;
/* DEBUG */
let debug = true;
// Domain
let domain_name = document.location.hostname;
console.log(domain_name);
if (domain_name == "kp.rappo.dev") {
    debug = false;
}
if (debug)
    console.log("debugOn");
// Info
console.log(`%cv${version} %c- Alle anregungen an %ct.rappo@kieback-peter.ch`, "color: yellow; font-weight:bold", "color: white; font-weight:bold", "color: orange; font-weight:bold");
// XML Variables
let inputsIndex = [0];
let backgroundLayer = [];
let backgroundLayerY = 42;
let freeComponent = [];
let freeComponentCount = 1;
let freeComponentRows = 1;
let actualFreeComponentsCount = 1;
const freeComponentComp = 268;
const freeComponentVar = 153231;
const freeComponentX = 0;
const freeComponentY = 22;
let freeComponentWidth = 300;
const freeComponentWidthmin = 200;
const freeComponentAddress = "tOff";
const freeComponentVersionDDC = "1.7.1";
const freeComponentPlatformDDC = "DDC4000";
const freeComponentFileNameDDC = ".editor";
const freeComponentVersionBMR = "2.01.1";
const freeComponentPlatformBMR = "BMR";
const freeComponentFileNameBMR = "_cr.editor";
let freeComponentVersion = freeComponentVersionDDC;
let freeComponentPlatform = freeComponentPlatformDDC;
let freeComponentFileName = freeComponentFileNameDDC;
let freeComponentPlatformSelect = true;
// Inputs
const widthInput = document.getElementById("width-input");
const ratInput = document.getElementById("rat-input");
const imageNameInput = document.getElementById("imagename-input");
widthInput.addEventListener("input", () => {
    freeComponentWidth = parseInt(widthInput.value, 10);
    if (freeComponentWidth <= freeComponentWidthmin)
        freeComponentWidth = freeComponentWidthmin;
});
//# sourceMappingURL=main.js.map
