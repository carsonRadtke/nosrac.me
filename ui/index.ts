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

function setupEvents(canvas: HTMLCanvasElement, lastMouse: { x: number, y: number }) {
  const rect = canvas.getBoundingClientRect();

  canvas.onmousemove = (ev) => {
    lastMouse.x = ev.clientX - rect.left;
    lastMouse.y = ev.clientY - rect.top;
  };

  canvas.onmouseleave = () => {
    lastMouse.x = lastMouse.y = -100;
  };
}

function setupPixels(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, pixels: { x: number, y: number, gx: number, gy: number }[]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillText("Carson Radtke", canvas.width / 2, canvas.height / 2);

  const filteredData = Array.from(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data,
  )
    .map((val, idx) => ({ val: val, idx: idx }))
    .filter((x) => x.val > 0);

  filteredData.forEach((d) => {
    pixels[pixels.length] = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      gx: Math.floor(d.idx / 4) % canvas.width,
      gy: Math.floor(Math.floor(d.idx / 4) / canvas.width),
    };
  });
}

function initCanvas() {
  const canvas = document.getElementById("my_canvas") as HTMLCanvasElement;
  const ctx = canvas.getContext("2d")!;

  const pixels: { x: number, y: number, gx: number, gy: number }[] = [];
  const lastMouse = { x: -100, y: -100 };

  setupDOM(canvas);
  setupCTX(canvas, ctx);
  setupEvents(canvas, lastMouse);

  setupPixels(canvas, ctx, pixels);

  const drawBackground = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const drawForeground = () => {
    pixels.forEach((pix) => {
      pix.x += (0.05 + Math.random() * 0.1) * (pix.gx - pix.x);
      pix.y += (0.05 + Math.random() * 0.1) * (pix.gy - pix.y);

      const dx = pix.x - lastMouse.x;
      const dy = pix.y - lastMouse.y;

      if (dx * dx + dy * dy < Math.pow(5 + Math.random() * 20, 2)) {
        pix.x = Math.random() * canvas.width;
        pix.y = Math.random() * canvas.height;
      }

      ctx.fillRect(pix.x, pix.y, 1, 1);
    });
  };

  window.requestAnimationFrame(function canvasLoop() {
    drawBackground();
    drawForeground();

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
