// Version
const version = "0.7.16";
const versionElement = document.getElementById("version");
if (versionElement) versionElement.innerText = `v${version}`;

/* DEBUG */
let debug: boolean = true;

// Domain
let domain_name = document.location.hostname;
console.log(domain_name);

if (domain_name == 'kp.rappo.dev') {
  debug = false;
}

if (debug) console.log('debugOn');

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

// Inputs
const widthInput = document.getElementById("width-input") as HTMLInputElement;
const ratInput = document.getElementById("rat-input") as HTMLInputElement;
const imageNameInput = document.getElementById(
  "imagename-input"
) as HTMLInputElement;

widthInput.addEventListener("input", () => {
  freeComponentWidth = parseInt(widthInput.value, 10);
  if (freeComponentWidth <= freeComponentWidthmin) freeComponentWidth = freeComponentWidthmin;
});
