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
const files = [
    { fileName: "CAO.editor", url: "files/CAO.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "CB_NC.editor", url: "files/CB_NC.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "CDO.editor.xml", url: "files/CDO.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "F006.editor", url: "files/F006.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "F007.editor", url: "files/F007.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "F012.editor", url: "files/F012.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "F019.editor", url: "files/F019.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "FB_AV.editor", url: "files/FB_AV.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "FB_BI.editor", url: "files/FB_BI.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "FB_BV.editor", url: "files/FB_BV.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "FB_IR.editor", url: "files/FB_IR.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "FB_MO.editor", url: "files/FB_MO.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "FB_MV.editor", url: "files/FB_MV.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "FB_TR.editor", url: "files/FB_TR.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "H033.editor", url: "files/H033.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "L.editor", url: "files/L.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "S_01.editor", url: "files/S_01.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "SY_AutoSave.editor", url: "files/SY_AutoSave.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "SY_Clock.editor", url: "files/SY_Clock.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "SY_Email.editor", url: "files/SY_Email.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "SY_ExtDev.editor", url: "files/SY_ExtDev.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "SY_Modul.editor", url: "files/SY_Modul.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "SY_Hosts.editor", url: "files/SY_Hosts.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "SY_MsgOut.editor", url: "files/SY_MsgOut.editor.xml", date: "07.08.2024", creator: "RAT" },
    { fileName: "T.editor", url: "files/T.editor.xml", date: "07.08.2024", creator: "RAT" },
];
const fileListElement = document.getElementById("file-list");
files.forEach((file) => {
    const listItem = document.createElement("li");
    const fileNameElement = document.createElement("span");
    fileNameElement.textContent = file.fileName;
    fileNameElement.className = "file-name"; // Add the file-name class
    const dateElement = document.createElement("span");
    dateElement.textContent = `${file.date}`;
    dateElement.className = "file-date"; // Add the file-date class
    const creatorElement = document.createElement("span");
    creatorElement.textContent = `${file.creator}`;
    creatorElement.className = "file-creator"; // Add the file-creator class
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.fileName;
        a.click();
    });
    listItem.appendChild(fileNameElement);
    listItem.appendChild(dateElement);
    listItem.appendChild(creatorElement);
    listItem.appendChild(downloadButton);
    if (fileListElement)
        fileListElement.appendChild(listItem);
});
let refreshButton = document.getElementById('refresh-button');
if (refreshButton) {
    refreshButton.addEventListener('click', function () {
        location.reload();
    });
}
const downloadAllButton = document.getElementById("download-all-button");
if (downloadAllButton)
    downloadAllButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
        for (const file of files) {
            yield downloadFile(file);
        }
    }));
function downloadFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.fileName;
        a.click();
        yield new Promise((resolve) => setTimeout(resolve, 100));
    });
}
