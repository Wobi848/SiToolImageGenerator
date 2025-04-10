"use strict";
var _a, _b;
// PopUp
(_a = document.querySelector(".close-popup")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closePopUp);
const settingsButton = document.getElementById("settings-button");
settingsButton.addEventListener("click", openPopUp);
function openPopUp() {
    const settingsPopup = document.getElementById("settings-popup");
    settingsPopup.style.display =
        getComputedStyle(settingsPopup).display === "none" ? "block" : "none";
    if (!settingsPopup)
        console.error("Settings popup element not found");
}
function closePopUp() {
    document.getElementById("settings-popup").style.display = "none";
}
// XML Handling Buttons
// Fill Inputs with Numbers
const fillAddressesButton = document.getElementById("fill-addresses");
fillAddressesButton.addEventListener("click", () => {
    const addressInputs = document.querySelectorAll('input[id^="address-"]');
    addressInputs.forEach((input, index) => {
        input.value = `${index + 1}`;
    });
});
// Save XML
const saveXmlButton = document.getElementById("save-xml");
saveXmlButton.disabled = true;
saveXmlButton.addEventListener("click", () => {
    SaveXmlFile();
});
// Modularized repetitive logic into reusable functions
function createBlobAndDownload(content, fileName) {
    const blob = new Blob([content], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
}
function SaveXmlFile() {
    createBlobAndDownload(xmlOutput.innerText, `${imageNameInput.value}${freeComponentFileName}.xml`);
    if (freeComponentPlatformSelect) {
        CreateXmlFile(true);
        createBlobAndDownload(xmlOutput.innerText, `${imageNameInput.value}${freeComponentFileName}.xml`);
        DefinePlatform(platformSelectElement.value);
    }
}
// Add Input
const addComponentButton = document.getElementById("add-Component");
addComponentButton.addEventListener("click", () => {
    var _a;
    const newComponentForm = document.createElement("div");
    newComponentForm.innerHTML = `
        <input type="text" id="address-${freeComponentCount}" placeholder="Adresse" />
        <button class="remove-button">Remove</button>
      `;
    (_a = document.querySelector("form")) === null || _a === void 0 ? void 0 : _a.appendChild(newComponentForm);
    inputsIndex.push(freeComponentCount);
    freeComponentCount++;
    setActualFreeComponentsCount();
    const removeButton = newComponentForm.querySelector(".remove-button");
    if (removeButton) {
        removeButton.addEventListener("click", () => {
            const addressInput = removeButton.previousElementSibling;
            const addressNumber = parseInt(addressInput.id.replace("address-", ""), 10);
            inputsIndex = inputsIndex.filter((value) => value !== addressNumber);
            // if (debug) console.log(inputsIndex); // show Input array
            newComponentForm.remove();
            setActualFreeComponentsCount();
        });
    }
});
// Refresh Page
(_b = document
    .getElementById("refresh-button")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", refreshPage);
function refreshPage() {
    location.reload();
}
// Routing
const downloadsButton = document.getElementById("downloads-button");
downloadsButton === null || downloadsButton === void 0 ? void 0 : downloadsButton.addEventListener("click", () => {
    window.location.href = "/downloads";
});
// Generate XML
const generateAndDisplayXmlButton = document.getElementById("generate-and-display-xml");
function setActualFreeComponentsCount() {
    actualFreeComponentsCount = inputsIndex.length;
    if (debug)
        console.log("actualFreeComponentsCount " + actualFreeComponentsCount);
}
//# sourceMappingURL=buttons.js.map