'use strict';
/*
===============================================================
Global Variable Declaration
Below are the varaibles used globally. So don't rename them
===============================================================
*/
var device;
if (
    navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
) {
    device = 'smart';
}
else {
    device = 'pc'
}
var bgImage = "wood3.jpg";
var selectedPic;
var dpi = window.devicePixelRatio;
var canvas, stage;
var tray, oven, ovenCanvas;
var dragCanvas, dragStage;
var dragBox = new createjs.Container();
var dropBox, game, gameBox, hintBox, hintOutline, txtCutCount, gw, gh;
var screenInfo, screenSplash, screenPopup, screenSetup, screenDropInside, screenCategory, screenGallery, screenRotate, screenSize, screenResult, resetPlayed, screenConfirm, header;
var setupAdImage;
var btnPlayOn, btnPlayOff, btnMuteOn, btnMuteOff, btnSetup
var galleryDir, shapeData;
var settings = { join: "Free", throw: "All", colorshift: "Yes", rotation: "No", time: "Elapse", hint: "Yes", image: "Gallery", shuffle: 1, shape: 1, folderIndex: 0, sizeIndex: 0, pic: "", shapeDataIndex: 0, orient: 0 };
var uitype, startTime;
var timeOn = false;
var timeLimit, warnAt;
var imgRot;
var lock;
var tStage = "stage";
var grp, downTime, dx, dy;
var tapTolerance = (device == "smart") ? 10 : 0;
var drag = false;
var win = true;
var warnActivated = false;
var galleryItems;
var debug;

/*
===============================================================
init
This function is an entry point, triggered from index.html
Below is a list of actions performed in this function.
1. create game div, Canvases
2. initiate createjs engine
3. set events
4. create UI
===============================================================
*/
function init() {
    game = Div("game", "body", "absolute", 0, "0 0", "0px", "0px", "100%", "100%", "rgba(0,0,0,0)", "#000000", "repeat", "url('assets/images/" + bgImage + "')");
    debug = Div("debug", "body", "absolute", 100, "0 0", "100px", "0px", "50%", "50px", "rgba(0,0,0,1)", "#ffffff");
    debug.style.display = "none";
    gw = game.clientWidth;
    gh = game.clientHeight;
    tray = new createjs.Container();
    ovenCanvas = Canvas("ovenCanvas", game);
    ovenCanvas.style.display = "none";
    ovenCanvas.style.zIndex = 0;
    oven = new createjs.Stage("ovenCanvas");
    oven.addChild(tray);

    dragCanvas = Canvas("dragCanvas", game)
    dragStage = new createjs.Stage("dragCanvas");
    dragStage.addChild(dragBox);
    dragCanvas.style.display = "none";

    canvas = Canvas("canvas", game);
    canvas.style.zIndex = 1;
    stage = new createjs.Stage("canvas");
    gameBox = new createjs.Container();
    hintBox = new createjs.Container();
    hintOutline = new createjs.Container();
    hintBox.mouseChildren = false;
    stage.addChild(hintBox);
    stage.addChild(gameBox);
    txtCutCount = addText("txtCutCount", stage, "", "Berlin Sans FB", (device == "smart") ? 8 * dpi : 30, "#ffffff", gw / 2, gh / 2);
    txtCutCount.textAlign = "center";
    txtCutCount.visible = false;

    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", tictic);
    createjs.Touch.enable(stage);

    gameBox.addEventListener('mousedown', function (e) { onTouch(e); });
    stage.addEventListener("click", function (e) { onTouch(e); });
    stage.mouseMoveOutside = true;

    dragStage.addEventListener("pressmove", function (e) { onTouch(e); });
    dragStage.addEventListener("pressup", function (e) { onTouch(e); });

    $(window).blur(function (e) {
        if (loopAudio) loopAudio.volume = 0;
    });
    $(window).focus(function (e) {
        if (btnMuteOn.visible) {
            if (loopAudio) loopAudio.volume = volume;
        }
    });
    
    // disableEvents();
    /*
    UI Design
    ==================================================================
    Create Screens
    1.  Splash
    2.  Setup
    3.  Drop Inside
    4.  Category
    5.  Gallery
    6.  Rotate
    7.  Size
    8.  Jigsaw
    9.  Result
    10. Confirm
    11. Header
    ==================================================================
    */
    // screenSplash
    screenSplash = Container("screenSplash", stage, gw, gh, true);
    addBitmap("logo", screenSplash, "assets/images/splash.png", "c", (device == "smart") ? (gh / 2 - 70) : (gh / 2 - 120));
    var percent = addText("percent", screenSplash, "Loaded: 0%", "Berlin Sans FB", 20, "#ffffff", "c", "c", true);
    Button("btnStart", screenSplash, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Start", "Berlin Sans FB", 25, "#ffffff", "", 2, "c", (device == "smart") ? (gh / 2 + 20) : (gh / 2 + 40), false);

    screenPopup = Container("screenPopup", stage, gw, gh, false);
    var popupBox = Container("popupBox", screenPopup, 10, 10, true);
    addText("lblSplashText", popupBox, "Game Instructions ", "Berlin Sans FB Demi", 25, "#ffffff", "c", 100);
    Radio("rotation", popupBox, "TL", "1. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 130);
    Radio("rotation", popupBox, "TL", "2. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 150);
    Radio("rotation", popupBox, "TL", "3. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 170);
    Radio("rotation", popupBox, "TL", "4. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 190);
    Radio("rotation", popupBox, "TL", "5. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 210);
    Radio("rotation", popupBox, "TL", "6. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 230);
    Radio("rotation", popupBox, "TL", "7. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 250);
    Radio("rotation", popupBox, "TL", "8. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 270);
    Radio("rotation", popupBox, "TL", "9. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 290);
    Radio("rotation", popupBox, "TL", "10. Lorem Ipsum is simply dummy text of the printing and typesetting", [], 1, "rgba(255,0,0,0)", .5, "#ffffff", "#ffffff", "Berlin Sans FB", "#ffffff", (device == "smart") ? 0.6 : 1, "c", 310);

    Button("btnPopup", popupBox, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Next", "Berlin Sans FB", 25, "#ffffff", "", 2, "c", 350, true);
    // addImage("dropBoxBg", "screenDropInside", true, 1, 0, "assets/images/drop.svg", "", (gw - 400) / 2, (gh - 400) / 2, false, 10);

    // screenSetup
    screenSetup = Container("screenSetup", stage, gw, gh, false);
    var setupBox = Container("setupBox", screenSetup, 10, 10, true);
    addText("lblSplashTitle", setupBox, "Setup", "Berlin Sans FB Demi", 35, "#000000", "c", 10);
    // Radio("join", setupBox, "TL", "Join:", ["Free", "Position"], 0, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 60);
    // Radio("throw", setupBox, "TL", "Throw:", ["All", "Single"], 0, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 105);
    // Radio("colorshift", setupBox, "TL", "Color Shift:", ["Yes", "No"], 1, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 150);60 105 150 195 240 330 375 420 420 480
    Radio("rotation", setupBox, "TL", "Rotation:", ["Yes", "No"], 1, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 60);
    Radio("time", setupBox, "TL", "Time:", ["Elapse"], 0, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 105);
    // Radio("hint", setupBox, "TL", "Hint:", ["Yes", "No"], 1, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 285);
    Radio("shuffle", setupBox, "TL", "Shuffle:", ["1", "2", "3", "4"], 0, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 150);
    Radio("shape", setupBox, "TL", "Shape:", ["1", "2", "3"], 0, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 195);
    if (device == "smart") {
        Radio("image", setupBox, "TL", "Image:", ["Gallery", "Camera"], 0, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 240);
    } else {
        Radio("image", setupBox, "TL", "Image:", ["Gallery", "Drop Inside"], 0, "rgba(255,0,0,0)", .5, "#000000", "#000000", "Berlin Sans FB", "#000000", (device == "smart") ? 1 : 1.5, "c", 240);
    }
    Button("btnPlay", setupBox, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Play", "Berlin Sans FB", 25, "#ffffff", "", 2, "c", 290, true);
    Button("btnReset", setupBox, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Reset", "Berlin Sans FB", 25, "#ffffff", "", 4, "c", 350, true);
    addImage("adImage", "game", true, 1, 0, "assets/images/ads/ads.jpg", "", (gw - 600) / 2, (gh - 200), false, 10);
    // ad images here
    setupAdImage = document.getElementById("adImage");
    setupAdImage.style.display = "none";

    setupBox.y = (gh * dpi - setupBox.getBounds().height) / 2 - 50;

    var input = document.createElement("INPUT");
    input.setAttribute("id", "btnCamFile");
    input.style.position = "absolute";
    input.style.display = "none";
    input.setAttribute("type", "file");
    input.setAttribute("accept", ".png, .jpg, .jpeg");
    input.setAttribute("onchange", "onCameraFileSelected(this)");
    document.body.appendChild(input);

    // screenDropInside
    screenDropInside = Div("screenDropInside", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,0.5)", "#ffffff");
    addImage("dropBoxBg", "screenDropInside", true, 1, 0, "assets/images/drop.svg", "", (gw - 400) / 2, (gh - 400) / 2, false, 10);
    dropBox = Div("dropBox", "screenDropInside", "absolute", 0, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,0)", "#ffffff");
    dropBox.addEventListener('dragenter', dropBoxEventHandler, false);
    dropBox.addEventListener('dragover', dropBoxEventHandler, false);
    dropBox.addEventListener('dragleave', dropBoxEventHandler, false);
    dropBox.addEventListener('drop', dropBoxEventHandler, false);
    addImage("btnExitDropInside", "screenDropInside", true, 1, 0, "assets/images/backDropInside.svg", " ", gw - 50, 20, false, 10);
    screenDropInside.style.display = "none";

    // ScreenCategory
    screenCategory = List("screenCategory", "category", "Select Category", "btnExitCategory");

    // ScreenGallery
    screenGallery = Grid("screenGallery", "gallery", "Select Image", "btnExitGallery");

    // ScreenRotate
    screenRotate = Container("screenRotate", stage, gw, gh, false);
    var rotBox = new createjs.Container();
    imgRot = new createjs.Container();
    rotBox.addChild(imgRot);
    rotBox.x = gw / 2 * dpi;
    rotBox.y = gh / 2 * dpi;
    rotBox.mouseChildren = false;
    rotBox.id = rotBox.name = "rotBox";
    rotBox.addEventListener("mousedown", function (e) { imgRot.rotation += 90; if (imgRot.rotation == 360) imgRot.rotation = 0; stage.update(); settings.orient = imgRot.rotation });
    var icoRotate = new createjs.Bitmap("assets/images/rotate.svg");
    icoRotate.scale = 4;
    icoRotate.x = -32 * 4 / 2;
    icoRotate.y = -32 * 4 / 2;
    rotBox.addChild(icoRotate);
    addText("txtRotate", screenRotate, "Tap on image to rotate", "Berlin Sans FB", (device == "smart") ? 8 * dpi : 30, "#ffffff", "c", 30 / dpi);
    var btnExitRotate = new createjs.Bitmap("assets/images/backDropInside.svg");
    btnExitRotate.id = btnExitRotate.name = "btnExitRotate";
    btnExitRotate.x = gw * dpi - 50;
    btnExitRotate.y = 20;
    btnExitRotate.addEventListener("mousedown", function (e) { btnActions(e); });
    screenRotate.addChild(rotBox);
    screenRotate.addChild(btnExitRotate);
    stage.update();
    Button("btnDone", screenRotate, "roundrect", "#994400", "rgba(0,0,0,0)", 0, "TL", 10, 5, "Done", "Berlin Sans FB", 25, "#ffffff", "", 2, "c", gh - 100, true);

    // ScreenSize
    screenSize = List("screenSize", "size", "Select Size", "btnExitSize");

    // Header
    header = new createjs.Container();
    header.id = header.name = "header";
    var txtCount = addText("txtCount", header, "192/192", "Berlin Sans FB", (device == "smart") ? 8 * dpi : 30, "#ffffff", 60 / dpi, 30 / dpi, true);
    txtCount.textAlign = "center";
    var txtTime = addText("txtTime", header, "00:00:00", "Berlin Sans FB", (device == "smart") ? 8 * dpi : 30, "#ffffff", 180 / dpi, 30 / dpi, true);
    txtTime.textAlign = "center";
    btnSetup = Button("btnSetup1", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/setup.svg", 1, gw - 90 / dpi, 16 / dpi, true);
    btnMuteOn = Button("btnMuteOn", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/muteOn.svg", 1, gw - 180 / dpi, 16 / dpi, true);
    btnMuteOff = Button("btnMuteOff", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/muteOff.svg", 1, gw - 180 / dpi, 16 / dpi, false);
    btnPlayOn = Button("btnPlayOn", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/pauseOn.svg", 1, gw - 270 / dpi, 16 / dpi, false);
    btnPlayOff = Button("btnPlayOff", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/pauseOff.svg", 1, gw - 270 / dpi, 16 / dpi, false);
    Button("btnInfo", header, "circle", "rgba(255,255,255,.01)", "#ffffff", 4, "TL", 10, 5, "", "", 0, "", "assets/images/info.svg", 1, gw - 360 / dpi, 16 / dpi, true);
    stage.addChild(header);
    header.visible = false;

    
    // Screen Result
    screenResult = Div("screenResult", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(255,0,0,0)", "#ffffff");
    addDiv("resultFrame", "screenResult", true, 350, 160, 10, "#ffffff", (gw - 350) / 2, (gh - 200) / 2, 0, "solid", "rgba(0,0,0,0)", 10);
    var txtResult = addDOMText("txtResult", "resultFrame", true, 300, 36, 0, "c", 5, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Congratulation!", "center", "#994400", true, 30, "Berlin Sans FB Demi");
    var txtScore = addDOMText("txtScore", "resultFrame", true, 300, 50, 0, "c", 50, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "You have completed (17 x 17) Jigsaw Puzzle in 00:05:55", "center", "#000000", true, 20, "Berlin Sans FB Demi");
    addDOMButton("btnBackToImageSelection", "resultFrame", true, "Back to Image Selection", 320, 30, 5, "#994400", "#ffffff", 20, true, "c", 105, 0, "solid", "#000000", 0, 0);
    screenResult.style.display = "none";
    
    // Reset Played
    resetPlayed = Div("resetPlayed", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(255,0,0,0)", "#ffffff");
    addDiv("resetPlayedFrame", "resetPlayed", true, 350, 160, 10, "#ffffff", (gw - 350) / 2, (gh - 200) / 2, 0, "solid", "rgba(0,0,0,0)", 10);
    var txtResultReset = addDOMText("txtResultReset", "resetPlayedFrame", true, 300, 36, 0, "c", 5, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Are you sure!", "center", "#994400", true, 30, "Berlin Sans FB Demi");
    var txtScoreReset = addDOMText("txtScoreReset", "resetPlayedFrame", true, 300, 50, 0, "c", 50, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "This will reset game data.", "center", "#000000", true, 20, "Berlin Sans FB Demi");
    addDOMButton("btnResetPlayed", "resetPlayedFrame", true, "Yes", 80, 30, 5, "#994400", "#ffffff", 20, true, 90, 100, 0, "solid", "#000000", 0, 0);
    addDOMButton("btnResetPlayedCancle", "resetPlayedFrame", true, "No", 80, 30, 5, "#994400", "#ffffff", 20, true, 180, 100, 0, "solid", "#000000", 0, 0);
    resetPlayed.style.display = "none";

    // screenConfirm
    screenConfirm = Div("screenConfirm", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(255,0,0,0)", "#ffffff");
    addDiv("confirmFrame", "screenConfirm", true, 300, 120, 10, "#ffffff", (gw - 300) / 2, (gh - 120) / 2, 0, "solid", "rgba(0,0,0,0)", 10);
    addDOMText("txtConfirm", "confirmFrame", true, 300, 36, 0, "c", 5, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Are you sure?", "center", "#994400", true, 30, "Berlin Sans FB Demi");
    addDOMButton("btnYes", "confirmFrame", true, "Yes", 80, 30, 5, "#994400", "#ffffff", 20, true, 50, 75, 0, "solid", "#000000", 0, 0);
    addDOMButton("btnNo", "confirmFrame", true, "No", 80, 30, 5, "#994400", "#ffffff", 20, true, 170, 75, 0, "solid", "#000000", 0, 0);
    screenConfirm.style.display = "none";

    // screenInfo
    screenInfo = Div("screenInfo", "body", "absolute", 1000, "0 0", 0, 0, "100%", "100%", "rgba(255,0,0,0)", "#ffffff");
    addDiv("infoFrame", "screenInfo", true, 400, 160, 10, "#ffffff", (gw - 400) / 2, (gh - 160) / 2, 0, "solid", "rgba(0,0,0,0)", 10);
    addDOMText("txtInfoTitle", "infoFrame", true, 400, 36, 0, "c", 5, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Audios & Visuals", "center", "#994400", true, 30, "Berlin Sans FB Demi");
    addDOMText("txtInfoImage", "infoFrame", true, 400, 36, 0, "c", 45, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Images: https://pixabay.com/", "center", "#000000", true, 20, "Berlin Sans FB");
    addDOMText("txtInfoAudio", "infoFrame", true, 400, 36, 0, "c", 75, "rgba(0,0,0,0)", 1, "solid", "rgba(0,0,0,0)", "Audios: http://www.purple-planet.com/", "center", "#000000", true, 20, "Berlin Sans FB");
    // addDOMButton("btnInfoClose", "infoFrame", true, "OK", 80, 30, 5, "#994400", "#ffffff", 20, true, "c", 115, 0, "solid", "#000000", 0, 0);

    screenInfo.style.display = "none";

    // lock
    lock = Div("lock", "body", "absolute", 2000, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,0)");
    lock.style.display = "none";

    
    
    /*
    ==================================================================
    Now load gallery file structure and jigsaw pieces shapes geometry
    then load all Assets.
    When all assets loaded then populateCategory
    and show start button in screenSplash
    ==================================================================
    */

    $.ajax({
        url: "assets/php/dir.php",
        type: 'POST',
        success: function (galleryHierarchy) {
            galleryDir = galleryHierarchy;
            jQuery.get("assets/json/path.json", function (shapesJSON) {
                shapeData = shapesJSON;
                loadAssets();
            });
        },
        dataType: "json"
    });
}
/*
==================================================================
This function runs when a user select an image via mobile/tablet
camera or take a snap from mobile device.
==================================================================
*/
function onCameraFileSelected(e) {
    var reader = new FileReader();
    reader.onload = function (e) {
        debug.innerHTML = "onCameraFileSelected onload"
        settings.pic = e.target.result;
        getImageMetadata(settings.pic);
        screenSetup.visible = false;
    }
    reader.readAsDataURL(e.files[0]);
}
/*
==================================================================
This function runs when a user drag and drop image in drop inside
box located in drop inside screen.
==================================================================
*/
function dropBoxEventHandler(e) {
    e.stopPropagation();
    e.preventDefault();
    debug.innerHTML = "dropBoxEventHandler";
    if (e.type == "drop") {
        debug.innerHTML = "dropBoxEventHandler drop";
        var file = e.dataTransfer.files[0];
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            settings.pic = reader.result;
            getImageMetadata(settings.pic);
            screenDropInside.style.display = "none";
            // screenSize.style.display = "block";
        }, false);
        reader.readAsDataURL(file);
    }
}
/*
==================================================================
This function is used to populate category.
galleryDir holds structure of gallery located in server side.
==================================================================
*/

function populateCategory() {
    var items = [];
    for (var i = 0; i < galleryDir.length; i++) {
        items.push(galleryDir[i].folder);
    }
    // var items = ["Wild Animals", "Colors", "Nature", "Animals 1", "Colors 1", "Nature 1", "Animals 2", "Colors 2", "Nature 2"];
    populateList("category", items);
    trace(galleryDir);
    // debug.innerHTML += "<br>" + items;
    // populateList(screenCategory.getChildByName("category"), items);
}

/*
==================================================================
This function saves data to the localStorage.
==================================================================
*/
function saveDataToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving data to localStorage: ", e);
  }
}

/*
==================================================================
This function clear specific key from the localStorage.
==================================================================
*/

function clearItemFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    console.log("Cleared item with key '" + key + "' from local storage.");
  } catch (e) {
    console.error("Error clearing item from local storage:", e);
  }
}

/*
==================================================================
This function get data from the localStorage.
==================================================================
*/

function getDataFromLocalStorage(key) {
  try {
    var storedData = localStorage.getItem(key);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      console.log("No data found in localStorage for the key:", key);
      return null;
    }
  } catch (e) {
    console.error("Error retrieving data from localStorage:", e);
    return null;
  }
}




/*
==================================================================
This function clear data from localStorage.
==================================================================
*/

function clearSessionStorage() {
  try {
    localStorage.clear();
    console.log("Session storage cleared successfully.");
  } catch (e) {
    console.error("Error clearing session storage:", e);
  }
}


/*
==================================================================
All button actions events are handle by this function.
==================================================================
*/

function btnActions(e) {
    
    var id = e.target.id;
    debug.innerHTML = e.target.id;
    if (id == "btnStart") {
        screenSplash.visible = false;
        screenPopup.visible = true;
        
    } else if (id == "btnPopup") {
        setupAdImage.style.display = "block";
        screenPopup.visible = false;
        screenSetup.visible = true;
        
    }
    else if (id == "btnPlay") {
        setupAdImage.style.display = "none";
        document.getElementById("btnCamFile").value = "";
        settings.shapeDataIndex = parseInt(screenSetup.getChildByName("setupBox").getChildByName("shape").selectedLabel) - 1;
        // settings.join = screenSetup.getChildByName("setupBox").getChildByName("join").selectedLabel;
        // settings.throw = screenSetup.getChildByName("setupBox").getChildByName("throw").selectedLabel;
        // settings.colorshift = screenSetup.getChildByName("setupBox").getChildByName("colorshift").selectedLabel;
        settings.rotation = screenSetup.getChildByName("setupBox").getChildByName("rotation").selectedLabel;
        settings.time = screenSetup.getChildByName("setupBox").getChildByName("time").selectedLabel;
        // settings.hint = screenSetup.getChildByName("setupBox").getChildByName("hint").selectedLabel;
        settings.shuffle = parseInt(screenSetup.getChildByName("setupBox").getChildByName("shuffle").selectedLabel);
        settings.shape = parseInt(screenSetup.getChildByName("setupBox").getChildByName("shape").selectedLabel);
        settings.image = screenSetup.getChildByName("setupBox").getChildByName("image").selectedLabel;
        if (settings.image == "Drop Inside") {
            screenSetup.visible = false;
            screenDropInside.style.display = "block";
            // enableDropEvents();
        } else if (settings.image == "Camera") {
            // disableDropEvents();
            document.getElementById('btnCamFile').click();
        } else if (settings.image == "Gallery") {
            // disableDropEvents();
            screenSetup.visible = false;
            screenCategory.style.display = "block";
        }
    } else if (id == "btnExitDropInside") {
        screenDropInside.style.display = "none";
        screenSetup.visible = true;
    } else if (id == "btnExitCategory") {
        screenCategory.style.display = "none";
        screenSetup.visible = true;
        exitGame();
    } else if (id == "btnExitGallery") {
        screenGallery.style.display = "none";
        screenCategory.style.display = "block";
    } else if (id == "btnExitRotate") {
        screenRotate.visible = false;
        if (settings.image == "Drop Inside" || settings.image == "Camera") {
            screenSetup.visible = true;
        } else if (settings.image == "Gallery") {
            screenGallery.style.display = "block";
        }
    } else if (id == "btnExitSize") {
        screenSize.style.display = "none";
        if (settings.image == "Drop Inside" || settings.image == "Camera") {
            screenSetup.visible = true;
        } else if (settings.image == "Gallery") {
            // screenGallery.style.display = "block";
            screenRotate.visible = true;
        }
    } else if (id == "btnPlayOn") {
        btnPlayOn.visible = false;
        btnPlayOff.visible = true;
        togglePlay(true);
    } else if (id == "btnPlayOff") {
        btnPlayOff.visible = false;
        btnPlayOn.visible = true;
        togglePlay(false);
    } else if (id == "btnMuteOff") {
        btnMuteOff.visible = false;
        btnMuteOn.visible = true;
        toggleMute(false);
    } else if (id == "btnMuteOn") {
        btnMuteOn.visible = false;
        btnMuteOff.visible = true;
        toggleMute(true);
    } else if (id == "btnSetup1") {
        if (inGame) {
            showConfirm();
        } else {
            exitGame();
        }
    } else if (id == "btnNo") {
        screenConfirm.style.display = "none";
    } else if (id == "btnYes") {
        exitGame();
    } else if (id == "btnSetup") {
        exitGame();
    } else if (id == "btnReplay") {
        replay();
    }else if(id === "btnReset"){
        clearItemFromLocalStorage('completed');
        resetPlayed.style.display = "block";
    }else if(id === "btnResetPlayed"){
        resetPlayed.style.display = "none";
    }else if(id === "btnResetPlayedCancle") {
        resetPlayed.style.display = "none";
        
    } else if (id == "btnOk") {
        screenResult.style.display = "none";
        if (!win) {
            if (settings.join == "Position") {
                for (var i = 0; i < pieceArray.length; i++) {
                    var grp = gameBox.getChildByName(pieceArray[i].gid);
                    grp.positioned = true;
                    trans = [[{ rotation: 0, x: pieceArray[i].xp, y: pieceArray[i].yp }, 1000, createjs.Ease.getPowOut(5)]];
                    tween("tween", grp, 0, false, false, trans, true);
                }
            } else if (settings.join == "Free") {
                var union = gameBox.getChildAt(0);
                union.x = union.y = 0;
                var dk = 0;
                for (var i = 0; i < gameBox.numChildren; i++) {
                    var grp = gameBox.getChildAt(i);
                    trace(grp.numChildren);
                    debugger;
                    for (var j = grp.numChildren - 1; j >= 0; j--) {
                        var cell = grp.getChildAt(j);
                        cell.uncache();
                        var info = pieceArray[cell.id];
                        cell.alpha = 0;
                        trans = [[{ alpha: 1, rotation: 0, x: info.xp, y: info.yp }, 1000, createjs.Ease.elasticOut]];
                        tween("tween", cell, dk * 5, false, false, trans, true);
                        union.addChild(cell);
                        dk++;
                    }
                }
            }
        }
    } else if (id == "btnDone") {
        
        screenRotate.visible = false;
        createOrientedImage();
    } else if (id == "btnInfoClose") {
        screenInfo.style.display = "none";
    }
    else if (id == "btnBackToImageSelection") {
        // Hide the result screen
        const current = getDataFromLocalStorage("current")
        const data = getDataFromLocalStorage("completed")
        if(data){
            saveDataToLocalStorage("completed", [...data,current]);
        }else{
            saveDataToLocalStorage("completed", [current]);
        }
        if(current){
            clearItemFromLocalStorage('current');
        }
        populateGallery(parseInt(settings.folderIndex));
        screenResult.style.display = "none";

        // Show the appropriate screen based on the image selection method
        if (settings.image == "Drop Inside" || settings.image == "Camera") {
            screenSetup.visible = true;
        } else if (settings.image == "Gallery") {
            screenGallery.style.display = "block";
        }
    }
    else if (id == "btnInfo") {
        screenInfo.style.display = "block";
    }
}
/*
==================================================================
This function runs when user finalize the orientatio of image.
Supported values are 0, 90, 180 and 270.
It is recomended to set the rotation that match with screen
resolution.
==================================================================
*/
function createOrientedImage() {
    var bitmap = new createjs.Bitmap(selectedPic);
    if (settings.orient == 90) {
        bitmap.regX = 0;
        bitmap.regY = bitmap.image.height;
    } else if (settings.orient == 180) {
        bitmap.regX = bitmap.image.width;
        bitmap.regY = bitmap.image.height;
    } else if (settings.orient == 270) {
        bitmap.y = bitmap.image.width;
    }
    bitmap.rotation = settings.orient;
    if (settings.orient == 90 || settings.orient == 270) {
        ovenCanvas.width = bitmap.image.height;
        ovenCanvas.height = bitmap.image.width;
    } else {
        ovenCanvas.width = bitmap.image.width;
        ovenCanvas.height = bitmap.image.height;
    }
    while (tray.numChildren != 0) {
        tray.removeChildAt(0);
    }
    tray.addChild(bitmap);
    oven.update();
    tray.snapToPixel = true;
    var image1 = new Image();
    image1.onload = function (e) { onImageLoaded(e) };
    image1.src = ovenCanvas.toDataURL("image/png", 1);
    screenSize.style.display = "block";
}
/*
==================================================================
On executing this function it will show the setupScreen and reset
all the game values
==================================================================
*/
function exitGame() {
    reset();
    timeOn = false;
    header.visible = false;
    gameBox.visible = false;
    hintBox.visible = false;
    screenConfirm.style.display = "none";
    screenResult.style.display = "none";
    screenSetup.visible = true;
    createjs.Sound.stop();
}
/*
==================================================================
This function reset all the required varialbes.
==================================================================
*/
function reset() {
    win = true;
    warnActivated = false;
    var txtTime = header.getChildByName("txtTime");
    txtTime.color = "#ffffff";
    createjs.Tween.removeTweens(txtTime);
    txtTime.scale = 1
}
/*
==================================================================
This function will show the confirmation screen if you are if
inGame is true
==================================================================
*/
function showConfirm() {
    screenConfirm.style.display = "block";
}
/*
==================================================================
This function will reset and reload the game keeping all the settings
as it is but only the jigsaw puzzle shapes will re-create
==================================================================
*/
function replay() {
    reset();
    screenResult.style.display = "none";
    createJigsawPuzzle();
}
/*
==================================================================
gridAction is an event listener triggered by Gird component which
is loacated in screenGallery
==================================================================
*/
function gridActions(e) {
    saveDataToLocalStorage("current",e[1]);
    settings.pic = "assets/galleries/" + galleryDir[settings.folderIndex].folder + "/" + e[1];
    getImageMetadata(settings.pic);
    screenGallery.style.display = "none";
    // screenSize.style.display = "block";
}
/*
==================================================================
listAction is an event listener triggered by List component which
is loacated in screenCategory and screenSize
==================================================================
*/
function listActions(e) {
    if (e[0] == "category") {
        settings.folderIndex = e[1];
        populateGallery(parseInt(settings.folderIndex));
        screenCategory.style.display = "none";
        screenGallery.style.display = "block";
    } else if (e[0] == "size") {
        settings.sizeIndex = e[1];
        screenSize.style.display = "none";
        trace("Index:" + settings.sizeIndex);
        createJigsawPuzzle();
    }
}
/*
==================================================================
This fucntion will populate image gallery Grid component.
==================================================================
*/
function populateGallery(index) {
    galleryItems = [];
    var files = galleryDir[index].files;
    for (var i = 0; i < files.length; i++) {
        if (i % 2 !== 0 && Math.random() < 0.5) {
            galleryItems.push('ad700x340.png');
        }
        galleryItems.push(files[i]);
    }
    populateGrid("gallery", galleryItems);
}
/*
==================================================================
This fucntion will populate list componet for sizes.
==================================================================
*/
function populateSize(items) {
    populateList("size", items);
}
/*
==================================================================
This fucntion is a listener triggered when user start dragging a
piece of jigsaw puzzle.
==================================================================
*/
function dragCell(e) {
    var grp = e.target;
    grp.x = e.stageX + offset.x;
    grp.y = e.stageY + offset.y;
}
/*
==================================================================
Once you finalize orientation in screenRotate this function then
execute.
==================================================================
*/
function finalizeOrientation(e) {
    imgRot.rotation = 0;
    settings.orient = 0;
    while (imgRot.numChildren != 0) imgRot.removeChildAt(0);
    var bitmap = new createjs.Bitmap(e.target);
    bitmap.regX = bitmap.image.width / 2;
    bitmap.regY = bitmap.image.height / 2;
    var s = 300 / bitmap.image.height;
    bitmap.scale = s;
    imgRot.addChild(bitmap);
    stage.update();
    screenRotate.visible = true;
}
/*
==================================================================
This function handle three type of event mousedown, pressmove and
pressup.
==================================================================
*/
function onTouch(e) {
    if (e.type == "mousedown") {
        grp = e.target;
        debug.innerHTML = grp.getBounds().width + " x " + grp.getBounds().height;
        downTime = new Date();
        dx = e.stageX;
        dy = e.stageY;
        offset = { x: grp.x - dx, y: grp.y - dy };
        dragStage.addChild(grp);
        dragStage.update();
        canvas.style.zIndex = 3;
        dragCanvas.style.zIndex = 4;
        stage.update();
        dragCanvas.style.display = "block";
    } else if (e.type == "pressmove") {
        if (settings.join == "Free" || (settings.join == "Position" && !e.target.positioned)) {
            var grp = e.target;
            grp.x = e.stageX + offset.x;
            grp.y = e.stageY + offset.y;
            dragStage.update();
        }
    } else if (e.type == "pressup") {
        var grp = e.target;
        var cell = grp.getChildAt(0);
        gameBox.addChild(grp);
        canvas.style.zIndex = 4;
        dragCanvas.style.zIndex = 3;
        stage.update();
        dragStage.update();
        var elapse = new Date() - downTime;
        if (settings.join == "Position" && !e.target.positioned && grp.numChildren == 1 && settings.rotation == "Yes" && Math.abs(e.stageX - dx) <= tapTolerance && Math.abs(e.stageY - dy) <= tapTolerance && elapse <= 250) {
            drag = false;
            cell.rotation += 90;
            if (cell.rotation == 360) cell.rotation = 0;
        } else if (settings.join == "Free" && grp.numChildren == 1 && settings.rotation == "Yes" && Math.abs(e.stageX - dx) <= tapTolerance && Math.abs(e.stageY - dy) <= tapTolerance && elapse <= 250) {
            drag = false;
            cell.rotation += 90;
            if (cell.rotation == 360) cell.rotation = 0;
        } else {
            drag = true;
            if (cell.rotation == 0) {
                if (settings.join == "Free" || (settings.join == "Position" && !e.target.positioned)) {
                    checkAfterRelease(grp);
                }
            }
        }
    }
}
/*
==================================================================
This function is used to toggle loop audio.
The button located in game header is responsible to handle this event
==================================================================
*/
function toggleMute(stage) {
    if (stage) {
        volume = 0;
    } else {
        volume = 1;
    }
    loopAudio.volume = volume;
}
/*
==================================================================
This function is used to toggle play pause.
The button located in game header is responsible to handle this event
==================================================================
*/
function togglePlay(state) {
    if (state) {
        gameBox.visible = false;
        hintBox.visible = false;
        timeElapsed += new Date() - startTime;
        timeOn = false;
    } else {
        gameBox.visible = true;
        hintBox.visible = true;
        startTime = new Date();
        timeOn = true;
    }
}
/*
==================================================================
This function runs after
1. Game completed successfully. (Elapse Time mode)
2. You win! (Limit Time mode)
3. You Lose! (Limit Time mode)
==================================================================
*/
function showResult() {
    lock.style.display = "none";
    screenResult.style.display = "block";
    var txtResult = document.getElementById("txtResult");
    var txtScore = document.getElementById("txtScore");

    if (settings.time == "Elapse") {
        playEventSound("complete", 250);
        txtResult.innerHTML = "Congratulation!"
        txtScore.innerHTML = "You have completed (" + row + "x" + col + ") Jigsaw Puzzle in " + header.getChildByName("txtTime").text;
    } else if (settings.time == "Limit") {
        txtResult.innerHTML = win ? "You Win!" : "You Lose!";
        if (win) {
            playEventSound("complete", 250);
            txtScore.innerHTML = "Well Done";
        } else {
            playEventSound("lose", 250);
            txtScore.innerHTML = "Try Again";
        }
    }
    inGame = false;
}
/*
==================================================================
This function is a createjs timer based on framerate.
This function handle canvas redraw mechanism.
For optimization it is necessary to call update only when required
If stage containing 200 nested items update after 60 mili-second
then this will slow down the overall performance. So in order to
handle this we need to set which stage need to be update.
==================================================================
*/
function tictic() {
    if (tStage == "stage") {
        stage.update();
    }
    else if (tStage == "dragStage") {
        dragStage.update();
    }
    if (timeOn) {
        var ctime = new Date();
        if (ctime != startTime) {
            var t1 = parseInt((ctime - startTime + timeElapsed) / 1000);
            if (settings.time == "Limit") {
                var t2 = timeLimit - t1
                var t = convertNumberToTime(t2);
                if (t2 == warnAt && !warnActivated) {
                    warnActivated = true;
                    var txtTime = header.getChildByName("txtTime");
                    txtTime.color = "#ff0000";
                    trans = [[{ scale: 1.25 }, 250], [{ scale: 1 }, 250]];
                    tween("tween", txtTime, 250, true, true, trans, true);
                }
            } else if (settings.time == "Elapse") {
                t = convertNumberToTime(t1);
            }
            header.getChildByName("txtTime").text = t;
            stage.update();
            if (timeLimit - t1 == 0 && settings.time == "Limit") {
                timeOn = false;
                win = false;
                showResult();
            }
        }
    }
}
/*
==================================================================
createjs library also support tween.
this function is used for animation of any canvas object.
==================================================================
*/
function tween(id, element, delay, loop, reverse, trans, autoPlay, fun) {
    var anim = createjs.Tween.get(element, { loop: loop, reversed: reverse });
    anim.wait(delay);
    for (var i = 0; i < trans.length; i++) {
        anim.to(trans[i][0], trans[i][1], trans[i][2]);
    }
    if (fun != undefined) {
        anim.call(fun);
    }
    if (!autoPlay) {
        anim.setPaused(true);
    }
}
/*
==================================================================
In order to get the dimension of image we need to first get its
metadata information. To do so we have to first load the image.
This function is actually preload image before scaling, cutting
for jigsaw pieces or applying filters on it.
==================================================================
*/
function getImageMetadata(file) {
    var img = new Image();
    selectedPic = file;
    img.addEventListener("imgLoaded", function (e) { finalizeOrientation(e); }, false);
    var imageLoadedEvent = new Event('imgLoaded');
    img.onload = function (e) {
        img.dispatchEvent(imageLoadedEvent);
    }
    img.src = file;
}
/*
==================================================================
This function is used to disable some browser events.
1. mouse right click
2. print screen
3. Ctrl + Shift + I
4. Ctrl + Shift + J
5. Ctrl + S
6. Ctrl + U
7. F11
8. F12
==================================================================
*/
function disableEvents() {
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        return;
    }, false);
    document.addEventListener("keyup", function (e) { disablePrintScreenEvent(e); }, false);
    function disablePrintScreenEvent(e) {
        if (e.keyCode == 44) {
            var tempElement = document.createElement("input");
            tempElement.style.cssText = "width:0!important;padding:0!important;border:0!important;margin:0!important;outline:none!important;boxShadow:none!important;";
            document.body.appendChild(tempElement);
            tempElement.value = ' ' // Empty string won't work!
            tempElement.select();
            document.execCommand("copy");
            document.body.removeChild(tempElement);
        }
    }
    document.addEventListener("keydown", function (e) {
        if (e.keyCode == 18) {
            disableAction(e);
        }
        // "I" key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
            disableAction(e);
        }
        // "J" key
        if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
            disableAction(e);
        }
        // "S" key + macOS
        if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
            disableAction(e);
        }
        // "U" key
        if (e.ctrlKey && e.keyCode == 85) {
            disableAction(e);
        }
        // "F12" key
        if (event.keyCode == 123) {
            disableAction(e);
        }
        // "F11" key
        if (event.keyCode == 122) {
            disableAction(e);
        }
    }, false);
    function disableAction(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
        e.preventDefault();
        return false;
    }
}