var canvas;
var context;
var RADIUS = 260;
var RADIUS_SCALE = 1;
var RADIUS_SCALE_MIN = 1;
var RADIUS_SCALE_MAX = 1;
var QUANTITY = 40;
var particles;
var mouseX = 40;
var mouseY = 50;
var timeout = 0;
var looping = 0;
var erasingTotal = 3000;
var erasingCounter = 0;
var stopped = true;
var overThumb = false;
var prevMouseX, prevMouseY;


$(window).scroll(function () {
    overThumb = false;
    scrollCanvas()
});

$(".projectThumbnail").mouseover(function () {
    overThumb = true;
    mouseX = $(this).offset().left + $(this).width() * 0.5;
    mouseY = $(this).offset().top - $(window).scrollTop() + $(this).height() * 0.5
});
$(".projectThumbnail").mouseout(function () {
    overThumb = false
});


function setUpCanvas() {
    canvas = document.getElementById("frills-canvas");
    if (canvas != undefined) {
        context = canvas.getContext("2d");
        setUpCanvasSize()
        window.addEventListener("resize", setUpCanvasSize, false);
        createParticles();
        document.addEventListener("mousemove", moveParticles, false)
    }
}

function setUpCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function moveParticles(n) {
    stopped = false;
    if (looping <= 0 && overThumb) {
        looping = setInterval(drawParticles, 40)
    }
    if (!overThumb) {
        stopped = true
    }
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        stopped = true
    }, 3000)
}

function createParticles() {
    particles = [];
    var n = 20;
    for (var o = 0; o < QUANTITY; o++) {
        var p = {
            position: {
                x: mouseX,
                y: mouseY
            },
            shift: {
                x: mouseX,
                y: mouseY
            },
            size: 0.2,
            angle: 0,
            speed: 0.01 + Math.random() * 1,
            targetSize: 0.2,
            fillColor: "rgba(" + n + ", " + n + ", " + n + ", 1.0)",
            orbit: RADIUS * 0.5
        };
        particles.push(p)
    }
}



function scrollCanvas() {
    stopped = true;
    var n = 0;
    clearInterval(looping);
    looping = 0;
    context.globalCompositeOperation = "destination-out";
    context.fillStyle = "rgba(239,239,239,1.0)";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    n++
}

function drawParticles() {
    RADIUS_SCALE = Math.min(RADIUS_SCALE, RADIUS_SCALE_MAX);
    context.globalCompositeOperation = "destination-out";
    context.fillStyle = "rgba(235,235,235,0.17)";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    if (stopped == true) {
        context.globalCompositeOperation = "lighter";
        context.fillStyle = "rgba(239,239,239,0.1)";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        erasingCounter += 40;
        if (erasingCounter >= erasingTotal) {
            clearInterval(looping);
            looping = 0;
            erasingCounter = 0
        }
        return
    }
    for (i = 0, len = particles.length; i < len; i++) {
        var o = particles[i];
        var n = {
            x: o.position.x,
            y: o.position.y
        };
        o.angle += o.speed;
        o.shift.x += (mouseX - o.shift.x) * (o.speed);
        o.shift.y += (mouseY - o.shift.y) * (o.speed);
        o.position.x = o.shift.x + Math.cos(i + o.angle) * (o.orbit * RADIUS_SCALE);
        o.position.y = o.shift.y + Math.sin(i + o.angle) * (o.orbit * RADIUS_SCALE);
        o.position.x = Math.max(Math.min(o.position.x, canvas.width), 0);
        o.position.y = Math.max(Math.min(o.position.y, canvas.height), 0);
        o.size += (o.targetSize - o.size) * 0.05;
        context.globalCompositeOperation = "source-over";
        context.beginPath();
        context.fillStyle = o.fillColor;
        context.strokeStyle = o.fillColor;
        context.lineWidth = o.size;
        context.moveTo((0.5 + n.x) | 0, (0.5 + n.y) | 0);
        context.lineTo((0.5 + o.position.x) | 0, (0.5 + o.position.y) | 0);
        context.stroke();
        context.arc((0.5 + o.position.x) | 0, (0.5 + o.position.y) | 0, o.size / 2, 0, Math.PI * 2, true);
        context.fill()
    }
}

setUpCanvas();
