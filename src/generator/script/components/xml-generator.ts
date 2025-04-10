const xmlOutput = document.getElementById("xml-output") as HTMLPreElement;

// XML Display Name
const fileNameElement = document.getElementById("fileName");
imageNameInput.addEventListener("input", () => {
  UpdateXMLFileNameText();
});

function UpdateXMLFileNameText() {
  if (imageNameInput.value != "") {
    const fileName = `${imageNameInput.value}${freeComponentFileName}.xml`;
    if (fileNameElement) fileNameElement.innerText = `${fileName}`;
  } else {
    if (fileNameElement) fileNameElement.innerText = "XML";
  }
}

// Define Platform Version FileName
const platformSelectElement = document.getElementById(
  "platform-select"
) as HTMLSelectElement;

if (platformSelectElement) {
  platformSelectElement.addEventListener("change", () => {
    if (platformSelectElement.value !== "") {
      if (debug) console.log("Platform: " + platformSelectElement.value);
      DefinePlatform(platformSelectElement.value);
    }
  });
} else {
  console.error("Element with ID 'platform-select' not found.");
}

function DefinePlatform(platform: string) {
  if (platform === "DDC") {
    freeComponentPlatformSelect = false;
    freeComponentPlatform = freeComponentPlatformDDC;
    freeComponentVersion = freeComponentVersionDDC;
    freeComponentFileName = freeComponentFileNameDDC;
  } else if (platform === "BMR") {
    freeComponentPlatformSelect = false;
    freeComponentPlatform = freeComponentPlatformBMR;
    freeComponentVersion = freeComponentVersionBMR;
    freeComponentFileName = freeComponentFileNameBMR;
  } else {
    freeComponentPlatformSelect = true;
    freeComponentPlatform = freeComponentPlatformDDC;
    freeComponentVersion = freeComponentVersionDDC;
    freeComponentFileName = freeComponentFileNameDDC;
  }
  UpdateXMLFileNameText();
}

// Ensure freeComponentWidth is initialized with the saved value before XML generation
function initializeFreeComponentWidth() {
  const storedBasicSettings = localStorage.getItem("basicSettings");
  if (storedBasicSettings) {
    const basicSettings = JSON.parse(storedBasicSettings);
    freeComponentWidth = basicSettings.width;
    if (freeComponentWidth <= freeComponentWidthmin) {
      freeComponentWidth = freeComponentWidthmin;
    }
  }
}

// Add event listener to the generate and display button
generateAndDisplayXmlButton.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent the form from submitting
  initializeFreeComponentWidth();
  CreateXmlFile(false);
});

// Ensure widthInput is not overwritten unnecessarily during XML generation
function CreateXmlFile(whatFile: boolean) {
  if (whatFile === true) {
    freeComponentPlatform = freeComponentPlatformBMR;
    freeComponentVersion = freeComponentVersionBMR;
    freeComponentFileName = freeComponentFileNameBMR;
  }

  // Initialize freeComponentWidth with the current value of widthInput
  freeComponentWidth = parseInt(widthInput.value, 10);
  if (freeComponentWidth <= freeComponentWidthmin) {
    freeComponentWidth = freeComponentWidthmin;
  }

  // Create the XML string
  // Create Background for readability
  backgroundLayer = [];
  let backgroundLayerCount = Math.floor(actualFreeComponentsCount / 2); // Testing
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

  // Check ComponentWidth
  let ComponentWidthRest = componentWidthRest(freeComponentWidth);
  freeComponentWidth -= ComponentWidthRest;
  widthInput.value = `${freeComponentWidth}`;
  if (debug) console.log("freeComponentWidth " + freeComponentWidth);

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
  let freeCompPlatform = freeComponentPlatform;
  let freeCompVer = freeComponentVersion;

  freeComponent = [];
  inputsIndex.forEach((index: any) => {
    const addressInput = document.getElementById(
      `address-${index}`
    ) as HTMLInputElement;
    freeComponent.push({
      platform: freeCompPlatform,
      version: freeCompVer,
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

  const ratValue = ratInput.value; // Updated from settings
  const imageNameValue = imageNameInput.value; // Updated from settings

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<EditorImageTemplate name="${ratValue}" objectType="${imageNameValue}" platform="${freeCompPlatform}" version="${freeCompVer}" langs="en,de" prescan="false">
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
}

function componentWidthRest(number: number, divider: number = 2) {
  let rest: number = number % divider;
  if (debug)
    console.log("Number " + number + " Divider " + divider + " Rest " + rest);
  return rest;
}
