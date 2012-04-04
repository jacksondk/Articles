// references 'hmtl5.js'
// references 'externals/src/sylvester.js'
// references 'externals/src/matrix.js'
// references 'externals/src/vector.js'
// references 'dataanalysis.js'

var gfx;


function initialize(id) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    var dataAnalysis = new DataAnalysis(2);
    var offsetx = -canvas.width / 2;
    var offsety = canvas.height / 2;
    var gainx = 1;
    var gainy = -1;

    $("#generate").click(function (e) {
        var mx = parseFloat($("#avgx").val());
        var my = parseFloat($("#avgy").val());
        var xx = parseFloat($("#xx").val());
        var yy = parseFloat($("#yy").val());
        var xy = parseFloat($("#xy").val());
        var std = stdDev(xx, yy, xy);
        for (var i = 0; i < 1500; i++) {
            var x = randomNormal(0, 1),
                y = randomNormal(0, 1);

            dataAnalysis.add([std.dxx * x + std.dxy * y + mx, std.dxy * x + std.dyy * y + my]);

        }
        drawMetrics();
    });

    $("#clear").click(function (e) {
        dataAnalysis.clear();
        drawMetrics();
    });
    $(canvas).click(function (e) {
        // Get point of click
        var x = Math.floor((e.pageX - $(canvas).offset().left));
        var y = Math.floor((e.pageY - $(canvas).offset().top));
        var data = toData(x, y);

        // Add to data analysis module
        dataAnalysis.add([data.x, data.y]);
        drawMetrics();
    });

    function toScreen(x, y) {
        return { x: (x - offsetx) / gainx, y: (y - offsety) / gainy };
    }
    function toData(x, y) {
        return { x: gainx * x + offsetx, y: gainy * y + offsety };
    }

    function drawEllipsis(center_x, center_y, xx, xy, yy) {
        var i;
        ctx.beginPath();
        for (i = 0; i < 24; i++) {
            var cx = Math.cos(i * (2 * Math.PI) / 24);
            var cy = Math.sin(i * (2 * Math.PI) / 24);

            var ex = xx * cx + xy * cy;
            var ey = xy * cx + yy * cy;
            var screen = toScreen(ex + center_x, ey + center_y);
            ctx.lineTo(screen.x, screen.y);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function stdDev(xx, yy, xy) {
        var trace = xx + yy;
        var determinant = xx * yy - xy * xy;
        var s = Math.sqrt(determinant);
        var t = Math.sqrt(trace + 2 * s);
        var srxx = (xx + s) / t;
        var sryy = (yy + s) / t;
        var srxy = xy / t;
        return { dxx: srxx, dyy: sryy, dxy: srxy };
    }

    function drawMetrics() {
        // Get metrics
        var avgx = dataAnalysis.mean.e(1);
        var avgy = dataAnalysis.mean.e(2);

        xx = dataAnalysis.covariance.e(1, 1);
        yy = dataAnalysis.covariance.e(2, 2);
        xy = dataAnalysis.covariance.e(1, 2);

        // Compute "square root" of covariance to get "std dev"
        // source: http://en.wikipedia.org/wiki/Square_root_of_a_2_by_2_matrix
        var trace = xx + yy;
        var determinant = xx * yy - xy * xy;
        var s = Math.sqrt(determinant);
        var t = Math.sqrt(trace + 2 * s);
        var srxx = (xx + s) / t;
        var sryy = (yy + s) / t;
        var srxy = xy / t;

        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(-offsetx / gainx, 0);
        ctx.lineTo(-offsetx / gainx, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -offsety / gainy);
        ctx.lineTo(canvas.width, -offsety / gainy);
        ctx.stroke();

        ctx.fillStyle = "rgb(0,0,0)";
        var i = 0;
        for (i = 0; i < dataAnalysis.data.length; i++) {
            var screen = toScreen(dataAnalysis.data[i][0], dataAnalysis.data[i][1]);
            ctx.fillRect(screen.x, screen.y, 2, 2);
        }
        ctx.fillStyle = "rgb(255,0,0)";
        screen = toScreen(avgx, avgy);
        ctx.fillRect(screen.x, screen.y, 2, 2);

        ctx.strokeStyle = "rgb(0,0,0)";
        drawEllipsis(avgx, avgy, srxx, srxy, sryy);
        ctx.strokeStyle = "rgb(50,50,50)";
        drawEllipsis(avgx, avgy, 2 * srxx, 2 * srxy, 2 * sryy);

        $("#xx").val(xx.toFixed(1));
        $("#yy").val(yy.toFixed(1));
        $("#xy").val(xy.toFixed(1));
        $("#yx").val(xy.toFixed(1));
        $("#avgx").val(avgx.toFixed(1));
        $("#avgy").val(avgy.toFixed(1));
    };
}
