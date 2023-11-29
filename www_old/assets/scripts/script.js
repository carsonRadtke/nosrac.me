function init_date() {

    let copyright_text = `&copy; ${new Date().getFullYear()} Carson Radtke`;

    $("#copyright_placeholder").html(copyright_text);

}

function setup_dom(canvas) {

    let $canvas = $(canvas);
    let $parent = $canvas.parent();

    canvas.width = $parent.width();
    canvas.height = $parent.height();

}

function setup_ctx(canvas, ctx) {

    ctx.font = `${Math.floor(canvas.height * 0.6)}px Staatliches`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

}

function setup_events(canvas, lastMouse) {

    let rect = canvas.getBoundingClientRect();

    canvas.onmousemove = (ev) => {

        lastMouse.x = ev.clientX - rect.left;
        lastMouse.y = ev.clientY - rect.top;

    }

    canvas.onmouseleave = () => {

        lastMouse.x = lastMouse.y = -100;

    }

}

function setup_pixels(canvas, ctx, pixels) {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Carson Radtke", canvas.width / 2, canvas.height / 2);

    let filtered_data = Array.from(ctx.getImageData(0, 0, canvas.width, canvas.height).data)
        .map((val, idx) => ({ val: val, idx: idx }))
        .filter(x => x.val > 0);

    filtered_data.forEach(d => {
        pixels[pixels.length] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            gx: Math.floor(d.idx / 4) % canvas.width,
            gy: Math.floor(Math.floor(d.idx / 4) / canvas.width)
        };
    });

}

function init_canvas() {

    const canvas = document.getElementById("my_canvas");
    const ctx = canvas.getContext("2d");

    let pixels = [];
    let lastMouse = { x: -100, y: -100 };

    setup_dom(canvas);
    setup_ctx(canvas, ctx);
    setup_events(canvas, lastMouse);

    setup_pixels(canvas, ctx, pixels);

    const draw_background = () => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

    }

    const draw_foreground = () => {

        pixels.forEach(pix => {

            pix.x += (0.05 + Math.random() * 0.1) * (pix.gx - pix.x);
            pix.y += (0.05 + Math.random() * 0.1) * (pix.gy - pix.y);

            let dx = pix.x - lastMouse.x;
            let dy = pix.y - lastMouse.y;

            if (dx * dx + dy * dy < Math.pow(5 + Math.random() * 20, 2)) {
                pix.x = Math.random() * canvas.width;
                pix.y = Math.random() * canvas.height;
            }

            ctx.fillRect(pix.x, pix.y, 1, 1);

        });

    };

    window.requestAnimationFrame(function canvas_loop() {

        draw_background();
        draw_foreground();

        window.requestAnimationFrame(canvas_loop);

    });

}

$(document).ready(() => {

    init_date();
    init_canvas();

});

$(window).on('resize', () => {

    location.reload();

});