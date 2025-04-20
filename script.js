const userName = document.getElementById("name");
const userBranch = document.getElementById("branch");
const submitBtn = document.getElementById("submit");

const { PDFDocument, rgb, degrees } = PDFLib;

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

function selectNameAndBranch() {
  const name = document.getElementById('name').value;
  const branch = document.getElementById('branch').value;
  console.log('Selected Name:', name);
  console.log('Selected Branch:', branch);
  // ...further processing...
}

submitBtn.addEventListener("click", function () {
  selectNameAndBranch();
  const name = capitalize(userName.value);
  const branch = capitalize(userBranch.value);

  //check if the text is empty or not
  if (name.trim() !== "" && branch.trim() !== "" && userName.checkValidity() && userBranch.checkValidity()) {
    generatePDF(name, branch);
  } else {
    userName.reportValidity();
    userBranch.reportValidity();
  }
});

const generatePDF = async (name, branch) => {
  const existingPdfBytes = await fetch("./certificate-template.pdf").then((res) =>
    res.arrayBuffer()
  );

  // Load a PDFDocument from the existing PDF bytes
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  pdfDoc.registerFontkit(fontkit);

  //get font
  const fontBytes = await fetch("./Sanchez-Regular.ttf").then((res) =>
    res.arrayBuffer()
  );

  // Embed our custom font in the document
  const SanChezFont = await pdfDoc.embedFont(fontBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Draw a string of text for the name
  firstPage.drawText(name, {
    x: 478,
    y: 370,
    size: 20,
    font: SanChezFont,
    color: rgb(0, 0, 0), // Black color for certificate name
  });

  // Draw a string of text for the branch
  firstPage.drawText(branch, {
    x: 125,
    y: 345,
    size: 20,
    font: SanChezFont,
    color: rgb(0, 0, 0), // Black color for branch
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();
  console.log("Done creating");

  var file = new File(
    [pdfBytes],
    "Certificate.pdf",
    {
      type: "application/pdf;charset=utf-8",
    }
  );
  saveAs(file);
};
