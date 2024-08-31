// KeyEvent
let keyStrokeEvent: KeyEvent;

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
          removeButtons[removeButtons.length - 1].click();
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

  localStorage.setItem("keyStrokeEvent", JSON.stringify(keyStrokeEvent));

  updateTooltips();

  const settingsPopup = document.getElementById("settings-popup");
  if (settingsPopup) {
    settingsPopup.style.display = "none";
  }
});

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
  document.getElementById(
    "add-Component"
  )!.title = `Neu Adressen-Eingabe erstellen. (Alt + ${keyStrokeEvent.addButton.toUpperCase()})`;
  document.getElementById(
    "generate-and-display-xml"
  )!.title = `XML Erstellen und Anzeigen. (Alt + ${keyStrokeEvent.generate.toUpperCase()})`;
  document.getElementById(
    "save-xml"
  )!.title = `XML Datei speichern. (Alt + ${keyStrokeEvent.save.toUpperCase()})`;
  document.getElementById(
    "refresh-button"
  )!.title = `Zurücksetzen der Seite. (Alt + ${keyStrokeEvent.reset.toUpperCase()})`;
  document.getElementById(
    "fill-addresses"
  )!.title = `Alle Adress-Eingaben werden mit Zahlen von 1 aufwärts ausgefüllt. (Alt + ${keyStrokeEvent.fillAddresses.toUpperCase()})`;
}
