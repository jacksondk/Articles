﻿// references 'hmtl5.js'
var gfx;
function initialize(id) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    var points = [];


    $(canvas).click(function (e) {
        var x = Math.floor((e.pageX - $(canvas).offset().left));
        var y = Math.floor((e.pageY - $(canvas).offset().top));

        points.push({ x: x, y: y });


        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgb(0,0,0)";
        var i = 0;
        var sumx = 0;
        var sumy = 0;
        for (i = 0; i < points.length; i++) {
            sumx += points[i].x;
            sumy += points[i].y;
            ctx.fillRect(points[i].x, points[i].y, 2, 2);
        }
        var avgx = sumx / points.length;
        var avgy = sumy / points.length;

        var xx = 0;
        var yy = 0;
        var xy = 0;
        for (i = 0; i < points.length; i++) {
            var dx = (points[i].x - avgx);
            var dy = (points[i].y - avgy);
            xx += dx * dx;
            yy += dy * dy;
            xy += dy * dx;
        }
        xx /= points.length;
        yy /= points.length;
        xy /= points.length;
        ctx.fillStyle = "rgb(255,0,0)";
        ctx.fillRect(avgx, avgy, 2, 2);

        $("#xx").html(xx);
        $("#yy").html(yy);
        $("#xy").html(xy);
        $("#yx").html(xy);
        $("#avgx").html(avgx);
        $("#avgy").html(avgy);

        ctx.beginPath();

        var trace = xx + yy;
        var determinant = xx * yy - xy * xy;
        var s = Math.sqrt(determinant);
        var t = Math.sqrt(trace + 2 * s);
        var srxx = (xx + s) / t;
        var sryy = (yy + s) / t;
        var srxy = xy / t;

        for (i = 0; i < 24; i++) {
            var cx = Math.cos(i * (2 * Math.PI) / 24);
            var cy = Math.sin(i * (2 * Math.PI) / 24);

            var ex = srxx * cx + srxy * cy;
            var ey = srxy * cx + sryy * cy;

            ctx.lineTo(ex + avgx, ey + avgy);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        for (i = 0; i < 24; i++) {
            var cx = Math.cos(i * (2 * Math.PI) / 24);
            var cy = Math.sin(i * (2 * Math.PI) / 24);

            var ex = srxx * cx + srxy * cy;
            var ey = srxy * cx + sryy * cy;

            ctx.lineTo(2 * ex + avgx, 2 * ey + avgy);
        }
        ctx.closePath();
        ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.stroke();
}