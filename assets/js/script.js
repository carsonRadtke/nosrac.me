document.getElementById("copy").innerHTML = "&copy " + (new Date()).getFullYear() + " Carson Radtke";

(() => {
    var CONST_1 = 0.05;
    var CONST_2 = 25;
    var CONST_3 = "Carson Radtke";

    var lastX = -CONST_2;
    var lastY = -CONST_2;

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#794044";
    ctx.font = (canvas.height >> 2) + "px sans-serif";
    ctx.fillText(CONST_3, canvas.width >> 1, canvas.height >> 1);

    var pos = [];
    var des = [];

    for (var x = 0; x < canvas.width; x++) {
        for (var y = 0; y < canvas.height; y++) {
            if (ctx.getImageData(x, y, 1, 1).data[0] != 0) des[des.length] = pos[pos.length] = [x, y];
        }
    }

    canvas.onmousemove = (e) => {
        lastX = e.offsetX;
        lastY = e.offsetY;
    }

    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#79044";
        for (var x = 0; x < pos.length; x++) {
            pos[x][0] += (des[x][0] - pos[x][0]) * CONST_1;
            pos[x][1] += (des[x][1] - pos[x][1]) * CONST_1;
            ctx.fillRect(pos[x][0], pos[x][1], 1, 1);
            var dx = lastX - pos[x][0];
            var dy = lastY - pos[x][1];
            if (Math.sqrt(dx * dx + dy * dy) < CONST_2 && Math.random() < CONST_1) pos[x] = [Math.random() * canvas.width, Math.random() * canvas.height];
        }
        ctx.fillRect(0, canvas.height * 3 / 4, canvas.width, 1);
    }, 1);

})();
