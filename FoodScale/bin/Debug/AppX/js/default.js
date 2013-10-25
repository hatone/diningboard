
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
  
                init();
            } else {

            }
            args.setPromise(WinJS.UI.processAll().then(function completed() {

                var calcButton = document.getElementById("calcButton");
                calcButton.addEventListener("click", showCalc, false);

                var calcButton = document.getElementById("reWrite");
                calcButton.addEventListener("click", reWrite, false);

            }));
        }
    };

    app.oncheckpoint = function (args) {

    };

    app.oncheckpoint = function (args) { };
    function doAction(event) {
        var field = document.getElementById("text1");
        var msg = document.getElementById("msg");
        msg.textContent = "your choise is" + field.value;
    }

    var canvas, stage;
    var drawingCanvas;
    var oldPt;
    var oldMidPt;

    var horizon;
    var point;
    var isnotMakedCircle;
    var waitTime;

    var calorie = 0;
    var area = 0;

    app.oncheckpoint = function (args) { };
    function showCalc(event) {
        var msg = document.getElementById("calorie");
        calcCarorie();
        var foodFactor = document.getElementById("foods").value;
        Debug.writeln("area is " + foodFactor);
        Debug.writeln("food factor is " + foodFactor);
        msg.textContent = Math.round((area / 32) * parseFloat(foodFactor));
        render("scale_status", "Done.  :-)");
    }

    function calcCarorie() {
        var inFlag = false;
        var raughHorizon = new Array();
        //var sortedHorizon = horizon.sort();
        horizon.forEach(function (value, index) {
            var splitedValue = value.split("x");
            var raughValue = (Math.round(parseInt(splitedValue[0]) / 10) * 10) + "x" + (Math.round(parseInt(splitedValue[1]) / 10) * 10);
            if (raughHorizon.indexOf(raughValue) == -1) {
                raughHorizon.push(raughValue);
            }
        });
        Debug.writeln(raughHorizon);

        for (var x = 0; x < 1300; x += 10) {
            for (var y = 0; y < 800; y += 10) {
                if (horizon.indexOf(x + 'x' + y) != -1 && inFlag == false) {
                    inFlag = true;
                }
                else if (horizon.indexOf(x + 'x' + y) != -1 && inFlag == true) {
                    inFlag = false;
                }
                if (inFlag == true) {
                    area += 1;
                } else {

                }
            }
        }
    }

    app.oncheckpoint = function (args) { };
    function reWrite(event) {
        Debug.writeln("rewrite!!");
        location.reload(true);
        init();
    }

    app.oncheckpoint = function (args) { };
    function render(target, message) {
        var msg = document.getElementById(target);
        msg.textContent = message;
    }

    function init() {
        canvas = document.getElementById("myCanvas");

        stage = new createjs.Stage(canvas);
        stage.autoClear = false;
        stage.enableDOMEvents(true);

        createjs.Touch.enable(stage);
        createjs.Ticker.setFPS(24);

        drawingCanvas = new createjs.Shape();

        horizon = new Array();
        point = "";
        isnotMakedCircle = true;
        waitTime = 0;

        stage.addEventListener("stagemousedown", handleMouseDown);
        stage.addEventListener("stagemouseup", handleMouseUp);

        stage.addChild(drawingCanvas);
        stage.update();
    }

    function stop() {
        createjs.Ticker.removeEventListener("tick", tick);
    }

    function handleMouseDown(event) {
        oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
        //'Buxton Sketch'
 //       Debug.writeln("\n--------------------\nstart at\n x:" + stage.mouseX + " y:" + stage.mouseY + "\n--------------------\n");
        oldMidPt = oldPt;

        stage.addEventListener("stagemousemove", handleMouseMove);
    }

    function handleMouseMove(event) {
        var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

        drawingCanvas.graphics.clear().setStrokeStyle(20, 'round', 'round').beginStroke('#B22222').moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);
        oldPt.x = stage.mouseX;
        oldPt.y = stage.mouseY;
        oldMidPt.x = midPt.x;
        oldMidPt.y = midPt.y;

        point = (Math.round(stage.mouseX / 2) * 2) + 'x' + (Math.round(stage.mouseY / 2) * 2);

        if (isClosed(point) == false && isnotMakedCircle) {
            Debug.writeln(point);
            horizon.push(point);
        } else {
            render("scale_status","Click to calucurate!");
            //finish creating circle!
            isnotMakedCircle = false;
        }

        stage.update();
    }

    function handleMouseUp(event) {
        Debug.writeln("\n--------------------\n end at\n x:" + stage.mouseX + " y:" + stage.mouseY + "\n--------------------\n");
        Debug.writeln(horizon.length);
        stage.removeEventListener("stagemousemove", handleMouseMove);
    }


    function isClosed(point) {
        if (waitTime == 30) waitTime = 0;
        if (horizon.indexOf(point) != -1) {
            return true;
        }
        waitTime += 1;
        return false;
    }

    app.start();
})();

