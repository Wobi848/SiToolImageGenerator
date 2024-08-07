interface CustomFile {
  fileName: string;
  url: string;
}

const files: CustomFile[] = [
  { fileName: "CAO.editor", url: "files/CAO.editor.xml" },
  { fileName: "CB_NC.editor", url: "files/CB_NC.editor.xml" },
  { fileName: "CDO.editor.xml", url: "files/CDO.editor.xml" },
  { fileName: "F006.editor", url: "files/F006.editor.xml" },
  { fileName: "F007.editor", url: "files/F007.editor.xml" },
  { fileName: "F012.editor", url: "files/F012.editor.xml" },
  { fileName: "F019.editor", url: "files/F019.editor.xml" },
  { fileName: "FB_AV.editor", url: "files/FB_AV.editor.xml" },
  { fileName: "FB_BI.editor", url: "files/FB_BI.editor.xml" },
  { fileName: "FB_BV.editor", url: "files/FB_BV.editor.xml" },
  { fileName: "FB_IR.editor", url: "files/FB_IR.editor.xml" },
  { fileName: "FB_MO.editor", url: "files/FB_MO.editor.xml" },
  { fileName: "FB_MV.editor", url: "files/FB_MV.editor.xml" },
  { fileName: "FB_TR.editor", url: "files/FB_TR.editor.xml" },
  { fileName: "H033.editor", url: "files/H033.editor.xml" },
  { fileName: "L.editor", url: "files/L.editor.xml" },
  { fileName: "S_01.editor", url: "files/S_01.editor.xml" },
  { fileName: "SY_AutoSave.editor", url: "files/SY_AutoSave.editor.xml" },
  { fileName: "SY_Clock.editor", url: "files/SY_Clock.editor.xml" },
  { fileName: "SY_Email.editor", url: "files/SY_Email.editor.xml" },
  { fileName: "SY_ExtDev.editor", url: "files/SY_ExtDev.editor.xml" },
  { fileName: "SY_Modul.editor", url: "files/SY_Modul.editor.xml" },
  { fileName: "SY_Hosts.editor", url: "files/SY_Hosts.editor.xml" },
  { fileName: "SY_MsgOut.editor", url: "files/SY_MsgOut.editor.xml" },
  { fileName: "T.editor", url: "files/T.editor.xml" },
];

const fileListElement = document.getElementById("file-list");
files.forEach((file) => {
  const listItem = document.createElement("li");
  const fileNameElement = document.createElement("span");
  fileNameElement.textContent = file.fileName;
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download";
  downloadButton.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = file.url;
    a.download = file.fileName;
    a.click();
  });
  listItem.appendChild(fileNameElement);
  listItem.appendChild(downloadButton);
  if (fileListElement) fileListElement.appendChild(listItem);
});

const downloadAllButton = document.getElementById("download-all-button");
if (downloadAllButton)
  downloadAllButton.addEventListener("click", async () => {
    for (const file of files) {
      await downloadFile(file);
    }
  });

async function downloadFile(file: CustomFile) {
  const a = document.createElement("a");
  a.href = file.url;
  a.download = file.fileName;
  a.click();
  await new Promise((resolve) => setTimeout(resolve, 100));
}