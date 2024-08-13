function handleVerticalChange(radioElement) {
  const resizerContainer = document.querySelector(".resizer-demo-container");
  const verticalAlignment = radioElement.value;

  switch (verticalAlignment) {
    case "top":
      resizerContainer.style.alignItems = "flex-start";
      break;

    case "middle":
      resizerContainer.style.alignItems = "center";
      break;

    case "bottom":
      resizerContainer.style.alignItems = "flex-end";
      break;

    default:
      break;
  }
}

function handleHorizontalChange(radioElement) {
  const resizerContainer = document.querySelector(".resizer-demo-container");
  const horizontalAlignment = radioElement.value;

  switch (horizontalAlignment) {
    case "left":
      resizerContainer.style.justifyContent = "flex-start";
      break;

    case "center":
      resizerContainer.style.justifyContent = "center";
      break;

    case "right":
      resizerContainer.style.justifyContent = "flex-end";
      break;

    default:
      break;
  }
}

const resizeBox = document.querySelector("resizer-box");
const widthInput = document.querySelector("#width");
const heightInput = document.querySelector("#height");

resizeBox.addEventListener("resize", (e) => {
  const { width, height } = e.detail;

  widthInput.value = width;
  heightInput.value = height;
});

widthInput.addEventListener("input", (e) => {
  const newWidth = e.target.value;
  resizeBox.setAttribute("width", `${newWidth}px`);
});

heightInput.addEventListener("input", (e) => {
  const newHeight = e.target.value;
  resizeBox.setAttribute("height", `${newHeight}px`);
});

function handleResizeOptChange(checkboxElement) {
  const attributeVal = checkboxElement.checked;
  const attributeName = checkboxElement.name;

  resizeBox.setAttribute(attributeName, attributeVal);
}

const maxWidthInput = document.querySelector("#max-width");
const minWidthInput = document.querySelector("#min-width");
const maxHeightInput = document.querySelector("#max-height");
const minHeightInput = document.querySelector("#min-height");

maxWidthInput.addEventListener("input", (e) => {
  const newWidth = e.target.value;
  resizeBox.setAttribute("max-width", `${newWidth}px`);
});

minWidthInput.addEventListener("input", (e) => {
  const newWidth = e.target.value;
  resizeBox.setAttribute("min-width", `${newWidth}px`);
});

maxHeightInput.addEventListener("input", (e) => {
  const newHeight = e.target.value;
  resizeBox.setAttribute("max-height", `${newHeight}px`);
});

minHeightInput.addEventListener("input", (e) => {
  const newHeight = e.target.value;
  resizeBox.setAttribute("min-height", `${newHeight}px`);
});
