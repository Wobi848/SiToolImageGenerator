"use strict";
// KeyEvent
let keyStrokeEvent;
// Keyboard Events
keyStrokeEvent = {
    generate: "g",
    save: "s",
    reset: "t",
    addButton: "a",
    removeButton: "y",
    fillAddresses: "v",
};
function handleRemoveButtonClick() {
    const removeButtons = Array.from(document.querySelectorAll(".remove-button"));
    if (removeButtons.length > 0) {
        removeButtons[removeButtons.length - 1].click();
    }
    else {
        console.log("No components to remove");
    }
}
// Update Tooltips
document.addEventListener("keydown", (event) => {
    if (event.altKey) {
        switch (event.key) {
            case keyStrokeEvent.addButton:
                addComponentButton.click();
                break;
            case keyStrokeEvent.removeButton:
                handleRemoveButtonClick();
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
const generateHotkeyInput = document.getElementById("generate-hotkey");
const saveHotkeyInput = document.getElementById("save-hotkey");
const resetHotkeyInput = document.getElementById("reset-hotkey");
const addButtonHotkeyInput = document.getElementById("add-button-hotkey");
const removeButtonHotkeyInput = document.getElementById("remove-button-hotkey");
const fillAddressesHotkeyInput = document.getElementById("fill-addresses-hotkey");
function updateTooltips() {
    document.getElementById("add-Component").title = `Neu Adressen-Eingabe erstellen. (Alt + ${keyStrokeEvent.addButton.toUpperCase()})`;
    document.getElementById("generate-and-display-xml").title = `XML Erstellen und Anzeigen. (Alt + ${keyStrokeEvent.generate.toUpperCase()})`;
    document.getElementById("save-xml").title = `XML Datei speichern. (Alt + ${keyStrokeEvent.save.toUpperCase()})`;
    document.getElementById("refresh-button").title = `Zurücksetzen der Seite. (Alt + ${keyStrokeEvent.reset.toUpperCase()})`;
    document.getElementById("fill-addresses").title = `Alle Adress-Eingaben werden mit Zahlen von 1 aufwärts ausgefüllt. (Alt + ${keyStrokeEvent.fillAddresses.toUpperCase()})`;
}
//# sourceMappingURL=keyboard-events.js.map