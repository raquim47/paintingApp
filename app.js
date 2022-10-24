const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const brush = document.querySelector("#brush");
const strokeWidth = document.querySelector("#stroke-width");
const strokeWidthNum = document.querySelector("#stroke-width-num");
const toolBtns = Array.from(document.querySelectorAll(".tools button i"));
const colorInput = document.querySelector(".color-input");
const swatches = Array.from(document.querySelectorAll("#swatches td"));
const swatchPanel = document.querySelector("#swatches");
const strokePanel = document.querySelector("#stroke");
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
let colorSaved = 'black';

let rectX = 0;
let rectY = 0;

const onMouseMove = (e) => {
  if (!isPainting) {
    return
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
      console.log(rectX, rectY, circleX, cwidth)
      ctx.arc(rectX, rectY, cwidth, 0, Math.PI * 2, true);
      ctx.fill();
    }
  } else if (isEraser){
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

const onMouseDown = (e) => {
  isPainting = true;
  if (isRectangle || isCircle) {
    rectX = e.offsetX;
    rectY = e.offsetY;
  }
  ctx.beginPath();
};
const onMouseUp = () => {
  isPainting = false;
};
const onMouseClick = () => {
  if (isFill) {
    ctx.fillRect(0, 0, 800, 800);
  }
};

const onClickTool = (e) => {
  toolBtns.forEach((btn) => (btn.style.color = "#c2ced6"));
  e.target.style.color = "#94b3ec";
  const data = e.target.parentElement.dataset.text;
  isBrush = isFill = isRectangle = false;
  swatchPanel.style.display = "none";
  strokePanel.style.display = "none";
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
    ctx.strokeStyle = 'white';
  }
};



const onClickSwatch = (e) => {
  const swatchValue = colorSaved = e.target.dataset.color;
  ctx.strokeStyle = ctx.fillStyle = colorInput.value = swatchValue;
};

const onClickColorInput = (e) => {
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

canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);
canvas.addEventListener("mouseleave", onMouseUp);
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("click", onMouseClick);
colorInput.addEventListener("change", onClickColorInput);
swatches.forEach((swatch) => swatch.addEventListener("click", onClickSwatch));

strokeWidth.addEventListener("change", onChangeStrokeWidth);