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
    const storedKeyStrokeEvent = getStoredItem("keyStrokeEvent");
    if (storedKeyStrokeEvent) {
        keyStrokeEvent = storedKeyStrokeEvent;
    }
    if (debug)
        console.log(keyStrokeEvent);
    const storedBasicSettings = getStoredItem("basicSettings");
    if (storedBasicSettings) {
        basicSettings = storedBasicSettings;
    }
    if (debug)
        console.log(basicSettings);
});
document.addEventListener("DOMContentLoaded", () => {
    const storedKeyStrokeEvent = getStoredItem("keyStrokeEvent");
    if (storedKeyStrokeEvent) {
        keyStrokeEvent = storedKeyStrokeEvent;
        generateHotkeyInput.value = keyStrokeEvent.generate;
        saveHotkeyInput.value = keyStrokeEvent.save;
        resetHotkeyInput.value = keyStrokeEvent.reset;
        addButtonHotkeyInput.value = keyStrokeEvent.addButton;
        removeButtonHotkeyInput.value = keyStrokeEvent.removeButton;
        fillAddressesHotkeyInput.value = keyStrokeEvent.fillAddresses;
    }
    updateTooltips();
    const storedBasicSettings = getStoredItem("basicSettings");
    if (storedBasicSettings) {
        basicSettings = storedBasicSettings;
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
    setStoredItem("basicSettings", basicSettings);
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
    setStoredItem("keyStrokeEvent", keyStrokeEvent);
    updateTooltips();
}
function closeSettingsPopup() {
    const settingsPopup = document.getElementById("settings-popup");
    if (settingsPopup) {
        settingsPopup.style.display = "none";
    }
}
// Refactored localStorage operations into utility functions
function getStoredItem(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}
function setStoredItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
//# sourceMappingURL=settings.js.map