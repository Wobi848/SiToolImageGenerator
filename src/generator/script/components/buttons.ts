// PopUp
document.querySelector(".close-popup")?.addEventListener("click", closePopUp);

const settingsButton = document.getElementById("settings-button");
settingsButton!.addEventListener("click", openPopUp);

function openPopUp() {
  const settingsPopup = document.getElementById("settings-popup");
  settingsPopup!.style.display =
    getComputedStyle(settingsPopup!).display === "none" ? "block" : "none";
  if (!settingsPopup) console.error("Settings popup element not found");
}

function closePopUp() {
  document.getElementById("settings-popup")!.style.display = "none";
}

// XML Handling Buttons
// Fill Inputs with Numbers
const fillAddressesButton = document.getElementById(
  "fill-addresses"
) as HTMLButtonElement;

fillAddressesButton.addEventListener("click", () => {
  const addressInputs = document.querySelectorAll('input[id^="address-"]');
  addressInputs.forEach((input, index) => {
    (input as HTMLInputElement).value = `${index + 1}`;
  });
});

// Save XML
const saveXmlButton = document.getElementById("save-xml") as HTMLButtonElement;
saveXmlButton.disabled = true;

saveXmlButton.addEventListener("click", () => {
  // Create a blob and save it as an XML file
  const blob = new Blob([xmlOutput.innerText], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${imageNameInput.value}.editor.xml`;
  a.click();
});

// Add Input
const addComponentButton = document.getElementById(
  "add-Component"
) as HTMLButtonElement;

addComponentButton.addEventListener("click", () => {
  const newComponentForm = document.createElement("div");
  newComponentForm.innerHTML = `
        <input type="text" id="address-${freeComponentCount}" placeholder="Adresse" />
        <button class="remove-button">Remove</button>
      `;
  document.querySelector("form")?.appendChild(newComponentForm);
  inputsIndex.push(freeComponentCount);
  freeComponentCount++;

  setActualFreeComponentsCount();

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
      inputsIndex = inputsIndex.filter(
        (value: number) => value !== addressNumber
      );
      // if (debug) console.log(inputsIndex); // show Input array
      newComponentForm.remove();
      setActualFreeComponentsCount();
    });
  }

  
});

// Refresh Page
document
  .getElementById("refresh-button")
  ?.addEventListener("click", refreshPage);

function refreshPage() {
  location.reload();
}

// Routing
const downloadsButton = document.getElementById("downloads-button");
downloadsButton?.addEventListener("click", () => {
  window.location.href = "/downloads";
});

// Generate XML
const generateAndDisplayXmlButton = document.getElementById(
  "generate-and-display-xml"
) as HTMLButtonElement;


function setActualFreeComponentsCount() {
  actualFreeComponentsCount = inputsIndex.length;
  if (debug) console.log("actualFreeComponentsCount " + actualFreeComponentsCount)
}