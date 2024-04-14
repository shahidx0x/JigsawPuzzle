'use strict';
/*
===============================================================
Global Variable Declaration
Below are the varaibles used globally. So don't rename them
===============================================================
*/
var tolerance = 20;
var edgeMargin = 0;
var shortList;
var cellDim = new Object();
var row, col, unit, pic, pieceArray, pieceIndex;
var picDim = new Object();
var complete = 1;
var trans, xm, ym, ts;
var timeElapsed;
var hintImage;
var angle = [0, 90, 180, 270];
var rnd;
var inGame = false;
var throwEffect;
var selectedPic;
var grayScale = new createjs.ColorMatrixFilter([
    0.30, 0.30, 0.30, 0, 0, // red component
    0.30, 0.30, 0.30, 0, 0, // green component
    0.30, 0.30, 0.30, 0, 0, // blue component
    0, 0, 0, 1, 0  // alpha
]);
var colorScale = new createjs.ColorMatrixFilter([
    1, 0, 0, 0, 0, // red component
    0, 1, 0, 0, 0, // green component
    0, 0, 1, 0, 0, // blue component
    0, 0, 0, 1, 0  // alpha
]);
var bgAudio = "bg.mp3";
/*
===============================================================
This function runs after getImageMetadata dispatch an event
This funcation is the starting point to finalize the image that
need to be selected for jigsaw puzzle.
===============================================================
*/
function onImageLoaded(e) {
    var rcArray = [];
    hintImage = new createjs.Bitmap(e.target);
    pic = new createjs.Bitmap(e.target);
    var bitmap = new createjs.Bitmap(e.target);
    debug.innerHTML = bitmap.image.width + " x " + bitmap.image.height;
    var w = gw * dpi - 2 * edgeMargin * dpi;
    var h = gh * dpi - 2 * edgeMargin * dpi;

    var sk = w / e.target.width;
    if (e.target.height * sk > h) {
        sk = h / e.target.height;
    }

    var imgW = bitmap.image.width * sk;
    var imgH = bitmap.image.height * sk;
    unit = 40;
    getRowCol();
    /*
    ===============================================================
    getRowCol function is used to get all the possible image sizes
    keeping the jigsaw piece shape as square, orientation and edge
    margin.
    ===============================================================
    */
    function getRowCol() {
        var row = Math.floor(imgH / unit);
        var col = Math.floor(imgW / unit);
        var sx, sy;
        sx = sy = imgH / row / 40;
        var nsk = (40 * row * sx) / pic.image.height;
        pic.scale = nsk;
        col = Math.round((pic.image.width * nsk) / (40 * sx));

        if (row * col > 200) {
            unit += 1;
            getRowCol();
        } else {
            if (row * col < 4 || (row < 2 || col < 2)) {
                getShortList();
            } else {
                rcArray.push({ row: row, col: col, unit: unit, imgScale: nsk, sx: sx });
                unit += 1;
                getRowCol();
            }
        }
        var cx = (game.clientWidth - col * 40 * nsk) / 2
    }
    /*
    ===============================================================
    The list obtained by getRowCol is then be short listed by 
    getShortList function.
    ===============================================================
    */
    function getShortList() {
        shortList = [];
        var items = [];
        shortList.push({ row: rcArray[0].row, col: rcArray[0].col, unit: rcArray[0].unit, imgScale: rcArray[0].imgScale, sx: rcArray[0].sx });
        items.push(rcArray[0].row + " x " + rcArray[0].col + " (" + rcArray[0].row * rcArray[0].col + " pieces)");
        for (var s = 1; s < rcArray.length; s++) {
            if (rcArray[s - 1].row == rcArray[s].row && rcArray[s - 1].col == rcArray[s].col) {
            } else {
                shortList.push({ row: rcArray[s].row, col: rcArray[s].col, unit: rcArray[s].unit, imgScale: rcArray[s].imgScale, sx: rcArray[s].sx });
                items.push(rcArray[s].row + " x " + rcArray[s].col + " (" + rcArray[s].row * rcArray[s].col + " pieces)");
            }
        }
        rcArray = shortList;
        populateSize(items);
    }
}
/*
===============================================================
This function perform the following tasks:
1. lock game area
2. play loop audio
3. setup header icons
4. Garbage Collection or Nullify previous game assets stored in
gameBox, hintBox and hintOutline
5. set row & col
6. Reset framerate according the the device and (row x col) combination
7. Reset time and counter
8. Set all the display objects based on settings provided in screenSetup
9. Compute timeLimit & warnAt values
10. Execute createPiece function
===============================================================
*/
function createJigsawPuzzle() {
    lock.style.display = "block";
    playLoopAudio("assets/audios/" + bgAudio);
    header.getChildByName("btnSetup1").visible = true;
    header.getChildByName("btnPlayOn").visible = true;
    header.getChildByName("btnPlayOff").visible = false;

    header.getChildByName("btnMuteOn").visible = (volume == 0) ? false : true;
    header.getChildByName("btnMuteOff").visible = (volume == 0) ? true : false;

    while (gameBox.numChildren != 0) {
        gameBox.removeChildAt(0);
    }
    hintBox.uncache();
    while (hintBox.numChildren != 0) {
        hintBox.removeChildAt(0);
    }
    while (hintOutline.numChildren != 0) {
        hintOutline.removeChildAt(0);
    }
    row = shortList[settings.sizeIndex].row;
    col = shortList[settings.sizeIndex].col;

    if (device == "smart") {
        createjs.Ticker.framerate = Math.round((30 + (row * col) / 6.5));
    }

    header.getChildByName("txtTime").text = "00:00:00";
    header.visible = true;
    unit = shortList[settings.sizeIndex].unit;
    hintImage.scale = shortList[settings.sizeIndex].imgScale;
    hintBox.mouseChildren = false;
    hintBox.addChild(hintImage);
    hintBox.addChild(hintOutline);

    hintOutline.visible = (settings.join == "Position") ? true : false;
    hintImage.alpha = (settings.hint == "Yes") ? .25 : 0;
    hintBox.x = (game.clientWidth * dpi - hintBox.getBounds().width) / 2;
    hintBox.y = (game.clientHeight * dpi - hintBox.getBounds().height) / 2;
    pic.scale = shortList[settings.sizeIndex].imgScale;
    picDim.sx = shortList[settings.sizeIndex].sx;
    picDim.xf = ((col * 40 * picDim.sx) - (pic.image.width * shortList[settings.sizeIndex].imgScale)) / 2;
    pieceArray = getPieceArray(row, col);
    pieceIndex = 0;
    gameBox.visible = false;
    hintBox.visible = false;
    var rotationFactor = (settings.rotation == "Yes") ? 2 : 1;
    var hintFactor = (settings.hint == "No") ? 2 : 1;
    var throwFactor = (settings.throw == "Single") ? 2 : 1;
    var colorFactor = (settings.colorshift == "Yes") ? 2 : 1;
    timeLimit = row * col * rotationFactor * hintFactor * throwFactor * colorFactor * 2;
    timeLimit = 4;
    warnAt = Math.round(timeLimit / 4);
    complete = (settings.join == "Position") ? 0 : 1;
    header.getChildByName("txtCount").text = complete + "/" + (row * col);
    createPiece();
}
/*
===============================================================
This function perform the following tasks:
1. remove any previously placed instance of item from tray
2. Execute getShapes function to collect shapes for jigsaw piece
3. Once the shape obtained reposition the image, overlay the shape
   apply filter, cache and then    
4. scale ovenCanvas accordingly
5. save ovenCanvas as image.
===============================================================
*/
function createPiece() {
    while (tray.numChildren != 0) {
        tray.removeChildAt(0);
    }
    var shapes = getShapes(pieceArray[pieceIndex].shape, picDim.sx);
    var stroke = shapes[0].stroke;
    hintOutline.addChild(stroke);
    var cell = shapes[0].cell;
    var effect = shapes[0].effect;
    effect.shadow = new createjs.Shadow("rgba(0,0,0,.25)", 3, 3, 5);
    var outline = shapes[0].outline;
    var blurFilter = new createjs.BlurFilter(1, 1, 10, 2);
    // outline.filters = [blurFilter];

    var tmp = String(shapes[0].dim).split(" ");
    cellDim.x = tmp[0];
    cellDim.y = tmp[1];
    cellDim.width = tmp[2];
    cellDim.height = tmp[3];
    cellDim.pivotX = tmp[4];
    cellDim.pivotY = tmp[5];

    hintOutline.x = 20 * picDim.sx - picDim.xf;
    hintOutline.y = 20 * picDim.sx;
    stroke.regX = tmp[4] * picDim.sx;
    stroke.regY = tmp[5] * picDim.sx;

    stroke.x = pieceArray[pieceIndex].xpos * 40 * picDim.sx;
    stroke.y = pieceArray[pieceIndex].ypos * 40 * picDim.sx;

    pic.x = -(pieceArray[pieceIndex].xpos * 40 - cellDim.pivotX + 20) * picDim.sx + picDim.xf;
    pic.y = -(pieceArray[pieceIndex].ypos * 40 - cellDim.pivotY + 20) * picDim.sx;

    pic.mask = cell;

    var bevel = effect.clone(true);
    bevel.alpha = .3;
    var bevelBlurFilter = new createjs.BlurFilter(5, 5, 1);
    bevel.filters = [bevelBlurFilter];
    var bevelPic = pic.clone(true);
    var bevelPicMask = cell.clone(true);
    bevelPicMask.scale = .985;
    bevelPic.mask = bevelPicMask;

    tray.addChild(effect, pic, bevel, bevelPic, outline);

    ovenCanvas.width = (parseInt(cellDim.width) + 20) * picDim.sx;
    ovenCanvas.height = (parseInt(cellDim.height) + 20) * picDim.sx;

    oven.update();
    tray.snapToPixel = true;
    var image1 = new Image();
    image1.onload = function (e) { onPieceImageLoaded(e) };
    image1.src = ovenCanvas.toDataURL("image/png", 1);
}
/*
===============================================================
This function is actually a lister for image loaded from createPiece
function.
This function get and set the values in pieceArray
This function also check whether the piece count reach to row x col
If No then repeat the creatPiece.
If yes then run shuffle function.
===============================================================
*/
function onPieceImageLoaded(e) {
    var xp = pieceArray[pieceIndex].xpos;
    var yp = pieceArray[pieceIndex].ypos;
    var neighbours = [];
    if (xp == 0 && yp == 0) {
        neighbours = [{ id: pieceIndex + 1, pos: "R" }, { id: col, pos: "B" }];
    } else if (xp > 0 && xp < col - 1 && yp == 0) {
        neighbours = [{ id: xp - 1, pos: "L" }, { id: xp + 1, pos: "R" }, { id: xp + col, pos: "B" }];
    } else if (xp == col - 1 && yp == 0) {
        neighbours = [{ id: xp - 1, pos: "L" }, { id: xp + col, pos: "B" }];
    } else if (xp == 0 && yp > 0 && yp < row - 1) {
        neighbours = [{ id: col * (yp - 1), pos: "T" }, { id: col * yp + 1, pos: "R" }, { id: col * (yp + 1), pos: "B" }];
    } else if (xp > 0 && xp < col - 1 && yp > 0 && yp < row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }, { id: pieceIndex + 1, pos: "R" }, { id: pieceIndex + col, pos: "B" }];
    } else if (xp == col - 1 && yp > 0 && yp < row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }, { id: pieceIndex + col, pos: "B" }];
    } else if (xp == 0 && yp == row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex + 1, pos: "R" }]
    } else if (xp > 0 && xp < col - 1 && yp == row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }, { id: pieceIndex + 1, pos: "R" }]
    } else if (xp == col - 1 && yp == row - 1) {
        neighbours = [{ id: pieceIndex - col, pos: "T" }, { id: pieceIndex - 1, pos: "L" }]
    }
    var bitmap = new createjs.Bitmap(e.target);
    var grp = new createjs.Container();
    grp.mouseChildren = false;

    grp.id = grp.name = pieceIndex;
    bitmap.regX = cellDim.pivotX * picDim.sx;
    bitmap.regY = cellDim.pivotY * picDim.sx;
    pieceArray[pieceIndex].neighbour = neighbours;
    pieceArray[pieceIndex].regX = cellDim.pivotX;
    pieceArray[pieceIndex].regY = cellDim.pivotY;
    pieceArray[pieceIndex].s = picDim.sx;
    pieceArray[pieceIndex].id = pieceIndex;
    pieceArray[pieceIndex].gid = pieceIndex;
    pieceArray[pieceIndex].w = cellDim.width;
    pieceArray[pieceIndex].h = cellDim.height;

    xm = 20 * picDim.sx + (gw * dpi - 40 * col * picDim.sx) / 2;
    ym = 20 * picDim.sx + (gh * dpi - 40 * row * picDim.sx) / 2;

    grp.x = xm + 40 * pieceArray[pieceIndex].xpos * picDim.sx;
    grp.y = ym + 40 * pieceArray[pieceIndex].ypos * picDim.sx;
    grp.xp = grp.x;
    grp.yp = grp.y;
    pieceArray[pieceIndex].xp = grp.x;
    pieceArray[pieceIndex].yp = grp.y;

    if (settings.colorshift == "Yes") {
        bitmap.filters = [grayScale];
    } else if (settings.colorshift == "No") {
        bitmap.filters = [colorScale];
    }
    bitmap.cache(0, 0, bitmap.image.width, bitmap.image.height);

    pieceArray[pieceIndex].x = grp.x;
    pieceArray[pieceIndex].y = grp.y;

    bitmap.id = bitmap.name = pieceIndex;
    grp.positioned = false;
    grp.id = grp.name = pieceIndex;
    grp.uitype = "cell";
    grp.addChild(bitmap);

    gameBox.addChild(grp);
    pieceIndex++;
    txtCutCount.text = "Cutting image into pieces " + (pieceIndex) + " / " + (row * col);
    txtCutCount.visible = true;
    if (pieceIndex < row * col) {
        createPiece();
    } else {
        txtCutCount.visible = false;
        hintBox.cache(0, 0, hintBox.getBounds().width, hintBox.getBounds().height);
        shuffle();
    }
}
/*
===============================================================
This function is used to randomize array
===============================================================
*/
function randomizeArray(ary) {
    var rndArray = [];
    var len = ary.length;
    for (var i = len - 1; i >= 0; i--) {
        var p = parseInt(Math.random() * ary.length);
        rndArray.push(ary[p]);
        ary.splice(p, 1);
    }
    return rndArray;
}
/*
===============================================================
This function is used to get any value between min and max value
provide as arguments.
===============================================================
*/
function randRange(minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}
/*
===============================================================
This function is used to show shuffle effects choosen by user
from screenSetup
===============================================================
*/
function shuffle() {
    var throwCount = 0;
    var series = [];
    hintBox.visible = true;
    for (var i = 0; i < row * col; i++) {
        series[i] = i;
    }
    rnd = randomizeArray(series);
    if (settings.throw == "All") {
        var checkCount = 0;
        throwEffect = settings.shuffle - 1;
        if (throwEffect == 0) {
            gameBox.visible = true;
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildAt(i);
                trans = [[{ x: gw / 2 * dpi, y: gh / 2 * dpi }, 1000, createjs.Ease.getPowOut(5)]];
                tween("tween", grp, 1000, false, false, trans, true, check0);
            }
            function check0() {
                checkCount++;
                if (checkCount == row * col) {
                    var i = 0;
                    for (var i = 0; i < rnd.length; i++) {
                        var grp = gameBox.getChildAt(rnd[i]);
                        var cell = grp.getChildAt(0);
                        var xp = xm + 40 * pieceArray[i].xpos * picDim.sx;
                        var yp = ym + 40 * pieceArray[i].ypos * picDim.sx;
                        if (settings.rotation == "Yes") {
                            var r = angle[randRange(0, 3)];
                            trans = [[{ rotation: r }, 500, createjs.Ease.quadInOut]];
                            tween("tween", cell, 0, false, false, trans, true);
                        }
                        trans = [[{ x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
                        tween("tween", grp, 0, false, false, trans, true, throwDone);
                    }
                }
            }
        } else if (throwEffect == 1) {
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildAt(i);
                grp.scale = 5;
                grp.alpha = 0;
                trans = [[{ x: gw / 2 * dpi, y: gh / 2 * dpi }, 500, createjs.Ease.getPowOut(5)]];
                tween("tween", grp, 1000, false, false, trans, true, check1);
            }
            function check1() {
                checkCount++;
                if (checkCount == row * col) {
                    gameBox.visible = true;
                    var i = 0;
                    for (var i = 0; i < rnd.length; i++) {
                        var grp = gameBox.getChildAt(rnd[i]);
                        var xp = xm + 40 * pieceArray[i].xpos * picDim.sx;
                        var yp = ym + 40 * pieceArray[i].ypos * picDim.sx;
                        trans = [[{ alpha: 1, scale: 1, x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
                        tween("tween", grp, i * 30, false, false, trans, true, throwDone);
                    }
                }
            }
        } else if (throwEffect == 2) {
            gameBox.visible = true;
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildAt(i);
                trans = [[{ x: gw / 2 * dpi, y: gh / 2 * dpi }, 500, createjs.Ease.getPowOut(5)]];
                tween("tween", grp, 1000, false, false, trans, true, check2);
            }
            function check2() {
                checkCount++;
                if (checkCount == row * col) {
                    var step = 360 / rnd.length;
                    var angle = 0;
                    for (var i = 0; i < rnd.length; i++) {
                        if (device == "smart") {
                            var radius = Math.min(gw, gh) / 2 - 40 * picDim.sx;
                        } else {
                            var radius = (Math.min(gw, gh) / 2 - 40 * picDim.sx) * dpi;
                        }
                        var grp = gameBox.getChildAt(rnd[i]);
                        angle += step;
                        var theta = angle / 180 * Math.PI;
                        var xp = gw / 2 + radius * Math.cos(theta);
                        var yp = gh / 2 + radius * Math.sin(theta);
                        trans = [[{ x: xp * dpi, y: yp * dpi }, 500, createjs.Ease.quadInOut]];
                        tween("tween", grp, 0, false, false, trans, true, throwDone);
                    }
                }
            }
        } else if (throwEffect == 3) {
            gameBox.visible = true;
            for (var i = 0; i < gameBox.numChildren; i++) {
                var grp = gameBox.getChildAt(i);
                trans = [[{ x: gw / 2 * dpi, y: gh / 2 * dpi }, 500, createjs.Ease.getPowOut(5)]];
                tween("tween", grp, 1000, false, false, trans, true, check3);
            }
            function check3() {
                checkCount++;
                if (checkCount == row * col) {
                    var k = (device == "smart") ? 4 : 1;
                    var step = 40;
                    var r = 20;
                    var c = 20;
                    var flow = ["LR", "TB", "BL", "LT"];
                    var flowIndex = 0;
                    var margin = 80;
                    for (var i = 0; i < rnd.length; i++) {
                        var xp = c * picDim.sx + margin;
                        var yp = r * picDim.sx + margin;
                        if (flow[flowIndex] == "LR") {
                            c += step;
                            if (xp >= gw * dpi - 80 * picDim.sx - margin) {
                                // xp = gw;
                                xp = gw * dpi - 80 * picDim.sx - margin
                                flowIndex++;
                            }
                        }
                        else if (flow[flowIndex] == "TB") {
                            r += step;
                            if (yp >= gh * dpi - 80 * picDim.sx - margin) {
                                flowIndex++;
                            }
                        }
                        else if (flow[flowIndex] == "BL") {
                            c -= step;
                            if (xp <= 80 * picDim.sx + margin) {
                                flowIndex++;
                            }
                        }
                        else if (flow[flowIndex] == "LT") {
                            r -= step;
                            if (yp <= 80 * picDim.sx + margin) {
                                flowIndex = 0;
                            }
                        }
                        var grp = gameBox.getChildAt(rnd[i]);
                        trans = [[{ x: xp, y: yp }, 500, createjs.Ease.quadInOut]];
                        tween("tween", grp, i * 30, false, false, trans, true, throwDone);
                    }
                }
            }
        }
        function throwDone() {
            throwCount++;
            if (throwCount == row * col) {
                timeElapsed = 0;
                startTime = new Date();
                timeOn = true;
                inGame = true;
                lock.style.display = "none";
            }
        }
    } else if (settings.throw == "Single") {
        for (var i = 0; i < row * col; i++) {
            grp = gameBox.getChildByName(i);
            grp.visible = false;
        }
        gameBox.visible = true;
        throwSingle();
        timeElapsed = 0;
        startTime = new Date();
        timeOn = true;
        inGame = true;
        lock.style.display = "none";
    }
}
/*
===============================================================
This function is used when user choose "Single" in screenSetup
===============================================================
*/
function throwSingle() {
    grp = gameBox.getChildByName(rnd[complete]);
    grp.alpha = 0;
    grp.scale = 5;
    gameBox.addChild(grp);
    grp.visible = true;
    var cell = grp.getChildAt(0);
    if (settings.rotation == "Yes") {
        var r = angle[randRange(0, 3)];
        trans = [[{ rotation: r }, 500, createjs.Ease.quadInOut]];
        tween("tween", cell, 0, false, false, trans, true);
    }
    trans = [[{ alpha: 1, scale: 1, x: gw * dpi / 2, y: gh * dpi / 2 }, 500, createjs.Ease.getPowOut(5)]];
    tween("tween", grp, 0, false, false, trans, true, onSingleDropped);
    function onSingleDropped() {
        if (!inGame) {
            inGame = true;
            timeElapsed = 0;
            startTime = new Date();
            timeOn = true;
        }
    }
}
/*
===============================================================
This is a common function for both case (Free/Position)
This function is responsible to check whether the pieces are 
paired correctly or postioned correctly.
===============================================================
*/
function checkAfterRelease(grp) {
    if (complete != row * col) {
        if (settings.join == "Free") {
            var pair = getPair(grp);
            if (pair) shift(pair);
        } else if (settings.join == "Position") {
            if (Math.abs(grp.x - grp.xp) <= tolerance && Math.abs(grp.y - grp.yp) <= tolerance) {
                complete++;
                playEventSound("correct", 0, false, true);
                if (complete == row * col) {
                    timeOn = false;
                    lock.style.display = "block";
                    hideHeaderBtns();
                }
                header.getChildByName("txtCount").text = complete + "/" + (row * col);
                grp.positioned = true;

                gameBox.addChildAt(grp, 0);
                grp.getChildAt(0).uncache();

                trans = [[{ x: grp.xp, y: grp.yp }, 500, createjs.Ease.getPowOut(5)]];
                tween("tween", grp, 0, false, false, trans, true, onPositined);
            }
        }
    }
    function onPositined(e) {
        if (complete == row * col) {
            showResult();
        } else if (settings.throw == "Single") {
            throwSingle();
        }
    }
}
/*
===============================================================
In Join Mode "Free" We need to get the pair of two shape of
group of shape to paried togather.
This function is used to fulfill this activity
===============================================================
*/
function getPair(grp) {
    var cellA; // The target cell that needs to pair
    var cellB; // The child of target cell
    var infoA; // Target array from pieceArray for cellA
    var infoB; // Target array from pieceArray for cellA
    var na; // Neighbours of cellA
    var p1; // Point for cellA
    var p2; // Point for cellB        
    for (var i = 0; i < grp.numChildren; i++) {
        cellA = grp.getChildAt(i);
        p1 = grp.localToGlobal(cellA.x, cellA.y);
        infoA = pieceArray[cellA.id];
        var gidA = infoA.gid;
        na = infoA.neighbour;
        ts = infoA.s;
        for (var j = 0; j < na.length; j++) {
            var gidB = pieceArray[na[j].id].gid;

            if (gidA != gidB) {
                var grpB = gameBox.getChildByName(gidB);
                cellB = grpB.getChildByName(na[j].id);
                infoB = pieceArray[cellB.id];
                p2 = grpB.localToGlobal(cellB.x, cellB.y);
                var d1 = Math.pow((Math.pow((infoA.xp - infoB.xp), 2) + Math.pow((infoA.yp - infoB.yp), 2)), .5);
                var d2 = Math.pow((Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2)), .5);
                if (Math.abs(d1 - d2) <= tolerance) {
                    trace("in range")
                    if (na[j].pos == "R" || na[j].pos == "L") {
                        trace("horizontal join")
                        var vd = Math.abs(p1.y - p2.y);
                        var hd = p1.x - p2.x;
                        trace("hd > 0 && vd <= tolerance");
                        trace(hd + ">" + 0 + "  && " + vd + "<=" + tolerance);
                        if (na[j].pos == "R" && hd < 0 && vd <= tolerance) {
                            return [cellA, cellB, na[j].pos];
                        } else if (na[j].pos == "L" && hd > 0 && vd <= tolerance) {
                            return [cellA, cellB, na[j].pos];
                        }
                    } else if (na[j].pos == "B" || na[j].pos == "T") {
                        trace("vertical join")
                        var hd = Math.abs(p1.x - p2.x);
                        var vd = p1.y - p2.y;
                        if (na[j].pos == "B" && vd < 0 && hd <= tolerance) {
                            return [cellA, cellB, na[j].pos];
                        } else if (na[j].pos == "T" && vd > 0 && hd <= tolerance) {
                            return [cellA, cellB, na[j].pos];
                        }
                    }
                }
            }
        }
    }
    return null;
}
/*
===============================================================
This function is used to hide header buttons located in game 
screen
===============================================================
*/
function hideHeaderBtns() {
    header.getChildByName("btnMuteOn").visible = false;
    header.getChildByName("btnMuteOff").visible = false;
    header.getChildByName("btnPlayOn").visible = false;
    header.getChildByName("btnPlayOff").visible = false;
}
/*
===============================================================
Once we get the pair of two groups we need to shift all the
children (pieces) from one group to another.
This case is only for Join as Free mode.
This function is for this activity
===============================================================
*/
function shift(ary) {
    var cellA = ary[0];
    var cellB = ary[1];
    var pos = ary[2];

    var grpA = cellA.parent;
    var grpB = cellB.parent;
    complete++;
    playEventSound("correct", 0, false, true);
    header.getChildByName("txtCount").text = complete + "/" + (row * col);
    var pA = grpA.localToGlobal(cellA.x, cellA.y);
    var pB = gameBox.localToGlobal(cellB.x, cellB.y);
    grpB.regX = pB.x;
    grpB.regY = pB.y;
    grpA.getChildAt(0).uncache();
    if (pos == "R") {
        grpB.x = pA.x + 40 * ts;
        grpB.y = pA.y;
    } else if (pos == "L") {
        grpB.x = pA.x - 40 * ts;
        grpB.y = pA.y;
    } else if (pos == "B") {
        grpB.x = pA.x;
        grpB.y = pA.y + 40 * ts;
    } else if (pos == "T") {
        grpB.x = pA.x;
        grpB.y = pA.y - 40 * ts;
    }
    var len = grpB.numChildren;
    for (var k = 0; k < len; k++) {
        var cellNew = grpB.getChildAt(0);
        cellNew.uncache();
        pieceArray[cellNew.id].gid = grpA.id;
        var p = grpB.localToGlobal(cellNew.x, cellNew.y);
        p = grpA.globalToLocal(p.x, p.y);
        cellNew.x = p.x;
        cellNew.y = p.y;
        grpA.addChildAt(cellNew, 0);
    }
    gameBox.removeChild(grpB);
    for (var i = 0; i < grpA.numChildren; i++) {
        var cell = grpA.getChildAt(i);
        var neg = pieceArray[cell.id].neighbour;
        for (var j = neg.length - 1; j >= 0; j--) {
            if (grpA.getChildByName(neg[j].id) != null) {
                neg.splice(j, 1);
            }
        }
    }
    if (complete == row * col) {
        timeOn = false;
        lock.style.display = "block";
        hideHeaderBtns();
        trans = [[{ x: grpA.xp, y: grpA.yp }, 500, createjs.Ease.getPowOut(1)]];
        tween("tween", grpA, 500, false, false, trans, true, showResult);
    }
}
/*
===============================================================
This function is used to convert seconds into time hh:mm:ss
===============================================================
*/
function convertNumberToTime(n) {
    return String(Math.floor(n / 3600) < 10 ? "0" + String(Math.floor(n / 3600)) : String(Math.floor(n / 3600))) + ":" + String(Math.floor(n / 60) % 60 < 10 ? "0" + String(Math.floor(n / 60) % 60) : String(Math.floor(n / 60) % 60)) + ":" + String(Math.floor(n) % 60 < 10 ? "0" + String(Math.floor(n) % 60) : String(Math.floor(n) % 60));
}