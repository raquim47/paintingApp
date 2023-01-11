const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;
ctx.lineWidth = 10;
ctx.lineCap = 'round';
let startX = 0;
let startY = 0;

const eventStore = {};

const addEventsCanvas = (events, func) => {
  events.forEach((eventName) => {
    canvas.addEventListener(eventName, func);
    eventStore[eventName] = func;
  });
};

const removeEventsCanvas = () => {
  for (const eventName in eventStore) {
    canvas.removeEventListener(eventName, eventStore[eventName]);
    delete eventStore[eventName];
  }
};

// setCanvas();
// ctx.lineWidth = strokeWidth.value;

const ACTIVE_CLASSNAME = 'active';
const HIDDEN_CLASSNAME = 'hidden';

const toolBtns = Array.from(document.querySelectorAll('#tools button'));

let isMouseDown = false;
// 브러쉬툴
const onBrushTool = (e) => {
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
// 채우기툴
const onFillTool = () => {
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
// 사각형툴
const onSquareTool = (e) => {
  if (e.type === 'mousedown') {
    isMouseDown = true;
    startX = e.offsetX;
    startY = e.offsetY;
    ctx.beginPath();
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
  }

  if (e.type === 'mousemove') {
    const width = e.offsetX - startX;
    const height = e.offsetY - startY;
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

const coloredBtn = (btn) => {
  toolBtns.forEach((btn) => btn.classList.remove(ACTIVE_CLASSNAME));
  btn.classList.add(ACTIVE_CLASSNAME);
};

const onClickTool = (e) => {
  const toolBtn = e.currentTarget;
  const toolId = toolBtn.dataset.tool;
  const toolCursor = toolBtn.dataset.cursor;
  const toolData = {
    brush: { events: ['mousedown', 'mousemove', 'mouseup'], func: onBrushTool },
    fill: { events: ['click'], func: onFillTool },
    square: {
      events: ['mousedown', 'mousemove', 'mouseup'],
      func: onSquareTool,
    },
    circle: {
      events: ['mousedown', 'mousemove', 'mouseup'],
      func: onCircleTool,
    },
    eraser: {
      events: ['mousedown', 'mousemove', 'mouseup'],
      func: onEraserTool,
    },
    // eraser: {panels: ['stroke'], func: onEraserTool},
    // text: {panels: ['swatch', 'typo'], func: onTextTool},
    // image: {panels: ['image'], func: onImageTool},
  };

  coloredBtn(toolBtn);
  openPanel(toolId);
  canvas.style.cursor = `url(cursors/${toolCursor}.cur) 0 20, auto`;
  // currentTool = toolId;

  // 이벤트리스너초기화
  removeEventsCanvas();
  // 이벤트리스너등록
  addEventsCanvas(toolData[toolId].events, toolData[toolId].func);
};

// const onFillTool = () => {

// }

// registerEvent(onFillTool, ['mousedown', 'mousemove', 'mouseup']);
// // 캔버스에 마우스 눌렀을 때
// const onMouseDown = (e) => {
//   isPainting = true;
//   if (
//     currentTool === 'brush' ||
//     currentTool === 'square' ||
//     currentTool === 'circle'
//   ) {
//     // showLatestColor();
//   }

//   if (
//     currentTool === 'square' ||
//     currentTool === 'circle' ||
//     currentTool === 'image'
//   ) {
//     startX = e.offsetX;
//     startY = e.offsetY;
//   }
//   ctx.beginPath();
// };

// const onMouseMove = (e) => {
//   if (!isPainting) {
//     return;
//   }
//   const currentX = e.offsetX;
//   const currentY = e.offsetY;
//   const width = currentX - startX;
//   const height = currentY - startY;

//   if (currentTool === 'brush') {
//     ctx.lineTo(currentX, currentY);
//     ctx.stroke();
//   } else if (currentTool === 'square') {
//     ctx.moveTo(currentX, currentY);
//     ctx.fillRect(startX, startY, width, height);
//   } else if (currentTool === 'circle' && width > 0) {
//     ctx.arc(startX, startY, width, 0, Math.PI * 2, true);
//     ctx.fill();
//   } else if (currentTool === 'eraser') {
//     ctx.lineTo(currentX, currentY);
//     ctx.stroke();
//   } else if (currentTool === 'image') {
//   }
//   ctx.beginPath();
//   ctx.moveTo(currentX, currentY);
// };

// const onMouseUp = () => {
//   isPainting = false;
// };

toolBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => onClickTool(e));
});

// canvas.addEventListener('mousedown', onMouseDown);
// canvas.addEventListener('mousemove', onMouseMove);
// canvas.addEventListener('mouseup', onMouseUp);
// canvas.addEventListener('mouseleave', onMouseUp);
// canvas.addEventListener('click', onMouseClick);
