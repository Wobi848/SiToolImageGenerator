// Version
const version = "0.7.10";
const versionElement = document.getElementById("version");
if (versionElement) versionElement.innerText = `v${version}`;

console.log(`v${version} - Alle anregungen an t.rappo@kieback-peter.ch`);

// XML Variables
let inputsIndex: any = [0];
let backgroundLayer: BackgroundLayer[] = [];
let backgroundLayerY = 42;
let freeComponent: FreeComponent[] = [];
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
const widthInput = document.getElementById("width-input") as HTMLInputElement;
const ratInput = document.getElementById("rat-input") as HTMLInputElement;
const imageNameInput = document.getElementById(
  "imagename-input"
) as HTMLInputElement;

widthInput.addEventListener("input", () => {
  freeComponentWidth = parseInt(widthInput.value, 10);
  if (freeComponentWidth <= 300) freeComponentWidth = freeComponentWidthmin;
});
