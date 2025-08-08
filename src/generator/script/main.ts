// Version
const version = "1.3.1";
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
  `%cv${version} %c- Alle anregungen an %csupport@rappo.dev`,
  "color: yellow; font-weight:bold",
  "color: white; font-weight:bold",
  "color: orange; font-weight:bold"
);

// XML Variables
let inputsIndex: number[] = [0]; // Index for inputs
let backgroundLayer: { y: number }[] = []; // Background layer configuration
let backgroundLayerY = 42; // Default Y position for background layers
let freeComponent: FreeComponent[] = []; // Array to store free components
let freeComponentCount = 1; // Count of free components
let freeComponentRows = 1; // Number of rows for free components
let actualFreeComponentsCount = 1; // Actual count of free components
const freeComponentComp = 268; // Starting component ID
const freeComponentVar = 153231; // Starting variable ID
const freeComponentX = 0; // Default X position for free components
const freeComponentY = 22; // Default Y position for free components
let freeComponentWidth = 300; // Default width for free components
const freeComponentWidthmin = 200; // Minimum width for free components
const freeComponentAddress = "tOff"; // Default address for free components

const freeComponentVersionDDC: string = "1.7.1"; // Version for DDC platform
const freeComponentPlatformDDC: string = "DDC4000"; // Platform name for DDC
const freeComponentFileNameDDC: string = ".editor"; // File name for DDC
const freeComponentVersionBMR: string = "2.01.1"; // Version for BMR platform
const freeComponentPlatformBMR: string = "BMR"; // Platform name for BMR
const freeComponentFileNameBMR: string = "_cr.editor"; // File name for BMR

let freeComponentVersion: string = freeComponentVersionDDC; // Current version
let freeComponentPlatform: string = freeComponentPlatformDDC; // Current platform
let freeComponentFileName: string = freeComponentFileNameDDC; // Current file name

let freeComponentPlatformSelect: boolean = true; // Flag for platform selection

// Inputs
const widthInput = document.getElementById("width-input") as HTMLInputElement; // Input for width
const ratInput = document.getElementById("rat-input") as HTMLInputElement; // Input for ratio
const imageNameInput = document.getElementById(
  "imagename-input"
) as HTMLInputElement; // Input for image name

document.addEventListener("DOMContentLoaded", () => {
  // Load stored settings from localStorage
  const storedBasicSettings = localStorage.getItem("basicSettings");
  if (storedBasicSettings) {
    const basicSettings = JSON.parse(storedBasicSettings);
    freeComponentWidth = basicSettings.width;
    if (freeComponentWidth <= freeComponentWidthmin) {
      freeComponentWidth = freeComponentWidthmin;
    }
    widthInput.value = `${freeComponentWidth}`; // Apply saved value to widthInput
  }

  // Update width value and save to localStorage on input change
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
