// import { KeyEvent, BackgroundLayer, FreeComponent } from './interfaces/interfaces';
interface KeyEvent {
  generate: string;
  save: string;
  reset: string;
  addButton: string;
  removeButton: string;
  fillAddresses: string;
}

interface BackgroundLayer {
  y: number;
}

interface FreeComponent {
  comp: number;
  var: number;
  x: number;
  y: number;
  width: number;
  address: string;
  widthElement: number;
  xLabel: number;
  widthLabel: number;
}
const version = "0.7.9";

let inputsIndex: any = [0];

let keyStrokeEvent: KeyEvent;
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

// PopUp

document.querySelector('.close-popup')?.addEventListener('click', function() {
  document.getElementById('settings-popup')!.style.display = 'none';
});

const settingsButton = document.getElementById("settings-button");
settingsButton!.addEventListener("click", () => {
  const settingsPopup = document.getElementById("settings-popup");
  settingsPopup!.style.display =
    getComputedStyle(settingsPopup!).display === "none" ? "block" : "none";
  if (!settingsPopup) console.error("Settings popup element not found");
});

const downloadsButton = document.getElementById("downloads-button");
downloadsButton?.addEventListener("click", () => {
  window.location.href = "/downloads";
});

const fillAddressesButton = document.getElementById(
  "fill-addresses"
) as HTMLButtonElement;
const versionElement = document.getElementById("version");
const widthInput = document.getElementById("width-input") as HTMLInputElement;
const ratInput = document.getElementById("rat-input") as HTMLInputElement;
const imageNameInput = document.getElementById(
  "imagename-input"
) as HTMLInputElement;

widthInput.addEventListener("input", () => {
  freeComponentWidth = parseInt(widthInput.value, 10);
  if (freeComponentWidth <= 300) freeComponentWidth = freeComponentWidthmin;
});

const addComponentButton = document.getElementById(
  "add-Component"
) as HTMLButtonElement;

fillAddressesButton.addEventListener("click", () => {
  const addressInputs = document.querySelectorAll('input[id^="address-"]');
  addressInputs.forEach((input, index) => {
    (input as HTMLInputElement).value = `${index + 1}`;
  });
});

const generateAndDisplayXmlButton = document.getElementById(
  "generate-and-display-xml"
) as HTMLButtonElement;
const saveXmlButton = document.getElementById("save-xml") as HTMLButtonElement;
const xmlOutput = document.getElementById("xml-output") as HTMLPreElement;

function refreshPage() {
  location.reload();
}

document
  .getElementById("refresh-button")
  ?.addEventListener("click", refreshPage);

if (versionElement) versionElement.innerText = `v${version}`;
console.log(`v${version} - Alle anregungen an t.rappo@kieback-peter.ch`);

addComponentButton.addEventListener("click", () => {
  const newComponentForm = document.createElement("div");
  newComponentForm.innerHTML = `
      <input type="text" id="address-${freeComponentCount}" placeholder="Adresse" />
      <button class="remove-button">Remove</button>
    `;
  document.querySelector("form")?.appendChild(newComponentForm);
  inputsIndex.push(freeComponentCount);
  freeComponentCount++;

  const removeButton = newComponentForm.querySelector(
    ".remove-button"
  ) as HTMLButtonElement;
  if (removeButton) {
    removeButton.addEventListener("click", () => {
      const addressInput =
        removeButton.previousElementSibling as HTMLInputElement;
      const addressNumber = parseInt(
        addressInput.id.replace("address-", ""),
        10
      );
      console.log(addressNumber);
      inputsIndex = inputsIndex.filter(
        (value: number) => value !== addressNumber
      );
      console.log(inputsIndex);
      newComponentForm.remove();
      // freeComponentCount--;
    });
  }
});

// Add event listener to the generate and display button
generateAndDisplayXmlButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the form from submitting
  // Create the XML string
  // Create Background for readability
  backgroundLayer = [];
  let backgroundLayerCount = Math.floor(freeComponentCount / 2);
  let backgrundLayerYValue = backgroundLayerY;

  for (let i = 0; i < backgroundLayerCount; i++) {
    const addressInput = document.getElementById(
      `address-${i}`
    ) as HTMLInputElement;
    backgroundLayer.push({
      y: backgrundLayerYValue,
    });

    backgrundLayerYValue += 40;
  }

  // ImageTemplate
  let imageTemplateWidth = freeComponentRows * freeComponentWidth + 200;
  let imageStructurTitle = freeComponentRows * freeComponentWidth - 100;
  let imageStructurRowLineX = freeComponentWidth / 2;
  let imageStructurRowSecondLineX = imageStructurRowLineX - 1;
  // Create FreeCompontens
  let freeCompCompValue = freeComponentComp;
  let freeCompVarValue = freeComponentVar;
  let freeCompYValue = freeComponentY;
  let freeCompWidthxRows = freeComponentRows * freeComponentWidth;
  let freeCompWidth = freeComponentWidth;
  let freeCompX = freeComponentX;

  freeComponent = [];
  inputsIndex.forEach((index: any) => {
    const addressInput = document.getElementById(
      `address-${index}`
    ) as HTMLInputElement;
    freeComponent.push({
      comp: freeCompCompValue,
      var: freeCompVarValue,
      x: freeCompX,
      y: freeCompYValue,
      width: freeCompWidth,
      address: addressInput.value,
      widthElement: freeCompWidth / 2 - 10,
      xLabel: freeCompWidth / 2 + 5,
      widthLabel: freeCompWidth / 2 - 10,
    });
    freeCompCompValue += 2;
    freeCompVarValue += 2;
    freeCompYValue += 20;
  });

  const ratValue = ratInput.value;
  const imageNameValue = imageNameInput.value;

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<EditorImageTemplate name="${ratValue}" objectType="${imageNameValue}" platform="DDC4000" version="1.7.1" langs="en,de" prescan="false">
    <!-- created with kp.rappo.dev ${version} -->
    <Comment lang="en">Object Image</Comment>
    <Comment lang="de">Object Image</Comment>
    <FreePlantImageTemplate w="${imageTemplateWidth}" h="${freeCompYValue - 0}">
        <Titles>
            <Title lang="de">Objektbild</Title>
            <Title lang="en">Object Image</Title>
        </Titles>
        <Text style="R12" txtColor="#22a8b0" x="${imageStructurTitle}" y="1" w="100">
            <Title lang="de">Objekt: ${imageNameValue}</Title>
            <Title lang="en">Object: ${imageNameValue}</Title>
        </Text>
        <FreeAggregate name="Agg$00006" w="414">
            <Titles>
                <Title lang="de">Struktur</Title>
                <Title lang="en">Structure</Title>
            </Titles>
            <Image src="#e4e4e4" x="${imageStructurRowLineX}" w="1" editType="RECTANGLE"/>
            <Image src="#e4e4e4" x="${imageStructurRowSecondLineX}" w="1" editType="RECTANGLE"/>
        </FreeAggregate>
        <FreeAggregate name="Agg$00008" w="${freeCompWidthxRows}">
            <Titles>
                <Title lang="de">Parameters</Title>
                <Title lang="en">Parameters</Title>
            </Titles>
            <Text style="R12" txtHorAlign="left" x="25" y="5" w="150">
                <Title lang="de">Parameter</Title>
                <Title lang="en">Para</Title>
            </Text>
            <FreeComponent name="Comp$00127">
                <Titles>
                    <Title lang="de">Ansicht</Title>
                    <Title lang="en">Design</Title>
                </Titles>
                <Image src="#cecece" y="17" w="${freeCompWidthxRows}${freeCompWidthxRows}" h="23" editType="RECTANGLE"/>
                <Image src="#ff7400" w="20" h="20" editType="RECTANGLE"/>
                <Image src="#e8f3f6" y="20" w="${freeCompWidthxRows}" h="${
    freeCompYValue - 15
  }" editType="RECTANGLE"/>
            ${backgroundLayer
              .map(
                (backgroundLayer) =>
                  `
                <Image src="#faf9f8" y="${backgroundLayer.y}" w="${freeCompWidthxRows}" h="20" editType="RECTANGLE"/>
                `
              )
              .join("")}
            </FreeComponent>
        ${freeComponent
          .map(
            (freeComponent) =>
              `
            <FreeComponent name="Comp$00${freeComponent.comp}" x="${freeComponent.x}" y="${freeComponent.y}" w="${freeComponent.width}" h="20">
                <Titles>
                    <Title lang="de">parameter ${freeComponent.address}</Title>
                    <Title lang="en">parameter ${freeComponent.address}</Title>
                </Titles>
                <ValueDecl name="Var$${freeComponent.var}" previewValue="69" address="${freeComponent.address}">
                    <Title lang="de">${freeComponent.address}</Title>
                    <Title lang="en">${freeComponent.address}</Title>
                </ValueDecl>
                <DropArea type="dst" ref="Var$${freeComponent.var}" x="5" y="2" w="${freeComponent.widthElement}" h="20"/>
                <TextValue style="NominalValue12" ref="Var$${freeComponent.var}" editable="true" x="5" y="2" w="${freeComponent.widthElement}"/>
                <Label useTitles="false" style="R10" txtHorAlign="left" ref="Var$${freeComponent.var}" x="${freeComponent.xLabel}" y="4" w="${freeComponent.widthLabel}" h="12"/>
            </FreeComponent>
            `
          )
          .join("")}
        </FreeAggregate>
    </FreePlantImageTemplate>
</EditorImageTemplate>`;
  // CleanUp XML
  xml = xml.replace(/^\s*\n/gm, "");
  // Display the XML output
  xmlOutput.innerText = xml;
  saveXmlButton.disabled = false;
});

// Add event listener to the save button
saveXmlButton.addEventListener("click", () => {
  // Create a blob and save it as an XML file
  const blob = new Blob([xmlOutput.innerText], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${imageNameInput.value}.editor.xml`;
  a.click();
});

// Disable the save button initially
saveXmlButton.disabled = true;

// Keyboard Events
keyStrokeEvent = {
  generate: "g",
  save: "s",
  reset: "t",
  addButton: "a",
  removeButton: "y",
  fillAddresses: "v",
};

// Update Tooltips
updateTooltips();

document.addEventListener("keydown", (event) => {
  if (event.altKey) {
    switch (event.key) {
      case keyStrokeEvent.addButton:
        addComponentButton.click();
        break;
      case keyStrokeEvent.removeButton:
        const removeButtons = document.querySelectorAll(
          ".remove-button"
        ) as unknown as HTMLButtonElement[];
        if (removeButtons.length > 0) {
          removeButtons[removeButtons.length - 1].click(); // only click if there is at least one button
        } else {
          console.log("No components to remove");
        }
        break;
      case keyStrokeEvent.generate:
        generateAndDisplayXmlButton.click();
        break;
      case keyStrokeEvent.save:
        saveXmlButton.click();
        break;
      case keyStrokeEvent.reset:
        refreshPage();
        break;
      case keyStrokeEvent.fillAddresses:
        fillAddressesButton.click();
        break;
    }
  }
});

// Hotkeys Settings

// Get the input fields from the settings popup
const generateHotkeyInput = document.getElementById(
  "generate-hotkey"
) as HTMLInputElement;
const saveHotkeyInput = document.getElementById(
  "save-hotkey"
) as HTMLInputElement;
const resetHotkeyInput = document.getElementById(
  "reset-hotkey"
) as HTMLInputElement;
const addButtonHotkeyInput = document.getElementById(
  "add-button-hotkey"
) as HTMLInputElement;
const removeButtonHotkeyInput = document.getElementById(
  "remove-button-hotkey"
) as HTMLInputElement;
const fillAddressesHotkeyInput = document.getElementById(
  "fill-addresses-hotkey"
) as HTMLInputElement;

// Add event listener to save settings button
document.getElementById("save-settings")?.addEventListener("click", () => {
  // Update the keyStrokeEvent object with the new hotkey values
  if (generateHotkeyInput) keyStrokeEvent.generate = generateHotkeyInput.value;
  if (saveHotkeyInput) keyStrokeEvent.save = saveHotkeyInput.value;
  if (resetHotkeyInput) keyStrokeEvent.reset = resetHotkeyInput.value;
  if (addButtonHotkeyInput)
    keyStrokeEvent.addButton = addButtonHotkeyInput.value;
  if (removeButtonHotkeyInput)
    keyStrokeEvent.removeButton = removeButtonHotkeyInput.value;
  if (fillAddressesHotkeyInput)
    keyStrokeEvent.fillAddresses = fillAddressesHotkeyInput.value;

  // Save the updated keyStrokeEvent object to local storage
  localStorage.setItem("keyStrokeEvent", JSON.stringify(keyStrokeEvent));

  // Update Tooltips
  updateTooltips();
  // Close the popup
  const settingsPopup = document.getElementById("settings-popup");
  if (settingsPopup) {
    settingsPopup.style.display = "none";
  }
});

// Load the saved keyStrokeEvent object from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
  const storedKeyStrokeEvent = localStorage.getItem("keyStrokeEvent");
  if (storedKeyStrokeEvent) {
    keyStrokeEvent = JSON.parse(storedKeyStrokeEvent);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const storedKeyStrokeEvent = localStorage.getItem("keyStrokeEvent");
  if (storedKeyStrokeEvent) {
    keyStrokeEvent = JSON.parse(storedKeyStrokeEvent);
    // Update the input fields with the saved values
    generateHotkeyInput.value = keyStrokeEvent.generate;
    saveHotkeyInput.value = keyStrokeEvent.save;
    resetHotkeyInput.value = keyStrokeEvent.reset;
    addButtonHotkeyInput.value = keyStrokeEvent.addButton;
    removeButtonHotkeyInput.value = keyStrokeEvent.removeButton;
    fillAddressesHotkeyInput.value = keyStrokeEvent.fillAddresses;
  }

  updateTooltips();
});

function updateTooltips() {
  document.getElementById("add-Component")!.title = `Neu Adressen-Eingabe erstellen. (Alt + ${keyStrokeEvent.addButton.toUpperCase()})`;
  document.getElementById("generate-and-display-xml")!.title = `XML Erstellen und Anzeigen. (Alt + ${keyStrokeEvent.generate.toUpperCase()})`;
  document.getElementById("save-xml")!.title = `XML Datei speichern. (Alt + ${keyStrokeEvent.save.toUpperCase()})`;
  document.getElementById("refresh-button")!.title = `Zurücksetzen der Seite. (Alt + ${keyStrokeEvent.reset.toUpperCase()})`;
  document.getElementById("fill-addresses")!.title = `Alle Adress-Eingaben werden mit Zahlen von 1 aufwärts ausgefüllt. (Alt + ${keyStrokeEvent.fillAddresses.toUpperCase()})`;
}