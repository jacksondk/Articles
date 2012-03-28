// references 'hmtl5.js'
// references 'externals/src/sylvester.js'
// references 'externals/src/matrix.js'
// references 'externals/src/vector.js'

var gfx;

var DataAnalysis = function (dimensions) {
    this.dimensions = dimensions;
    this.mean = Sylvester.Vector.Zero(dimensions);
    this.covariance = Sylvester.Matrix.Zero(dimensions, dimensions);
    this.data = [];
};

DataAnalysis.prototype.add = function (point) {
    var count = this.data.length;
    var rowIndex, columnIndex, dataIndex;
    this.data.push(point);
    for (rowIndex = 0; rowIndex < this.dimensions; rowIndex++) {
        var newMean = (this.mean.e(rowIndex + 1) * count + point[rowIndex]) / (count + 1);
        this.mean.set_e(rowIndex + 1, newMean);
    }
    this.covariance = Sylvester.Matrix.Zero(this.dimensions, this.dimensions);
    for (rowIndex = 0; rowIndex < this.dimensions; rowIndex++) {
        for (columnIndex = rowIndex; columnIndex < this.dimensions; columnIndex++) {
            var sum = 0.0;
            for (dataIndex = 0; dataIndex < this.data.length; dataIndex++) {
                var rowDiff = (this.data[dataIndex][rowIndex] - this.mean[rowIndex]);
                var colDiff = (this.data[dataIndex][columnIndex] - this.mean[columnIndex]);
                sum += rowDiff * colDiff;
            }
            this.covariance.set_e(rowIndex + 1, columnIndex + 1, sum / (count + 1));
        }
    }
};

DataAnalysis.prototype.get_mean = function (index) {
    return this.mean.e(index);
};


function initialize(id) {
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    var points = [];
    var dataAnalysis = new DataAnalysis(2);

    $(canvas).click(function (e) {
        var x = Math.floor((e.pageX - $(canvas).offset().left));
        var y = Math.floor((e.pageY - $(canvas).offset().top));

        dataAnalysis.add([x, y]);
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
        var avgx = dataAnalysis.get_mean(1); // sumx / points.length;
        var avgy = dataAnalysis.get_mean(2); // sumy / points.length;

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