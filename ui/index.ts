import initWasm, * as wasm from "../animation/pkg/animation";

const CANVAS_TEXT = "carson radtke";

function setupDOM(canvas: HTMLCanvasElement) {
  const $canvas = $(canvas);
  const $parent = $canvas.parent();

  canvas.width = $parent.width()!;
  canvas.height = $parent.height()!;
}

function computeFont(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  size: number,
) {
  ctx.font = `${size}px 'Courier New', monospace`;
  while (ctx.measureText(CANVAS_TEXT).width > width) {
    size = Math.floor(size * 0.99);
    ctx.font = `${size}px 'Courier New', monospace`;
  }
  while (
    ctx.measureText(CANVAS_TEXT).fontBoundingBoxAscent +
      ctx.measureText(CANVAS_TEXT).fontBoundingBoxDescent >
    height
  ) {
    size = Math.floor(size * 0.99);
    ctx.font = `${size}px 'Courier New', monospace`;
  }
}

function setupCTX(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  computeFont(
    ctx,
    canvas.width,
    canvas.height,
    Math.max(canvas.width, canvas.height),
  );
  console.log(ctx.measureText(CANVAS_TEXT));
}

function setupEvents(
  canvas: HTMLCanvasElement,
  lastMouse: { x: number; y: number },
) {
  const rect = canvas.getBoundingClientRect();

  canvas.onmousemove = (ev) => {
    lastMouse.x = ev.clientX - rect.left;
    lastMouse.y = ev.clientY - rect.top;
  };

  canvas.onmouseleave = () => {
    lastMouse.x = lastMouse.y = -100;
  };
}

function setupParticles(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  system: wasm.System,
) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText(CANVAS_TEXT, canvas.width / 2, canvas.height / 2);
  const filteredData = Array.from(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data,
  )
    .map((val, idx) => ({ val: val, idx: idx }))
    .filter((x) => x.val > 0);

  filteredData.forEach((d) => {
    system.add_particle(
      Math.floor(d.idx / 4) % canvas.width,
      Math.floor(Math.floor(d.idx / 4) / canvas.width),
    );
  });
}

function initCanvas() {
  const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;
  const lastMouse = { x: -100, y: -100 };

  setupDOM(canvas);
  setupCTX(canvas, ctx);
  setupEvents(canvas, lastMouse);

  const system = wasm.System.new(canvas.width, canvas.height);
  setupParticles(canvas, ctx, system);

  window.requestAnimationFrame(function canvasLoop() {
    system.tick(lastMouse.x, lastMouse.y, ctx);

    window.requestAnimationFrame(canvasLoop);
  });
}

$((): void => {
  initWasm().then(() => {
    initCanvas();
  });
});

$(window).on("resize", () => {
  location.reload();
});
