document.createElement("canvas");
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
context.fillStyle = `rgb(0,0,0)`;
context.fillRect(0, 0, canvas.width, canvas.height);
var cLeft = canvas.offsetLeft + canvas.clientLeft, cTop = canvas.offsetTop + canvas.clientTop;
var startTime = 0, currentTime = 0, seconds = 0;
var tMax = 530;
var iid;
var xpos = [0, 0, 0], xvel = [0, 0, 0], ypos = [0, 0, 0], yvel = [0, 0, 0];
var g = 60, dt = .03, m = [1, 1, 1];
var k = [30, 30, 30], eq = [100, 100, 100]
var floorY = 40;
var mu = .70;
var teq;
var canvasData = context.getImageData(0, 0, canvas.width, canvas.height);

canvas.addEventListener('click', function (event)
{
    var x = event.pageX - cLeft, y = event.pageY - cTop;
    var i;
    for (i = 0; i < 3; i++)
    {
        if (x < tMax && x > 20)
        {
            if (y < 556 + 112 * i && y > 454 + 112 * i)
            {
                drawRec();
                teq[i][x - 21] = (555 + 112 * i - y) * 5
                drawRec();
            }
        }
    }
    if (y <= 428 && y >= 422)
    {
            tMax = x;
            if (tMax < 20)
                tMax = 20;
            if (tMax > 1181)
                tMax=1181
            drawRec();
        
    }
}, false);
function setColor(cn)
{
    var col = [0, 0, 0];
    col[cn] = 255;
    context.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
    context.strokeStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
}
function drawcircle(x, y, r)
{
    if (y > 400)
        y = 395;
    context.beginPath();
    context.arc(x, 400 - y, r, 0, 2 * Math.PI, true);
    context.fill();
}
function drawPoint(x, y)
{
    var index = (x + y * canvas.width) * 4;
    canvasData.data[index + 0] = 12;
    canvasData.data[index + 1] = 76;
    canvasData.data[index + 2] = 90;
    canvasData.data[index + 3] = 255;
    context.putImageData(canvasData, 0, 0);
}
function drawRec()
{
    var i,j;
    context.fillStyle = `rgb(0,0,0)`;
    context.fillRect(0, 400, canvas.width, 400)
    for (i = 0; i < 3; i++)
    {
        for (j = 0; j < tMax - 21; j++)
        {
            if (teq[i][j] >= 0)
            {
                //               context.fillStyle = `rgb(12,76,90)`;
                drawPoint(j + 21, (555 + 112 * i) - (teq[i][j] / 5));
                //               context.beginPath();
                //               context.arc(j + 21, (555 + 112 * i) - (teq[i][j] / 5), 2, 0, 2 * Math.PI, true);
                //               context.fill();
            }
        }
    }
    for (i = 0; i < 3; i++)
    {
        setColor(i);
        context.beginPath();
        context.moveTo(20, 454 + 112 * i);
        context.lineTo(tMax, 454 + 112 * i);
        context.lineTo(tMax, 556 + 112 * i);
        context.lineTo(20, 556 + 112 * i);
        context.lineTo(20, 454 + 112 * i);
        context.stroke();
    }
    context.strokeStyle = `rgb(0,100,70)`;
    context.moveTo(20, 425);
    context.lineTo(1181, 425);
    context.stroke();
    context.fillStyle = `rgb(150,50,20)`;
    context.beginPath();
    context.arc(tMax, 425, 5, 0, 2 * Math.PI, true);
    context.fill();
}
function evolution()
{
    var fF = [0,0,0];
    var i, a, b, r, rx, ry, f;
    for (i = 0; i < 3; i++)
    {
        yvel[i] -= g * dt;
        if (ypos[i] < floorY) {
            fF[i] = (floorY - ypos[i]) * 100 / m[i];
            yvel[i] += fF[i] * dt;
        }
        else
        {
            fF[i] = 0;
        }
        if (i == 0)
        {
            a = 1;
            b = 2;
        }
        else
        {
            a = 0;
            b = 3 - i;
        }
        rx = xpos[b] - xpos[a];
        ry = ypos[b] - ypos[a];
        r = Math.sqrt(rx * rx + ry * ry);
        f = k[i] * (r - eq[i]);
        xvel[a] += f * rx / (m[a] * r) * dt;
        yvel[a] += f * ry / (m[a] * r) * dt;
        xvel[b] -= f * rx / (m[b] * r) * dt;
        yvel[b] -= f * ry / (m[b] * r) * dt;
    }
    for (i = 0; i < 3; i++)
    {
        if (fF[i] > 0)
        {
            if (xvel[i] > 0)
            {
                xvel[i] -= (mu * fF[i]) * dt / m[i];
                if (xvel[i] < 0)
                    xvel[i] = 0;
            }
            else
            {
                xvel[i] += (mu * fF[i]) * dt / m[i];
                if (xvel[i] > 0)
                    xvel[i] = 0;
            }
        }
    }
    for (i = 0; i < 3; i++)
    {
        xpos[i] += xvel[i] * dt;
        ypos[i] += yvel[i] * dt;
        xvel[i] *= 0.99;
        yvel[i] *= 0.99;
    }
    context.fillStyle = `rgb(0,0,0)`;
    context.fillRect(0, 0, canvas.width, 400);
    context.strokeStyle = `rgb(100,150,100)`;
    context.beginPath();
    context.moveTo( 0, 400-floorY);
    context.lineTo(1200, 400 - floorY);
    context.stroke();
    context.fillStyle = `rgb(100,0,100)`;
    for (i = 0; i < 3; i++)
    {
        drawcircle(xpos[i], ypos[i], 5);
    }
    for (i = 0; i < 3; i++)
    {
        if (i == 0) {
            a = 1;
            b = 2;
        }
        else {
            a = 0;
            b = 3 - i;
        }
        setColor(i);
        context.beginPath();
        context.moveTo(xpos[a], 400 - ypos[a]);
        context.lineTo(xpos[b], 400 - ypos[b]);
        context.stroke();
    }
    if (false)
        clearInterval(iid);
    currentTime = Math.floor(Date.now() / 1000);
    if (currentTime - startTime > seconds) {
        seconds = currentTime - startTime;
        document.getElementById("time").innerHTML = `Time: ${seconds}`;
    }
    if (xpos[1] > 1200 && xpos[2] > 1200 && xpos[0] > 1200)
    {
        document.getElementById("time").innerHTML = `Final Time Is ${seconds} seconds`;
        clearInterval(iid);
    }
}
function go()
{
    var i, j;
    teq = new Array(3);
    for (i = 0; i < 3; i++)
      teq[i] = new Array(1160);
    for (i = 0; i < 3; i++)
    {
        for (j = 0; j < 1160; j++)
        {
            teq[i][j] = -1;
        }
    }

    eq = [100, 100, 100];
    ypos = [floorY + 10, floorY + 10 + eq[0] * .866, floorY + 10];
    xpos = [60, 60 + eq[0] / 2, 60 + eq[0]];
    yvel = [0, 0, 0];
    xvel = [0, 0, 0];
    eq = [100, 100, 100];
    clearInterval(iid);
    iid = setInterval(evolution, 1);
    drawRec();
    currentTime = Math.floor(Date.now() / 1000);
    startTime = Math.floor(Date.now() / 1000);
    seconds = 0;
}