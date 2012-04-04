// references 'externals/src/sylvester.js'
// references 'externals/src/matrix.js'
// references 'externals/src/vector.js'


var DataAnalysis = function (dimensions) {
    this.dimensions = dimensions;
    this.mean = Sylvester.Vector.Zero(dimensions);
    this.covariance = Sylvester.Matrix.Zero(dimensions, dimensions);
    this.data = [];
};

DataAnalysis.prototype.clear = function () {
    this.mean = Sylvester.Vector.Zero(this.dimensions);
    this.covariance = Sylvester.Matrix.Zero(this.dimensions, this.dimensions);
    this.data = [];
};

var randomNormal = function (mean, std) {
    var r1 = Math.random();
    var r2 = Math.random();

    return mean + std * Math.sqrt(-2 * Math.log(r1)) * Math.cos(2 * Math.PI * r2);
};

DataAnalysis.prototype.add = function (point) {
    var count = this.data.length;
    var rowIndex, columnIndex, dataIndex;
    // Store data
    this.data.push(point);

    // Update mean
    for (rowIndex = 0; rowIndex < this.dimensions; rowIndex++) {
        var newMean = (this.mean.e(rowIndex + 1) * count + point[rowIndex]) / (count + 1);
        this.mean.set_e(rowIndex + 1, newMean);
    }

    // Compute covariance
    this.covariance = Sylvester.Matrix.Zero(this.dimensions, this.dimensions);
    for (rowIndex = 0; rowIndex < this.dimensions; rowIndex++) {
        for (columnIndex = rowIndex; columnIndex < this.dimensions; columnIndex++) {
            var sum = 0.0;
            for (dataIndex = 0; dataIndex < this.data.length; dataIndex++) {
                var rowDiff = (this.data[dataIndex][rowIndex] - this.mean.e(rowIndex + 1));
                var colDiff = (this.data[dataIndex][columnIndex] - this.mean.e(columnIndex + 1));
                sum += rowDiff * colDiff;
            }
            this.covariance.set_e(rowIndex + 1, columnIndex + 1, sum / (count + 1));
            this.covariance.set_e(columnIndex + 1, rowIndex + 1, sum / (count + 1));
        }
    }
};
