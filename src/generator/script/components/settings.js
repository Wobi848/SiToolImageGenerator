"use strict";
var _a;
let basicSettings;
basicSettings = {
    name: "Unks",
    width: 301,
};
const nameSettingInput = document.getElementById("name-setting");
const widthSettingInput = document.getElementById("width-setting");
(_a = document.getElementById("save-settings")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    keyStrokeEventSave();
    basicSettingsSave();
    closeSettingsPopup();
});
document.addEventListener("DOMContentLoaded", () => {
    const storedKeyStrokeEvent = localStorage.getItem("keyStrokeEvent");
    if (storedKeyStrokeEvent) {
        keyStrokeEvent = JSON.parse(storedKeyStrokeEvent);
    }
    if (debug)
        console.log(keyStrokeEvent);
    const storedBasicSettings = localStorage.getItem("basicSettings");
    if (storedBasicSettings) {
        basicSettings = JSON.parse(storedBasicSettings);
    }
    if (debug)
        console.log(basicSettings);
});
document.addEventListener("DOMContentLoaded", () => {
    const storedKeyStrokeEvent = localStorage.getItem("keyStrokeEvent");
    if (storedKeyStrokeEvent) {
        keyStrokeEvent = JSON.parse(storedKeyStrokeEvent);
        generateHotkeyInput.value = keyStrokeEvent.generate;
        saveHotkeyInput.value = keyStrokeEvent.save;
        resetHotkeyInput.value = keyStrokeEvent.reset;
        addButtonHotkeyInput.value = keyStrokeEvent.addButton;
        removeButtonHotkeyInput.value = keyStrokeEvent.removeButton;
        fillAddressesHotkeyInput.value = keyStrokeEvent.fillAddresses;
    }
    updateTooltips();
    const storedBasicSettings = localStorage.getItem("basicSettings");
    if (storedBasicSettings) {
        basicSettings = JSON.parse(storedBasicSettings);
        nameSettingInput.value = basicSettings.name;
        widthSettingInput.value = `${basicSettings.width}`;
    }
    updateBasicSettings();
});
// Removed automatic update of imageNameInput
function updateBasicSettings() {
    widthInput.value = widthSettingInput.value; // Always update widthInput
    ratInput.value = nameSettingInput.value; // Always update ratInput
    // Update global variables for XML generation
    freeComponentWidth = parseInt(widthSettingInput.value, 10);
    if (freeComponentWidth <= freeComponentWidthmin)
        freeComponentWidth = freeComponentWidthmin;
}
function basicSettingsSave() {
    if (nameSettingInput)
        basicSettings.name = nameSettingInput.value;
    if (widthSettingInput)
        basicSettings.width = parseInt(widthSettingInput.value, 10);
    localStorage.setItem("basicSettings", JSON.stringify(basicSettings));
    updateBasicSettings();
}
function keyStrokeEventSave() {
    // Update the keyStrokeEvent object with the new hotkey values
    if (generateHotkeyInput)
        keyStrokeEvent.generate = generateHotkeyInput.value;
    if (saveHotkeyInput)
        keyStrokeEvent.save = saveHotkeyInput.value;
    if (resetHotkeyInput)
        keyStrokeEvent.reset = resetHotkeyInput.value;
    if (addButtonHotkeyInput)
        keyStrokeEvent.addButton = addButtonHotkeyInput.value;
    if (removeButtonHotkeyInput)
        keyStrokeEvent.removeButton = removeButtonHotkeyInput.value;
    if (fillAddressesHotkeyInput)
        keyStrokeEvent.fillAddresses = fillAddressesHotkeyInput.value;
    localStorage.setItem("keyStrokeEvent", JSON.stringify(keyStrokeEvent));
    updateTooltips();
}
function closeSettingsPopup() {
    const settingsPopup = document.getElementById("settings-popup");
    if (settingsPopup) {
        settingsPopup.style.display = "none";
    }
}
//# sourceMappingURL=settings.js.map