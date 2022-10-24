const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const toolBtns = Array.from(document.querySelectorAll("#tools button i"));

const strokePanel = document.querySelector("#stroke");
const strokeWidth = document.querySelector("#stroke-width");
const strokeWidthNum = document.querySelector("#stroke-width-num");

const swatchPanel = document.querySelector("#swatch");
const swatchInput = document.querySelector("#swatch-input");
const swatches = Array.from(document.querySelectorAll("#swatch td"));

const textPanel = document.querySelector("#text");
const fontSizes = document.querySelector("#fontSizes");
const fontTypes = document.querySelector("#fontTypes");
const fontWeights = document.querySelector("#fontWeights");
const textInput = document.querySelector("#text-input");
const textAlert = document.querySelector("#text-alert");

const imgPanel = document.querySelector("#img-upload");
const imgInput = document.querySelector("#file");
const imgReady = document.querySelector("#img-ready");
const imgAlert = document.querySelector("#img-alert");

const CANVAS_SIZE = 600;
canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;
ctx.lineWidth = strokeWidth.value;
ctx.lineCap = "round";

let isBrush = false;
let isPainting = false;
let isFill = false;
let isRectangle = false;
let isCircle = false;
let isEraser = false;
let isText = false;
let isImg = false;
let colorSaved = "black";
let image;

let rectX = 0;
let rectY = 0;

const onMouseMove = (e) => {
  if (!isPainting) {
    return;
  }
  if (isBrush) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (isRectangle) {
    const x = e.offsetX;
    const y = e.offsetY;
    const width = x - rectX;
    const height = y - rectY;
    ctx.moveTo(x, y);
    ctx.fillRect(rectX, rectY, width, height);
  } else if (isCircle) {
    const circleX = e.offsetX;
    const cwidth = circleX - rectX;
    if (cwidth > 0) {
      ctx.arc(rectX, rectY, cwidth, 0, Math.PI * 2, true);
      ctx.fill();
    }
  } else if (isEraser) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (isImg && image) {
    const x = e.offsetX;
    const y = e.offsetY;
    const width = x - rectX;
    const height = y - rectY;
    ctx.moveTo(x, y);
    ctx.drawImage(image, rectX, rectY, width, height);
  }
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

const onMouseDown = (e) => {
  isPainting = true;
  if (isRectangle || isCircle || isImg) {
    rectX = e.offsetX;
    rectY = e.offsetY;
  }
  ctx.beginPath();
};
const onMouseUp = () => {
  isPainting = false;
};
const onMouseClick = (e) => {
  if (isFill) {
    ctx.fillRect(0, 0, 800, 800);
  } else if (isText) {
    const text = textInput.value;
    const textWeight = fontWeights.value;
    const textSize = fontSizes.value;
    const textFont = fontTypes.value;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = `${textWeight} ${textSize}px ${textFont}`;
    ctx.fillText(text, e.offsetX, e.offsetY);
    ctx.restore();
  }
};

const onClickTool = (e) => {
  toolBtns.forEach((btn) => (btn.style.color = "#c2ced6"));
  e.target.style.color = "#94b3ec";
  const data = e.target.parentElement.dataset.text;
  isBrush = isFill = isRectangle = isCircle = isEraser = isText = isImg = false;
  image = "";
  swatchPanel.style.display = "none";
  strokePanel.style.display = "none";
  textPanel.style.display = "none";
  imgPanel.style.display = "none";
  textAlert.style.display = "none";
  if (data === "브러쉬") {
    isBrush = true;
    canvas.style.cursor = "url(cursors/brush.cur) 0 20, auto";
    swatchPanel.style.display = "block";
    strokePanel.style.display = "block";
    ctx.strokeStyle = colorSaved;
  } else if (data === "채우기") {
    isFill = true;
    canvas.style.cursor = "url(cursors/fill.cur) 0 20, auto";
    swatchPanel.style.display = "block";
  } else if (data === "사각형") {
    isRectangle = true;
    canvas.style.cursor = "url(cursors/precision.cur) 0 20, auto";
    swatchPanel.style.display = "block";
  } else if (data === "원") {
    isCircle = true;
    canvas.style.cursor = "url(cursors/precision.cur) 0 20, auto";
    swatchPanel.style.display = "block";
  } else if (data === "지우개") {
    isEraser = true;
    canvas.style.cursor = "url(cursors/eraser.cur) 0 20, auto";
    strokePanel.style.display = "block";
    ctx.strokeStyle = "white";
  } else if (data === "텍스트") {
    isText = true;
    canvas.style.cursor = "url(cursors/precision.cur) 0 20, auto";
    swatchPanel.style.display = "block";
    textPanel.style.display = "block";
    textInput.value = "";
  } else if (data === "이미지") {
    isImg = true;
    canvas.style.cursor = "url(cursors/precision.cur) 0 20, auto";
    imgPanel.style.display = "block";
    imgAlert.style.display = "none";
    if (imgReady.querySelector("img")) {
      imgReady.querySelector("img").remove();
    }
  }
};

const onClickSwatch = (e) => {
  const swatchValue = (colorSaved = e.target.dataset.color);
  ctx.strokeStyle = ctx.fillStyle = swatchInput.value = swatchValue;
};

const onClickSwatchInput = (e) => {
  ctx.strokeStyle = ctx.fillStyle = e.target.value;
  colorSaved = e.target.value;
};

const onChangeStrokeWidth = (e) => {
  strokeWidthNum.innerText = e.target.value;
  ctx.lineWidth = e.target.value;
};
toolBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => onClickTool(e));
});

const onFileChange = (e) => {
  const img = imgReady.querySelector("img");
  if (img) {
    img.remove();
  }
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  image = new Image();
  image.src = url;
  imgReady.appendChild(image);
  imgAlert.style.display = "block";
};
const onTextChange = (e) => {
  if (e.target.value) {
    textAlert.style.display = "block";
  } else {
    textAlert.style.display = "none";
  }
};
canvas.addEventListener("touchmove", onMouseMove);
canvas.addEventListener("touchstart", onMouseDown);
canvas.addEventListener("touchend", onMouseUp);

canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", onMouseUp);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("click", onMouseClick);
swatchInput.addEventListener("change", onClickSwatchInput);
swatches.forEach((swatch) => swatch.addEventListener("click", onClickSwatch));

strokeWidth.addEventListener("change", onChangeStrokeWidth);
imgInput.addEventListener("change", onFileChange);
textInput.addEventListener("input", onTextChange);
