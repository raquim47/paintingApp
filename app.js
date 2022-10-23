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

let isPainting = false;
let isBrush = false;
let isFill = false;

const onMove = (e) => {
  if (isBrush) {
    canvas.style.cursor = "url(cursors/brush.cur) 0 20, auto";
    if (isPainting) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      // return;
    }
  } else if (isFill) {
    canvas.style.cursor = "url(cursors/fill.cur) 0 20, auto";
  }
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
};

const startPainting = () => {
  isPainting = true;
};
const cancelPainting = () => {
  isPainting = false;
};

const onClickTool = (e) => {
  toolBtns.forEach((btn) => (btn.style.color = "#c2ced6"));
  e.target.style.color = "#94b3ec";
  const data = e.target.parentElement.dataset.text;
  isBrush = isFill = false;
  swatchPanel.style.display = "none";
  strokePanel.style.display = "none";
  if (data === "브러쉬") {
    isBrush = true;
    swatchPanel.style.display = "block";
    strokePanel.style.display = "block";
  } else if (data === "채우기") {
    isFill = true;
    swatchPanel.style.display = "block";
    strokePanel.style.display = "none";
  }
};

const onFill = () => {
  if (isFill) {
    ctx.fillRect(0, 0, 800, 800);
  }
};

const onClickSwatch = (e) => {
  const swatchValue = e.target.dataset.color;
  ctx.strokeStyle = ctx.fillStyle = colorInput.value = swatchValue;
};

const onClickColorInput = (e) => {
  ctx.strokeStyle = ctx.fillStyle = e.target.value;
};

const onChangeStrokeWidth = (e) => {
  strokeWidthNum.innerText = e.target.value;
  ctx.lineWidth = e.target.value;
};
toolBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => onClickTool(e));
});

canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("click", onFill);
colorInput.addEventListener("change", onClickColorInput);
swatches.forEach((swatch) => swatch.addEventListener("click", onClickSwatch));

strokeWidth.addEventListener("change", onChangeStrokeWidth);
