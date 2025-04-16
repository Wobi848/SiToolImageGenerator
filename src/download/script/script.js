"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Function to automatically scan the files directory and create file list
function loadFilesFromDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('/src/download/files-list.php');
            if (!response.ok) {
                throw new Error('Failed to fetch file list');
            }
            const fileNames = yield response.json();
            return fileNames.map((fileName) => {
                // Detect platform based on filename pattern
                const platform = fileName.includes('_cr') ? 'DDC400' : 'DDC4000';
                return {
                    fileName,
                    url: `/src/download/files/${fileName}`,
                    date: "07.08.2024",
                    creator: "RAT",
                    platform
                };
            });
        }
        catch (error) {
            console.error('Error loading files:', error);
            // Fallback to hardcoded files if dynamic loading fails
            return getHardcodedFiles();
        }
    });
}
// Fallback function with the existing hardcoded files
function getHardcodedFiles() {
    return [
        { fileName: "CAO.editor.xml", url: "src/download/files/CAO.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "CB_NC.editor.xml", url: "/src/download/files/CB_NC.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "CDO.editor.xml", url: "/src/download/files/CDO.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "F006.editor.xml", url: "/src/download/files/F006.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "F007.editor.xml", url: "/src/download/files/F007.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "F012.editor.xml", url: "/src/download/files/F012.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "F019.editor.xml", url: "/src/download/files/F019.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "FB_AV.editor.xml", url: "/src/download/files/FB_AV.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "FB_BI.editor.xml", url: "/src/download/files/FB_BI.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "FB_BV.editor.xml", url: "/src/download/files/FB_BV.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "FB_IR.editor.xml", url: "/src/download/files/FB_IR.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "FB_MO.editor.xml", url: "/src/download/files/FB_MO.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "FB_MV.editor.xml", url: "/src/download/files/FB_MV.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "FB_TR.editor.xml", url: "/src/download/files/FB_TR.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "H033.editor.xml", url: "/src/download/files/H033.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "L.editor.xml", url: "/src/download/files/L.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "L_cr.editor.xml", url: "/src/download/files/L_cr.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC400" },
        { fileName: "S_01.editor.xml", url: "/src/download/files/S_01.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "SY_AutoSave.editor.xml", url: "/src/download/files/SY_AutoSave.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "SY_Clock.editor.xml", url: "/src/download/files/SY_Clock.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "SY_Email.editor.xml", url: "/src/download/files/SY_Email.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "SY_ExtDev.editor.xml", url: "/src/download/files/SY_ExtDev.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "SY_Modul.editor.xml", url: "/src/download/files/SY_Modul.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "SY_Hosts.editor.xml", url: "/src/download/files/SY_Hosts.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "SY_MsgOut.editor.xml", url: "/src/download/files/SY_MsgOut.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
        { fileName: "T.editor.xml", url: "/src/download/files/T.editor.xml", date: "07.08.2024", creator: "RAT", platform: "DDC4000" },
    ];
}
// Store all files
let files = [];
// Track displayed files (filtered)
let displayedFiles = [];
// Filter state
let currentFilter = {
    platform: "ALL",
    search: ""
};
// Initialize the application
function initApp() {
    return __awaiter(this, void 0, void 0, function* () {
        // Load files from directory or fallback to hardcoded list
        files = yield loadFilesFromDirectory();
        // Setup filter controls
        setupFilterControls();
        // Initial display of all files
        displayedFiles = [...files];
        renderFileList();
        // Setup event listeners
        setupEventListeners();
    });
}
// Add filter controls to the page
function setupFilterControls() {
    const buttonContainer = document.querySelector('.button-container.filesp');
    if (!buttonContainer)
        return;
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    // Platform filter select
    const platformFilter = document.createElement('select');
    platformFilter.id = 'platform-filter';
    platformFilter.innerHTML = `
    <option value="ALL">All Platforms</option>
    <option value="DDC4000">DDC4000</option>
    <option value="DDC400">DDC400</option>
  `;
    // Search input field
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'file-search';
    searchInput.placeholder = 'Search files...';
    // Move the refresh button from the button container to the filter container
    const refreshButton = document.getElementById('refresh-button');
    // Create download all button
    const downloadAllButton = document.createElement('button');
    downloadAllButton.id = 'download-all-button';
    downloadAllButton.innerHTML = '<i class="fas fa-download"></i> Download Alle';
    downloadAllButton.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
        // Only download currently filtered/displayed files
        for (const file of displayedFiles) {
            yield downloadFile(file);
        }
    }));
    // Create a new refresh button
    const newRefreshButton = document.createElement('button');
    newRefreshButton.id = 'refresh-button';
    newRefreshButton.title = 'Refresh file list';
    newRefreshButton.innerHTML = '<i class="fas fa-sync-alt"></i>';
    newRefreshButton.addEventListener('click', function () {
        location.reload();
    });
    // Create a button group div for the action buttons
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.appendChild(newRefreshButton);
    buttonGroup.appendChild(downloadAllButton);
    // Add labels
    const platformLabel = document.createElement('label');
    platformLabel.htmlFor = 'platform-filter';
    platformLabel.textContent = 'Platform: ';
    const searchLabel = document.createElement('label');
    searchLabel.htmlFor = 'file-search';
    searchLabel.textContent = 'Search: ';
    // Build filter container
    filterContainer.appendChild(platformLabel);
    filterContainer.appendChild(platformFilter);
    filterContainer.appendChild(searchLabel);
    filterContainer.appendChild(searchInput);
    filterContainer.appendChild(buttonGroup);
    // Clear the button container and add the filter container
    buttonContainer.innerHTML = '';
    buttonContainer.appendChild(filterContainer);
    // Add counter for displayed files
    const counterElement = document.createElement('div');
    counterElement.id = 'file-counter';
    counterElement.className = 'file-counter';
    const container = document.querySelector('.container.filesp');
    if (container) {
        container.insertBefore(counterElement, container.firstChild);
    }
    // Setup filter event listeners
    platformFilter.addEventListener('change', (e) => {
        currentFilter.platform = e.target.value;
        applyFilters();
    });
    searchInput.addEventListener('input', (e) => {
        currentFilter.search = e.target.value;
        applyFilters();
    });
}
// Apply current filters and update display
function applyFilters() {
    displayedFiles = files.filter(file => {
        // Platform filter
        const platformMatch = currentFilter.platform === 'ALL' || file.platform === currentFilter.platform;
        // Search text filter
        const searchMatch = !currentFilter.search ||
            file.fileName.toLowerCase().includes(currentFilter.search.toLowerCase());
        return platformMatch && searchMatch;
    });
    renderFileList();
    updateCounter();
}
// Update the counter showing how many files are displayed
function updateCounter() {
    const counter = document.getElementById('file-counter');
    if (counter) {
        counter.textContent = `Showing ${displayedFiles.length} of ${files.length} files`;
    }
}
// Render the file list based on the current filtered files
function renderFileList() {
    const fileListElement = document.getElementById("file-list");
    if (!fileListElement)
        return;
    // Clear current list
    fileListElement.innerHTML = '';
    // Add each file to the list
    displayedFiles.forEach((file) => {
        const listItem = document.createElement("li");
        const fileNameElement = document.createElement("span");
        fileNameElement.textContent = file.fileName;
        fileNameElement.className = "file-name";
        const platformElement = document.createElement("span");
        platformElement.textContent = file.platform;
        platformElement.className = "file-platform";
        const dateElement = document.createElement("span");
        dateElement.textContent = file.date;
        dateElement.className = "file-date";
        const creatorElement = document.createElement("span");
        creatorElement.textContent = file.creator;
        creatorElement.className = "file-creator";
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.addEventListener("click", () => {
            const a = document.createElement("a");
            a.href = file.url;
            a.download = file.fileName;
            a.click();
        });
        listItem.appendChild(fileNameElement);
        listItem.appendChild(platformElement);
        listItem.appendChild(dateElement);
        listItem.appendChild(creatorElement);
        listItem.appendChild(downloadButton);
        fileListElement.appendChild(listItem);
    });
}
// Setup event listeners for buttons
function setupEventListeners() {
    const generatorButton = document.getElementById('generator-button');
    generatorButton === null || generatorButton === void 0 ? void 0 : generatorButton.addEventListener('click', () => {
        window.location.href = '/';
    });
    let refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function () {
            location.reload();
        });
    }
}
function downloadFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.fileName;
        a.click();
        yield new Promise((resolve) => setTimeout(resolve, 100));
    });
}
// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
//# sourceMappingURL=script.js.map