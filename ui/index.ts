import initWasm, * as wasm from "../animation/pkg/animation";

function initDate() {
  const cpright = `&copy; ${new Date().getFullYear()} Carson Radtke`;

  $("#copyright_placeholder").html(cpright);
}

function setupDOM(canvas: HTMLCanvasElement) {
  const $canvas = $(canvas);
  const $parent = $canvas.parent();

  canvas.width = $parent.width()!;
  canvas.height = $parent.height()!;
}

function setupCTX(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.font = `${Math.floor(canvas.height * 0.6)}px Staatliches`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
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
  ctx.fillText("Carson Radtke", canvas.width / 2, canvas.height / 2);
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
  initDate();
  initWasm().then(() => {
    initCanvas();
  });
});

$(window).on("resize", () => {
  location.reload();
});
