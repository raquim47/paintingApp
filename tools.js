const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;
ctx.lineWidth = 10;
ctx.lineCap = 'round';

const eventStore = {};
let startX = 0;
let startY = 0;
let isMouseDown = false;
let currentColor = '#000000';
let latestColors = [];
let currentImg;

const ACTIVE_CLASSNAME = 'active';
const HIDDEN_CLASSNAME = 'hidden';

const toolBtns = Array.from(document.querySelectorAll('#tools button'));
const strokeWidth = document.querySelector('#stroke-width');
const swatchInput = document.querySelector('#swatch-input');
const swatches = Array.from(document.querySelectorAll('#swatch td'));
const latestColorList = document.querySelector('#latest-color-list');
const imgInput = document.querySelector('#file');
const resetBtn = document.querySelector('#reset-btn');
const saveBtn = document.querySelector('#save-btn');

// 이미지 등록
const registerImg = (e) => {
  const img = document.querySelector('#img-ready img');
  const imgAlert = document.querySelector('#img-alert');
  const imgReady = document.querySelector('#img-ready');
  if (img) img.remove();
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);
  currentImg = new Image();
  currentImg.src = url;
  imgReady.appendChild(currentImg);
  imgAlert.style.display = 'block';
};
// 툴 기능 이벤트리스너 추가
const addEventsCanvas = (events, func) => {
  events.forEach((eventName) => {
    canvas.addEventListener(eventName, func);
    eventStore[eventName] = func;
  });
};
// 툴 기능 이벤트리스너 모두 제거
const removeEventsCanvas = () => {
  for (const eventName in eventStore) {
    canvas.removeEventListener(eventName, eventStore[eventName]);
    delete eventStore[eventName];
  }
};

// 선 굵기 조절
const onChangeStrokeWidth = (e) => {
  const strokeWidthNum = document.querySelector('#stroke-width-num');
  strokeWidthNum.innerText = e.target.value;
  ctx.lineWidth = e.target.value;
}
// 색상 선택 swatch / SwatchInput
const onClickSwatch = (e) => {
  const swatchValue = e.target.dataset.color;
  currentColor = swatchValue;
  ctx.strokeStyle = swatchValue;
  ctx.fillStyle = swatchValue;
  swatchInput.value = swatchValue;
}

const onClickSwatchInput = (e) => {
  const swatchInputValue = e.target.value;
  ctx.strokeStyle = swatchInputValue;
  ctx.fillStyle = swatchInputValue;
  currentColor = swatchInputValue;
}

// 최근 사용 컬러
const showLatestColor = () => {
  while (latestColorList.hasChildNodes()) {
    latestColorList.removeChild(latestColorList.firstChild);
  }
  latestColors.unshift(currentColor);
  const setLatestColors = new Set(latestColors);
  const slicedFive = [...setLatestColors].slice(0, 5);
  slicedFive.forEach(color => {
    const li = document.createElement('li');
    li.dataset.color = color;
    li.style.backgroundColor = color;
    li.addEventListener('click', onClickSwatch);
    latestColorList.append(li);
  })
}

// 브러쉬툴
const onBrushTool = (e) => {
  if (e.type === 'mousedown') {
    isMouseDown = true;
    ctx.beginPath();
    showLatestColor();
  }

  if (e.type === 'mousemove') {
    if (!isMouseDown) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }

  if (e.type === 'mouseup') {
    isMouseDown = false;
  }
};
// 채우기툴
const onFillTool = () => {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  showLatestColor();
};
// 사각형툴
const onSquareTool = (e) => {
  if (e.type === 'mousedown') {
    isMouseDown = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
    showLatestColor();
  }

  if (e.type === 'mousemove') {
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    if (!isMouseDown || width <= 0) return;
    ctx.moveTo(e.offsetX, e.offsetY);
    ctx.fillRect(startX, startY, width, height);
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }

  if (e.type === 'mouseup') {
    isMouseDown = false;
  }
};
// 원형툴
const onCircleTool = (e) => {
  if (e.type === 'mousedown') {
    isMouseDown = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
    showLatestColor();
  }

  if (e.type === 'mousemove') {
    const width = e.offsetX - startX;
    if (!isMouseDown || width <= 0) return;
    ctx.arc(startX, startY, width, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }

  if (e.type === 'mouseup') {
    isMouseDown = false;
  }
};
// 지우개툴
const onEraserTool = (e) => {
  ctx.strokeStyle = 'white';
  if (e.type === 'mousedown') {
    isMouseDown = true;
    ctx.beginPath();
  }

  if (e.type === 'mousemove') {
    if (!isMouseDown) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }

  if (e.type === 'mouseup') {
    isMouseDown = false;
  }
};
// 텍스트툴
const onTextTool = (e) => {
  const text = document.querySelector('#text-input').value;
  const textWeight = document.querySelector('#fontWeights').value;
  const textSize = document.querySelector('#fontSizes').value;
  const textFont = document.querySelector('#fontTypes').value;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.font = `${textWeight} ${textSize}px ${textFont}`;
  ctx.fillText(text, e.offsetX, e.offsetY);
  ctx.restore();
  showLatestColor();
};
// 이미지툴
const onImageTool = (e) => {
  if (!currentImg) return;

  if (e.type === 'mousedown') {
    isMouseDown = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
    console.log('hi');
  }

  if (e.type === 'mousemove') {
    if (!isMouseDown) return;
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
    ctx.drawImage(currentImg, startX, startY, width, height);
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  }

  if (e.type === 'mouseup') {
    isMouseDown = false;
  }
};

// 패널 열기
const openPanel = (id) => {
  const panels = Array.from(document.querySelectorAll('.panel'));
  const panelsOfToolObj = {
    brush: ['swatch', 'stroke'],
    fill: ['swatch'],
    square: ['swatch'],
    circle: ['swatch'],
    eraser: ['stroke'],
    text: ['swatch', 'typo'],
    image: ['image'],
  };

  panels.forEach((panel) => {
    if (panelsOfToolObj[id].includes(panel.dataset.panel)) {
      panel.classList.remove(HIDDEN_CLASSNAME);
    } else {
      panel.classList.add(HIDDEN_CLASSNAME);
    }
  });
};
// 툴 버튼 색
const coloredBtn = (btn) => {
  toolBtns.forEach((btn) => btn.classList.remove(ACTIVE_CLASSNAME));
  btn.classList.add(ACTIVE_CLASSNAME);
};
// 클릭 툴
const onClickTool = (e) => {
  const toolBtn = e.currentTarget;
  const toolId = toolBtn.dataset.tool;
  const toolCursor = toolBtn.dataset.cursor;
  const dragAction = ['mousedown', 'mousemove', 'mouseup'];
  const clickAction = ['click'];
  const toolData = {
    brush: { events: dragAction, func: onBrushTool },
    fill: { events: clickAction, func: onFillTool },
    square: { events: dragAction, func: onSquareTool },
    circle: { events: dragAction, func: onCircleTool },
    eraser: { events: dragAction, func: onEraserTool },
    text: { events: clickAction, func: onTextTool },
    image: { events: dragAction, func: onImageTool },
  };

  coloredBtn(toolBtn);
  openPanel(toolId);
  // 커서 변경
  canvas.style.cursor = `url(cursors/${toolCursor}.cur) 0 20, auto`;
  // 툴기능 이벤트리스너초기화 / 등록
  removeEventsCanvas();
  addEventsCanvas(toolData[toolId].events, toolData[toolId].func);
};

// 저장
const onSaveClick = () => {
  const url = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = url;
  a.download = 'myDrawing.png';
  a.click();
};

// 새로 그리기
const onResetClick = () => {
  const reset = confirm('기존 작업을 모두 지우고 다시 그리시겠습니까?');
  if (!reset) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

toolBtns.forEach((btn) => btn.addEventListener('click', (e) => onClickTool(e)));
imgInput.addEventListener('change', registerImg);
strokeWidth.addEventListener('change', onChangeStrokeWidth);
swatches.forEach((swatch) => swatch.addEventListener('click', onClickSwatch));
swatchInput.addEventListener('change', onClickSwatchInput);

saveBtn.addEventListener('click', onSaveClick);
resetBtn.addEventListener('click', onResetClick);