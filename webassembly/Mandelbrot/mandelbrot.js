function getContext(canvasId) {
    var canvas    = {};
    canvas.element = document.getElementById(canvasId);
    canvas.ctx     = canvas.element.getContext("2d");
    canvas.width   = canvas.element.width;
    canvas.height  = canvas.element.height;
    canvas.data    = canvas.ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.plotColor = function(x, y, red, green, blue, alpha) {
        var index = (x + y * canvas.width) * 4;
        if (x < 0 || y < 0) return;
        if (x > canvas.width || y > canvas.height) return;

        canvas.data.data[index++] = canvas.constrainColor(red);
        canvas.data.data[index++] = canvas.constrainColor(green);
        canvas.data.data[index++] = canvas.constrainColor(blue);
        canvas.data.data[index++] = canvas.constrainColor(alpha);
    };
    
    canvas.constrainColor = function(color) {
        return (color<0) ?0 :(color>255) ?255 :color;
    };

    canvas.putImageData = function() {
        canvas.ctx.putImageData(canvas.data, 0, 0);
    };

    return canvas;
}

var max = 1000;

function doPlot(canvas) {
    for (var x=0; x<canvas.width; x++) {
        var ca = -2 + x / canvas.width * 3;
        for (var y=0; y<canvas.height; y++) {
            var cb = 1.5 - y / canvas.height * 3;
            var count = mandelbrot(ca, cb, max);
            var red = (count == max) ?0 :Math.abs((255-20*(count+1)) % 255)
            canvas.plotColor(x, y, red, 0, 0, 255);
        }
    }
    canvas.putImageData();
}

var canvas = getContext("Mandelbrot");

function waitForMandelbrot() {
    if (mandelbrot === undefined) {
        window.setTimeout(waitForMandelbrot, 50);
    } else {
        doPlot(canvas);
    }
}

window.setTimeout(waitForMandelbrot, 50);
