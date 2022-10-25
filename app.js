const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const toolBtns = Array.from(document.querySelectorAll("#tools button i"));
const strokePanel = document.querySelector("#stroke");
const strokeWidth = document.querySelector("#stroke-width");
const strokeWidthNum = document.querySelector("#stroke-width-num");

const swatchPanel = document.querySelector("#swatch");
const swatchInput = document.querySelector("#swatch-input");
const swatches = Array.from(document.querySelectorAll("#swatch td"));
const latestColorList = document.querySelector("#latest-color-list");

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

const resetBtn = document.querySelector("#reset-btn");
const saveBtn = document.querySelector("#save-btn");

const onSaveClick = () => {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = url;
  a.download = "myDrawing.png";
  a.click();
}
resetBtn.addEventListener('click', () => {
  const reset = confirm('기존 작업을 모두 지우고 다시 그리시겠습니까?');
  if (!reset) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
})

saveBtn.addEventListener('click', onSaveClick);
const ACTIVE_CLASSNAME = "active";

canvas.width = 600;
canvas.height = 600;
ctx.lineWidth = strokeWidth.value;
ctx.lineCap = "round";

let isPainting = false; // 그림시작
let isBrush = false; //
let isFill = false;
let isRectangle = false;
let isCircle = false;
let isEraser = false;
let isText = false;
let isImg = false;
let chosenColor = "#000000";
let latestColors = [];
let image;

let startX = 0;
let startY = 0;

const showLatestColor = () => {
  while (latestColorList.hasChildNodes()) {
    latestColorList.removeChild(latestColorList.firstChild);
  }
  latestColors.unshift(chosenColor);
  const set = new Set(latestColors);
  const pickedFive = [...set].slice(0, 5);
  pickedFive.forEach((color) => {
    const li = document.createElement('li');
    li.style.backgroundColor = color;
    latestColorList.append(li);
  })
};

// 캔버스에 마우스 눌렀을 때 startX, Y에 좌표 저장
const onMouseDown = (e) => {
  isPainting = true;
  if (isBrush || isRectangle || isCircle) {
    showLatestColor();
  }
  if (isRectangle || isCircle || isImg) {
    startX = e.offsetX;
    startY = e.offsetY;
  }
  ctx.beginPath();
};

// 캔버스에 마우스 움직일 때
const onMouseMove = (e) => {
  if (!isPainting) {
    return;
  }
  const currentX = e.offsetX;
  const currentY = e.offsetY;
  const width = currentX - startX;
  const height = currentY - startY;
  // 캔버스에 마우스 누르고 움직일 때
  if (isBrush) {
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
  } else if (isRectangle) {
    ctx.moveTo(currentX, currentY);
    ctx.fillRect(startX, startY, width, height);
  } else if (isCircle && width > 0) {
    ctx.arc(startX, startY, width, 0, Math.PI * 2, true);
    ctx.fill();
  } else if (isEraser) {
    ctx.lineTo(currentX, currentY);
    ctx.stroke();
  } else if (isImg && image) {
    ctx.moveTo(currentX, currentY);
    ctx.drawImage(image, startX, startY, width, height);
  }
  ctx.beginPath();
  ctx.moveTo(currentX, currentY);
};

// 캔버스 마우스 뗐을 때
const onMouseUp = () => {
  isPainting = false;
};

// 캔버스 마우스 클릭했을 때
const onMouseClick = (e) => {
  if (isFill) {
    ctx.fillRect(0, 0, 800, 800);
    showLatestColor();
  } else if (isText) {
    const text = textInput.value;
    const textWeight = fontWeights.value;
    const textSize = fontSizes.value;
    const textFont = fontTypes.value;
    showLatestColor();
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = `${textWeight} ${textSize}px ${textFont}`;
    ctx.fillText(text, e.offsetX, e.offsetY);
    ctx.restore();
  }
};

const onClickTool = (e) => {
  toolBtns.forEach((btn) => btn.classList.remove(ACTIVE_CLASSNAME));
  e.target.classList.add(ACTIVE_CLASSNAME);
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
    ctx.strokeStyle = chosenColor;
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
// 컬러
const onClickSwatch = (e) => {
  const swatchValue = (chosenColor = e.target.dataset.color);
  ctx.strokeStyle = ctx.fillStyle = swatchInput.value = swatchValue;
};

const onClickSwatchInput = (e) => {
  ctx.strokeStyle = ctx.fillStyle = e.target.value;
  chosenColor = e.target.value;
};
// 선굵기
const onChangeStrokeWidth = (e) => {
  strokeWidthNum.innerText = e.target.value;
  ctx.lineWidth = e.target.value;
};

// 이미지 입력
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
// 텍스트 입력
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
toolBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => onClickTool(e));
});
swatchInput.addEventListener("change", onClickSwatchInput);
swatches.forEach((swatch) => swatch.addEventListener("click", onClickSwatch));

strokeWidth.addEventListener("change", onChangeStrokeWidth);
imgInput.addEventListener("change", onFileChange);
textInput.addEventListener("input", onTextChange);