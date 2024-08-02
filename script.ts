// Get the input fields and buttons
interface BackgroundLayer {
  y: number;
}

interface FreeComponent {
  comp: number;
  var: number;
  y: number;
  address: string;
}

let backgroundLayer: BackgroundLayer[] = [];
let backgroundLayerY = 42;

let freeComponent: FreeComponent[] = [];
let freeComponentCount = 1;

const freeComponentComp = 268; // add plus 2, we need leading zeros 00
const freeComponentVar = 153231; // add plus 2
const freeComponentY = 22; // add plus 20
const freeComponentAddress = "tOff"; // changable with input
const version = "0.3";

const versionElement = document.getElementById("version");
const ratInput = document.getElementById("rat-input") as HTMLInputElement;
const imageNameInput = document.getElementById(
  "imagename-input"
) as HTMLInputElement;

const addComponentButton = document.getElementById(
  "add-Component"
) as HTMLButtonElement;

const generateAndDisplayXmlButton = document.getElementById(
  "generate-and-display-xml"
) as HTMLButtonElement;
const saveXmlButton = document.getElementById("save-xml") as HTMLButtonElement;
const xmlOutput = document.getElementById("xml-output") as HTMLPreElement;

if (versionElement) versionElement.innerText = `v${version}`;
console.log(`v${version}`);

addComponentButton.addEventListener("click", () => {
  const newComponentForm = document.createElement("div");
  newComponentForm.innerHTML = `
      <input type="text" id="address-${freeComponentCount}" placeholder="address" />
      <button class="remove-button">Remove</button>
    `;
  document.querySelector("form")?.appendChild(newComponentForm);
  freeComponentCount++;

  // Add event listener to the remove button
  const removeButton = newComponentForm.querySelector(".remove-button");
  if (removeButton) {
    removeButton.addEventListener("click", () => {
      newComponentForm.remove();
      freeComponentCount--;
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

  // Create FreeCompontens
  let freeCompCompValue = freeComponentComp;
  let freeCompVarValue = freeComponentVar;
  let freeCompYValue = freeComponentY;

  freeComponent = [];
  for (let i = 0; i < freeComponentCount; i++) {
    const addressInput = document.getElementById(
      `address-${i}`
    ) as HTMLInputElement;
    freeComponent.push({
      comp: freeCompCompValue,
      var: freeCompVarValue,
      y: freeCompYValue,
      address: addressInput.value,
    });

    freeCompCompValue += 2; // add plus 2, we need leading zeros 00
    freeCompVarValue += 2; // add plus 2
    freeCompYValue += 20; // add plus 20
  }

  const ratValue = ratInput.value; // Get the value of the RAT input field
  const imageNameValue = imageNameInput.value;

  let xml = `
  <?xml version="1.0" encoding="UTF-8"?>
  <EditorImageTemplate name="${ratValue}" objectType="${imageNameValue}" platform="DDC4000" version="1.7.1" langs="en,de" prescan="false">
      <Comment lang="en">Object Image</Comment>
      <Comment lang="de">Object Image</Comment>
      <FreePlantImageTemplate w="418" h="${freeCompYValue - 18}">
          <Titles>
              <Title lang="de">Objektbild</Title>
              <Title lang="en">Object Image</Title>
          </Titles>
          <Text style="R12" txtColor="#22a8b0" x="204" y="1" w="100">
              <Title lang="de">Objekt: ${imageNameValue}</Title>
              <Title lang="en">Object: ${imageNameValue}</Title>
          </Text>
          <FreeAggregate name="Agg$00006" w="414">
              <Titles>
                  <Title lang="de">Struktur</Title>
                  <Title lang="en">Structure</Title>
              </Titles>
              <Image src="#e4e4e4" x="128" w="1" editType="RECTANGLE"/>
              <Image src="#e4e4e4" x="299" w="1" editType="RECTANGLE"/>
          </FreeAggregate>
          <FreeAggregate name="Agg$00008" w="300">
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
                  <Image src="#cecece" y="17" w="300" h="23" editType="RECTANGLE"/>
                  <Image src="#ff7400" w="20" h="20" editType="RECTANGLE"/>
                  <!-- Backlayer add if there more then 2 Free Components y+40 -->
                  <Image src="#e8f3f6" y="20" w="300" h="${
                    freeCompYValue - 18
                  }" editType="RECTANGLE"/>
              ${backgroundLayer
                .map(
                  (backgroundLayer) => `
                  <Image src="#faf9f8" y="${backgroundLayer.y}" w="300" h="20" editType="RECTANGLE"/>`
                )
                .join("")}
              </FreeComponent>
              <!-- FreeComponent Changable from here on -->
          ${freeComponent
            .map(
              (freeComponent) => `
              <FreeComponent name="Comp$00${freeComponent.comp}" x="0" y="${freeComponent.y}" w="300" h="20">
              <Titles>
                  <Title lang="de">parameter ${freeComponent.address}</Title>
                  <Title lang="en">parameter ${freeComponent.address}</Title>
              </Titles>
              <ValueDecl name="Var$${freeComponent.var}" previewValue="120" address="${freeComponent.address}">
                  <Title lang="de">${freeComponent.address}</Title>
                  <Title lang="en">${freeComponent.address}</Title>
              </ValueDecl>
              <DropArea type="dst" ref="Var$${freeComponent.var}" x="5" y="2" w="120" h="20"/>
              <TextValue style="NominalValue12" ref="Var$${freeComponent.var}" editable="true" x="5" y="2" w="120"/>
              <Label useTitles="false" style="R10" txtHorAlign="left" ref="Var$${freeComponent.var}" x="132" y="4" w="200" h="12"/>
              </FreeComponent>`
            )
            .join("")}
          </FreeAggregate>
      </FreePlantImageTemplate>
  </EditorImageTemplate>
    `;
  // Clean up

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
  a.download = `${imageNameInput.value}.xml`;
  a.click();
});

// Disable the save button initially
saveXmlButton.disabled = true;
