"use strict";
let backgroundLayer = [];
let backgroundLayerY = 42;
let freeComponent = [];
let freeComponentCount = 1;
const freeComponentComp = 268;
const freeComponentVar = 153231;
const freeComponentY = 22;
const freeComponentAddress = "tOff";
const version = "0.5";
const versionElement = document.getElementById("version");
const ratInput = document.getElementById("rat-input");
const imageNameInput = document.getElementById("imagename-input");
const addComponentButton = document.getElementById("add-Component");
const generateAndDisplayXmlButton = document.getElementById("generate-and-display-xml");
const saveXmlButton = document.getElementById("save-xml");
const xmlOutput = document.getElementById("xml-output");
const lightThemeButton = document.getElementById("light-theme-button");
if (lightThemeButton) {
    lightThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
    });
}
let refreshButton = document.getElementById('refresh-button');
if (refreshButton) {
    refreshButton.addEventListener('click', function () {
        location.reload();
    });
}
if (versionElement)
    versionElement.innerText = `v${version}`;
console.log(`v${version} - Alle anregungen an t.rappo@kieback-peter.ch`);
addComponentButton.addEventListener("click", () => {
    var _a;
    const newComponentForm = document.createElement("div");
    newComponentForm.innerHTML = `
      <input type="text" id="address-${freeComponentCount}" placeholder="Adresse" />
      <button class="remove-button">Remove</button>
    `;
    (_a = document.querySelector("form")) === null || _a === void 0 ? void 0 : _a.appendChild(newComponentForm);
    freeComponentCount++;
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
        const addressInput = document.getElementById(`address-${i}`);
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
        const addressInput = document.getElementById(`address-${i}`);
        freeComponent.push({
            comp: freeCompCompValue,
            var: freeCompVarValue,
            y: freeCompYValue,
            address: addressInput.value,
        });
        freeCompCompValue += 2;
        freeCompVarValue += 2;
        freeCompYValue += 20;
    }
    const ratValue = ratInput.value;
    const imageNameValue = imageNameInput.value;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<EditorImageTemplate name="${ratValue}" objectType="${imageNameValue}" platform="DDC4000" version="1.7.1" langs="en,de" prescan="false">
    <Comment lang="en">Object Image</Comment>
    <Comment lang="de">Object Image</Comment>
    <FreePlantImageTemplate w="1000" h="${freeCompYValue - 0}">
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
                <Image src="#e8f3f6" y="20" w="300" h="${freeCompYValue - 15}" editType="RECTANGLE"/>
            ${backgroundLayer
        .map((backgroundLayer) => `
                <Image src="#faf9f8" y="${backgroundLayer.y}" w="300" h="20" editType="RECTANGLE"/>
                `)
        .join("")}
            </FreeComponent>
        ${freeComponent
        .map((freeComponent) => `
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
            </FreeComponent>
            `)
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
