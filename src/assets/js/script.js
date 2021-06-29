document.getElementById("copy").innerHTML = "&copy;" + (new Date()).getFullYear() + " Carson Radtke";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = canvas.parentElement.clientWidth >> 1;
canvas.height = canvas.width >> 2;

ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "#000000";
ctx.font = "bold " + (canvas.height / 3) + "px Times New Roman";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Carson Radtke", canvas.width >> 1, canvas.height >> 1);

let goal = [];
let curr = [];
let lastX = -100;
let lastY = -100;

let kP = 0.025;
let dist = 20;

var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

canvas.onmousemove = (e) => {
    lastX = e.offsetX;
    lastY = e.offsetY;
}

canvas.onmouseleave = (e) => { lastX = lastY = -100; }

function init() {
    for (let i = 0; i < data.length; i++) {

        let x = i % canvas.width;
        let y = Math.ceil(i / canvas.width);

        if (data[i << 2] == 0) {
            goal.push([x, y]);
            curr.push([Math.random() * canvas.width, Math.random() * canvas.height]);
        }
    }
    data = null;
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < curr.length; x++) {
        let dx = goal[x][0] - curr[x][0];
        let dy = goal[x][1] - curr[x][1];
        curr[x] = [curr[x][0] + dx * kP, curr[x][1] + dy * kP];
        dx = curr[x][0] - lastX;
        dy = curr[x][1] - lastY;
        if (Math.random() < 0.0001 || (Math.random() < 0.1 && dx * dx + dy * dy < dist * dist)) curr[x] = [Math.random() * canvas.width, Math.random() * canvas.height];
        ctx.fillRect(curr[x][0], curr[x][1], 1, 1);
    }
    window.requestAnimationFrame(loop);
}

window.onload = () => {
    window.requestAnimationFrame(init);
    window.requestAnimationFrame(loop);
}

window.onresize = () => {
    location.reload();
}