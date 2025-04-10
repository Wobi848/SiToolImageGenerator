// Version
const version = "0.8.1";
const versionElement = document.getElementById("version");
if (versionElement) versionElement.innerText = `v${version}`;

/* DEBUG */
let debug: boolean = true;

// Domain
let domain_name = document.location.hostname;
console.log(domain_name);

if (domain_name == "kp.rappo.dev") {
  debug = false;
}

if (debug) console.log("debugOn");

// Info
console.log(
  `%cv${version} %c- Alle anregungen an %ct.rappo@kieback-peter.ch`,
  "color: yellow; font-weight:bold",
  "color: white; font-weight:bold",
  "color: orange; font-weight:bold"
);

// XML Variables
let inputsIndex: any = [0];
let backgroundLayer: BackgroundLayer[] = [];
let backgroundLayerY = 42;
let freeComponent: FreeComponent[] = [];
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

const freeComponentVersionDDC: string = "1.7.1";
const freeComponentPlatformDDC: string = "DDC4000";
const freeComponentFileNameDDC: string = ".editor";
const freeComponentVersionBMR: string = "2.01.1";
const freeComponentPlatformBMR: string = "BMR";
const freeComponentFileNameBMR: string = "_cr.editor";

let freeComponentVersion: string = freeComponentVersionDDC;
let freeComponentPlatform: string = freeComponentPlatformDDC;
let freeComponentFileName: string = freeComponentFileNameDDC;

let freeComponentPlatformSelect: boolean = true;

// Inputs
const widthInput = document.getElementById("width-input") as HTMLInputElement;
const ratInput = document.getElementById("rat-input") as HTMLInputElement;
const imageNameInput = document.getElementById(
  "imagename-input"
) as HTMLInputElement;

document.addEventListener("DOMContentLoaded", () => {
  const storedBasicSettings = localStorage.getItem("basicSettings");
  if (storedBasicSettings) {
    const basicSettings = JSON.parse(storedBasicSettings);
    freeComponentWidth = basicSettings.width;
    if (freeComponentWidth <= freeComponentWidthmin) {
      freeComponentWidth = freeComponentWidthmin;
    }
    widthInput.value = `${freeComponentWidth}`; // Apply saved value to widthInput
  }

  widthInput.addEventListener("input", () => {
    freeComponentWidth = parseInt(widthInput.value, 10);
    if (freeComponentWidth <= freeComponentWidthmin) {
      freeComponentWidth = freeComponentWidthmin;
    }
    localStorage.setItem("basicSettings", JSON.stringify({
      ...JSON.parse(localStorage.getItem("basicSettings") || "{}"),
      width: freeComponentWidth,
    }));
  });
});
