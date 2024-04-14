'use strict';
var volume = 1;
var loopAudio;
var loopAudioPlaying = false;
var imagePath = 'assets/images/';
var audioPath = 'assets/audios/';
var galleryPath = 'assets/galleries/';
var soundFileLoaded = 0;
var queue = new createjs.LoadQueue();
var assets = [
    { type: "sound", id: "bg", path: audioPath, src: "bg.mp3", data: "" },
    { type: "sound", id: "complete", path: audioPath, src: "complete.mp3", data: "" },
    { type: "sound", id: "correct", path: audioPath, src: "correct.mp3", data: "" },
    { type: "sound", id: "lose", path: audioPath, src: "lose.mp3", data: "" }
];
/*
============================================================================
This function is used to load all audio files (loop audio and event audios)
============================================================================
*/
function loadAssets() {
    queue.on("progress", handleProgress);
    createjs.Sound.on("fileload", handleFileLoad);
    for (var i = 0; i < assets.length; i++) {
        queue.loadFile({ id: assets[i].id, src: assets[i].path + assets[i].src });
        createjs.Sound.registerSound(audioPath + assets[i].src, assets[i].id);
    }
}
/*
============================================================================
handleFileLoad is an event listener. It invoke once a file successfully loaded
============================================================================
*/
function handleFileLoad(e) {
    soundFileLoaded++;
    if (soundFileLoaded == assets.length) {
        screenSplash.getChildByName("btnStart").visible = true;
        screenSplash.getChildByName("percent").visible = false;
        debug.innerHTML += "<br>checkAllDone";
        populateCategory();
    }
}
/*
============================================================================
handleProgress is an event listener. It showed the progress in the splash
screen.
============================================================================
*/
function handleProgress(e) {
    screenSplash.getChildByName("percent").text = "Loaded: " + parseInt(e.progress * 100) + "%";
}
/*
============================================================================
This function is used to play loop audio.
============================================================================
*/
function playLoopAudio(audioId) {
    if (loopAudio) loopAudio.stop();
    loopAudioPlaying = true;
    createjs.Sound.stop();
    loopAudio = createjs.Sound.play(audioId, { interrupt: createjs.Sound.INTERRUPT_ANY, loop: -1 });
    loopAudio.volume = volume;
}
/*
============================================================================
This function is used to play event audio.
============================================================================
*/
function playEventSound(audioId, delay = 0, monitor = false, keepAudio = false) {
    var eventAudio = audioId;
    setTimeout(function () {
        if (!keepAudio) {
            createjs.Sound.stop();
        }
        var evtAudio = createjs.Sound.play(audioId);
        evtAudio.volume = volume;
        if (monitor) {
            evtAudio.on("complete", this.onEventAudioComplete, this);
        }
    }, delay);
}

