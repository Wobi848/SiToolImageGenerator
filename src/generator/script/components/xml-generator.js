"use strict";
const xmlOutput = document.getElementById("xml-output");
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
    inputsIndex.forEach((index) => {
        const addressInput = document.getElementById(`address-${index}`);
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
                <Image src="#e8f3f6" y="20" w="${freeCompWidthxRows}" h="${freeCompYValue - 15}" editType="RECTANGLE"/>
            ${backgroundLayer
        .map((backgroundLayer) => `
                <Image src="#faf9f8" y="${backgroundLayer.y}" w="${freeCompWidthxRows}" h="20" editType="RECTANGLE"/>
                `)
        .join("")}
            </FreeComponent>
        ${freeComponent
        .map((freeComponent) => `
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
//# sourceMappingURL=xml-generator.js.map