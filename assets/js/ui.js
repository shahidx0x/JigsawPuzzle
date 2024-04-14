/*
===============================================================
This javascript file is holding collection of UI components
for createjs and DOM componets
===============================================================
*/
var uiDragY;
var drag;
var list;
var grid;
var offset;
/*
===============================================================
Div is a DOM componet function use to create div
===============================================================
*/
function Div(id, container, position, zindex, transformOrigin, x, y, width, height, backgroundColor, color, backgroundRepeat, backgroundImage) {
    var div = document.createElement("DIV");
    div.setAttribute("id", id);
    div.style.position = position;
    div.style.transformOrigin = transformOrigin;
    div.style.width = width;
    div.style.height = height;
    div.style.zIndex = zindex;
    div.style.left = x;
    div.style.top = y;
    div.style.font = "12px Berlin Sans FB";
    div.style.backgroundColor = backgroundColor;
    div.style.color = color;
    if (backgroundRepeat) div.style.backgroundRepeat = backgroundRepeat;
    if (backgroundImage) {
        div.style.backgroundImage = backgroundImage;
        div.style.backgroundSize = "contain";
    }
    if (container == "body") {
        document.body.appendChild(div);
    } else {
        document.getElementById(container).appendChild(div);
    }
    return div;
}
/*
===============================================================
Canvas is a DOM componet function use to create canvas
===============================================================
*/
function Canvas(canvasId, container) {
    var canvas = document.createElement("canvas");
    canvas.setAttribute("id", canvasId);
    canvas.style.position = "absolute";
    canvas.width = game.clientWidth * dpi;
    canvas.height = game.clientHeight * dpi;
    canvas.style.width = game.clientWidth + "px";
    canvas.style.height = game.clientHeight + "px";
    container.appendChild(canvas);
    return canvas;
}
/*
===============================================================
addText is a createjs componet function use to create labels or
editable text
===============================================================
*/
function addText(id, container, text, font, size, color, x, y, shadow) {
    var txt = new createjs.Text();
    if (shadow) {
        txt.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
    }
    txt.id = txt.name = id;
    txt.text = text;
    txt.font = size * dpi + "px " + font;
    txt.color = color;
    txt.x = (x == "c") ? (gw * dpi - txt.getBounds().width) / 2 : x * dpi;
    txt.y = (y == "c") ? (gh * dpi - txt.getBounds().height) / 2 : y * dpi;
    container.addChild(txt);
    return txt;
}
/*
===============================================================
addBitmap is a createjs componet function use to create bitmap
===============================================================
*/
function addBitmap(id, container, src, x, y) {
    var img = new Image();
    img.id = img.name = id;
    img.onload = function (e) {
        var bitmap = new createjs.Bitmap(e.target);
        bitmap.x = (x == "c") ? (gw * dpi - bitmap.image.width) / 2 : x * dpi;
        bitmap.y = (y == "c") ? (gh * dpi - bitmap.image.height) / 2 : y * dpi;
        container.addChild(bitmap);
        return bitmap;
    }
    img.src = src;
}
/*
===============================================================
Container is a createjs componet function use to create component
A container in createjs is used bound/group set of displayable 
objects
===============================================================
*/
function Container(id, container, w, h, show) {
    var con = new createjs.Container();
    con.id = con.name = id;
    var bg = new createjs.Shape();
    bg.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0, 0, w * dpi, h * dpi);
    con.addChild(bg);
    con.visible = show;
    container.addChild(con);
    return con;
}
/*
===============================================================
Button is a createjs componet function use to create buttons
Button support text or image
===============================================================
*/
function Button(id, container, shp, fillColor, borderColor, borderThickness, pivot, padding, arc, caption, font, size, textColor, icon, scale, x, y, show) {
    var btn = new createjs.Container();
    var box = new createjs.Container();
    btn.mouseChildren = false;
    btn.id = btn.name = id;
    btn.uitype = "button";

    if (caption) {
        var item = new createjs.Text();
        item.font = size * dpi + "px " + font;
        item.color = textColor;
        item.text = caption;
        var bound = item.getBounds();
    } else {
        var item = new createjs.Container();
        var icon1 = new createjs.Bitmap(icon);
        var iconShadow = new createjs.Bitmap(icon);
        iconShadow.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
        item.addChild(iconShadow, icon1);
        item.scale = scale;
        item.setBounds(0, 0, 32 * scale, 32 * scale);
        var bound = item.getBounds();
    }
    var shape = new createjs.Shape();
    var pad = padding;
    var a = arc * dpi;
    if (shp == 'rect') {
        shape.graphics.beginFill(fillColor).drawRect(0, 0, bound.width + 4 * pad, bound.height + 2 * pad);
        item.x = 2 * pad;
        item.y = pad;
    } else if (shp == 'roundrect') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawRoundRect(0, 0, bound.width + 4 * pad, bound.height + 2 * pad, a);
        item.x = 2 * pad;
        item.y = pad;
    } else if (shp == 'square') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawRect(0, 0, bound.width + 2 * pad, bound.width + 2 * pad);
        item.x = pad;
        item.y = (bound.width + 2 * pad - bound.height) / 2;
    } else if (shp == 'roundsquare') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawRoundRect(0, 0, bound.width + 2 * pad, bound.width + 2 * pad, a);
        item.x = pad;
        item.y = (bound.width + 2 * pad - bound.height) / 2;
    } else if (shp == 'circle') {
        shape.graphics.setStrokeStyle(borderThickness, 1, 1, 0, true).beginStroke(borderColor).beginFill(fillColor).drawCircle(0, 0, bound.width / 2 + pad);
        item.x = -bound.width / 2;
        item.y = -bound.height / 2;
    }
    shape.shadow = new createjs.Shadow("rgba(0,0,0,0.5)", 0, 0, 5);
    if (pivot == "TL") {
        if (shp == "circle") {
            box.x = (bound.width + 2 * pad) / 2;
            box.y = (bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "TC") {
        if (shp == "circle") {
            box.y = (bound.width + 2 * pad) / 2;
        } else {
            box.x = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "TR") {
        if (shp == "circle") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = (bound.width + 2 * pad) / 2;
        } else {
            box.x = -(bound.width + 2 * pad);
        }
    } else if (pivot == "ML") {
        if (shp == "circle") {
            box.x = (bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.y = -(bound.height + 2 * pad) / 2;
        }
        else if (shp == "square" || shp == "roundsquare") {
            box.y = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "MC") {
        if (shp == "circle") {

        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.height + 2 * pad) / 2;
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "MR") {
        if (shp == "circle") {
            box.x = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.height + 2 * pad) / 2;
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.width + 2 * pad) / 2;
        }
    } else if (pivot == "BL") {
        if (shp == "circle") {
            box.x = (bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.y = -(bound.height + 2 * pad);
        } else if (shp == "square" || shp == "roundsquare") {
            box.y = -(bound.width + 2 * pad);
        }
    } else if (pivot == "BC") {
        if (shp == "circle") {
            box.y = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.height + 2 * pad);
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad);
        }
    } else if (pivot == "BR") {
        if (shp == "circle") {
            box.x = -(bound.width + 2 * pad) / 2;
            box.y = -(bound.width + 2 * pad) / 2;
        } else if (shp == "rect" || shp == "roundrect") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.height + 2 * pad);
        } else if (shp == "square" || shp == "roundsquare") {
            box.x = -(bound.width + 2 * pad);
            box.y = -(bound.width + 2 * pad);
        }
    }
    box.addChild(shape);
    box.addChild(item);
    btn.addChild(box);

    btn.x = (x == "c") ? (gw * dpi - (bound.width + 2 * pad)) / 2 : x * dpi;
    btn.y = (y == "c") ? (gh * dpi - (bound.height + 2 * pad)) / 2 : y * dpi;
    btn.visible = show;
    container.addChild(btn);
    btn.addEventListener("click", function (e) { btnActions(e); });
    return btn;
}
/*
===============================================================
Radio is a createjs componet function use to create radio buttons
===============================================================
*/
function Radio(id, container, pivot, label, opt, selectedIndex, baseColor, strokeThickness, strokeColor, selectedColor, font, color, scale = 1, x, y) {
    var rdoGrp = new createjs.Container();
    rdoGrp.opt = opt;
    rdoGrp.uitype = "radio";
    rdoGrp.name = rdoGrp.id = id;

    var txt = new createjs.Text();
    txt.text = label;
    txt.font = "20px " + font;
    txt.color = color;
    rdoGrp.addChild(txt);
    var bound = txt.getBounds();
    for (var i = 0; i < opt.length; i++) {
        var rdo = new createjs.Container();
        rdo.uitype = "radioItem"
        rdo.id = rdo.name = opt[i];
        rdo.x = 15 + bound.width;
        id = opt[i];
        rdoGrp.addChild(rdo);
        rdo.selectedIndex = i;
        rdo.selectedLabel = opt[i];
        var dot = new createjs.Shape();
        dot.id = dot.name = 'dot';
        var r = 8
        dot.graphics.setStrokeStyle(strokeThickness).beginStroke(strokeColor).beginFill(baseColor).drawCircle(0, 0, r);
        dot.y = bound.height / 2;
        rdo.addChild(dot);

        var dotSelected = new createjs.Shape();
        dotSelected.id = dotSelected.name = 'dotSelected';
        dotSelected.graphics.beginFill(selectedColor).drawCircle(0, 0, r / 2);
        dotSelected.y = bound.height / 2;
        rdo.addChild(dotSelected);
        dotSelected.visible = false;
        if (i == selectedIndex) {
            rdoGrp.selectedIndex = selectedIndex
            rdoGrp.selectedLabel = opt[i];
            dotSelected.visible = true;
        }
        txt = new createjs.Text();
        txt.x = r + 5;
        txt.text = opt[i];
        txt.font = "20px " + font;
        txt.color = color;
        rdo.addChild(txt);
        bound = rdo.getBounds();
        var rectangle = new createjs.Shape();
        rectangle.id = rectangle.name = "btnRadio";
        rectangle.graphics.beginFill("rgba(255,0,0,.5)").drawRect(0, 0, bound.width + 12 + r, bound.height);
        rectangle.x = dot.x - r;
        rectangle.y = bound.y;
        rdo.hitArea = rectangle

        bound = rdoGrp.getBounds();
        rdo.mouseChildren = false;
        bound.width = bound.width + 5;
        rdo.addEventListener("click", function (e) {
            var radio = e.target;
            updateRadio(radio.parent, radio.selectedIndex);
            if (e.target.id == "Free") {
                updateRadio(screenSetup.getChildByName("setupBox").getChildByName("throw"), 0);
            } else if (e.target.id == "Single") {
                updateRadio(screenSetup.getChildByName("setupBox").getChildByName("join"), 1);
            }
        });
    }
    container.addChild(rdoGrp);
    bound = rdoGrp.getBounds();
    rdoGrp.scale = scale * dpi;

    if (pivot == "TL") {
        rdoGrp.regX = 0;
        rdoGrp.regY = 0;
    } else if (pivot == "TC") {
        rdoGrp.regX = rdoGrp.getBounds().width / 2;
        rdoGrp.regY = 0;
    } else if (pivot == "TR") {
        rdoGrp.regX = rdoGrp.getBounds().width;
        rdoGrp.regY = 0;
    } else if (pivot == "ML") {
        rdoGrp.regX = 0;
        rdoGrp.regY = rdoGrp.getBounds().height / 2;
    } else if (pivot == "MC") {
        rdoGrp.regX = rdoGrp.getBounds().width / 2;
        rdoGrp.regY = rdoGrp.getBounds().height / 2;
    } else if (pivot == "MR") {
        rdoGrp.regX = rdoGrp.getBounds().width;
        rdoGrp.regY = rdoGrp.getBounds().height / 2;
    } else if (pivot == "BL") {
        rdoGrp.regX = 0;
        rdoGrp.regY = rdoGrp.getBounds().height;
    } else if (pivot == "BC") {
        rdoGrp.regX = rdoGrp.getBounds().width / 2;
        rdoGrp.regY = rdoGrp.getBounds().height;
    } else if (pivot == "BR") {
        rdoGrp.regX = rdoGrp.getBounds().width;
        rdoGrp.regY = rdoGrp.getBounds().height;
    }
    bound = rdoGrp.getBounds();
    rdoGrp.x = (x == "c") ? (gw * dpi - dpi * bound.width * scale) / 2 : x * dpi;
    rdoGrp.y = (y == "c") ? (gh * dpi - bound.height * scale) / 2 : y * dpi;
    return rdoGrp;
}
/*
===============================================================
This function handle the update event once the user switch the 
option. 
===============================================================
*/
function updateRadio(rdoGrp, index) {
    for (i = 1; i < rdoGrp.numChildren; i++) {
        rdo = rdoGrp.getChildAt(i);
        var dotSelected = rdo.getChildByName("dotSelected");
        dotSelected.visible = false;
        if (i - 1 == index) {
            rdoGrp.selectedIndex = index;
            rdoGrp.selectedLabel = rdoGrp.opt[index];
            dotSelected.visible = true;
        }
    }
}
/*
===============================================================
addDOMText is a DOM componet function use to create text
===============================================================
*/
function addDOMText(divId, parentDivId, show, w, h, curve, x, y, bgcolor, bdrThickness, bdrStyle, bdrColor, txt, align, color, bold, size, fontFamily) {
    var pid = document.getElementById(parentDivId);
    var div = window.document.createElement('div');
    div.setAttribute('id', divId);
    (w != 0) ? (div.style.width = w + "px") : "";
    (h != 0) ? (div.style.height = h + "px") : "";
    var xpos = (x == 'c') ? (parseInt(pid.style.width) - parseInt(w)) / 2 : x;
    var ypos = (y == 'c') ? (parseInt(pid.style.height) - parseInt(h)) / 2 : y;
    div.style.top = ypos + "px";
    div.style.left = xpos + "px";
    div.style.textAlign = align;
    div.style.backgroundColor = bgcolor;
    div.style.border = bdrThickness + "px " + bdrStyle + " " + bdrColor;
    div.style.borderRadius = curve + "px";
    div.style.MozBorderRadius = curve + "px";
    div.style.WebkitBorderRadius = curve + "px";

    div.style.fontSize = "12px";
    div.style.margin = "0px";
    div.style.float = "left";
    div.style.overflowX = "hidden";
    div.style.overflowY = "hidden";
    div.style.color = color;
    div.style.position = "absolute";
    div.style.fontWeight = (bold) ? "bold" : "";
    div.style.fontSize = size + "px";
    div.style.align = "center";
    div.style.display = (show) ? "block" : "none";
    div.style.fontFamily = fontFamily;
    div.innerHTML = txt;
    document.getElementById(parentDivId).appendChild(div);
}
/*
===============================================================
addDOMButton is a DOM componet function use to create button
===============================================================
*/
function addDOMButton(divId, parentDivId, show, label, w, h, curve, bgcolor, tcolor, size, bold, x, y, bdrThickness, bdrStyle, bdrColor, bdrAlpha, shadow) {
    var pid = document.getElementById(parentDivId);
    var div = window.document.createElement('div');
    div.setAttribute('id', divId);
    div.style.width = w + "px";
    div.style.height = h + "px";
    var xpos = (x == 'c') ? (parseInt(pid.style.width) - parseInt(w)) / 2 : x;
    var ypos = (y == 'c') ? (parseInt(pid.style.height) - parseInt(h)) / 2 : y;
    div.style.left = xpos + "px";
    div.style.top = ypos + "px";
    div.style.background = bgcolor;
    div.style.borderRadius = curve + "px";
    div.style.MozBorderRadius = curve + "px";
    div.style.WebkitBorderRadius = curve + "px";
    div.style.position = "absolute";
    div.style.float = "left";
    div.style.color = tcolor;
    div.style.border = bdrThickness + "px " + bdrStyle + " " + bdrColor;
    div.style.boxShadow = "0px 0px " + shadow + "px #000000";
    div.style.position = "absolute";
    div.style.fontSize = size + "px";
    div.style.display = (show) ? "block" : "none";
    div.style.fontWeight = (bold) ? "bold" : "";
    div.style.fontFamily = "Arial, Geneva, sans-serif";
    div.style.textAlign = "center";
    var txtDiv = window.document.createElement('div');
    txtDiv.setAttribute('id', divId);
    txtDiv.style.cursor = 'pointer';
    txtDiv.innerHTML = label;
    if (parentDivId == "body") {
        window.document.body.appendChild(div);
    } else {
        document.getElementById(parentDivId).appendChild(div);
    }
    div.appendChild(txtDiv);
    div.onclick = btnActions;
    txtDiv.style.padding = (parseInt(div.offsetHeight) - parseInt(txtDiv.offsetHeight)) / 2 + "px";
  
}
 
/*
===============================================================
List is a DOM componet function use to create List
===============================================================
*/
function List(screenId, listId, title, backButtonId) {
    var div = Div(screenId, "body", "absolute", 10, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,0.5)");
    addDiv(screenId + "Frame", screenId, true, gw - 50, gh - 100, 10, "#ffffff", 50 / 2, 100 / 2, 0, "solid", "rgba(0,0,0,0)", 10);
    var frame = document.getElementById(screenId + "Frame");
    frame.style.textAlign = "center";
    frame.style.color = "#0099ff";
    var fontsize = (device == "smart") ? 10 * dpi : 30;
    frame.style.font = fontsize + "px Berlin Sans FB";
    frame.style.fontWeight = "bold";
    frame.style.paddingTop = "25px";
    frame.innerHTML = title;
    addDiv(listId, screenId + "Frame", true, gw - 50, gh - 175, 0, "#ffffff", 0, 75, 0, "solid", "rgba(0,0,0,0)", 0);

    addImage(backButtonId, screenId, true, .5, 0, "assets/images/back.svg", " ", gw - 70, 60, false, 10);

    document.body.appendChild(div);
    div.style.display = "none";
    return div;
}
/*
===============================================================
populateList is used to populate list component
===============================================================
*/
function populateList(listId, items) {
    // var div = document.getElementById(listId);
    // var listBox = div.getElementById("listBox");
    var list = document.getElementById(listId);
    var str = "<ul>";
    for (var i = 0; i < items.length; i++) {
        str += "<li style='cursor:pointer;' id='" + i + "' onclick=listActions(['" + listId + "',this.id]);>" + items[i] + "</li>";
    }
    str += "</ul>";
    list.innerHTML = str;
}
/*
===============================================================
Grid is a DOM componet function use to create Grid
===============================================================
*/
function Grid(screenId, gridId, title, backButtonId) {
    var div = Div(screenId, "body", "absolute", 10, "0 0", 0, 0, "100%", "100%", "rgba(0,0,0,.5)");
    addDiv(screenId + "Frame", screenId, true, gw - 50, gh - 100, 10, "#ffffff", 50 / 2, 100 / 2, 0, "solid", "rgba(0,0,0,0)", 10);
    var frame = document.getElementById(screenId + "Frame");
    frame.style.textAlign = "center";
    frame.style.color = "#0099ff";
    var fontsize = (device == "smart") ? 10 * dpi : 30;
    frame.style.font = fontsize + "px Berlin Sans FB";
    frame.style.fontWeight = "bold";
    frame.style.paddingTop = "25px";
    frame.innerHTML = title;
    addDiv(gridId, screenId + "Frame", true, gw - 50, gh - 200, 10, "#ffffff", 0, 75, 0, "solid", "rgba(0,0,0,0)", 0);

    addImage(backButtonId, screenId, true, .5, 0, "assets/images/back.svg", " ", gw - 70, 60, false, 10);

    document.body.appendChild(div);
    div.style.display = "none";
    return div;
}
/*
===============================================================
populateGrid is used to populate grid component
===============================================================
*/
function populateGrid(gridId, items) {
    console.log(items);
  var grid = document.getElementById(gridId);
  var completed = getDataFromLocalStorage('completed') || [];
  var str = "<div class='wrap'>";
  for (var i = 0; i < items.length; i++) {
    str += "<div class='box'>";
    str += "<div class='boxInner'>";
    var src = "assets/galleries/" + galleryDir[settings.folderIndex].folder + "/" + items[i];
    if(completed.includes(items[i])){
      str += "<img id='" + items[i] + "' onclick=gridActions(['"+gridId+"',this.id]); src='" + src + "' style='filter: grayscale(100%);'/>";
    } else {
      str += "<img id='" + items[i] + "' onclick=gridActions(['"+gridId+"',this.id]); src='" + src + "''/>";
    }
    str += "</div>";
    str += "</div>";
  }
  str += "</div>";
  grid.innerHTML = str;
}


/*
===============================================================
addImage is a DOM componet function use to add image
===============================================================
*/
function addImage(divId, parentDivId, show, s, curve, urlImage, imgLink, x, y, showBorder, shadow) {
    var pid = document.getElementById(parentDivId);
    var img = window.document.createElement('img');
    img.setAttribute('id', divId);
    img.src = urlImage;
    img.style.position = "absolute";
    img.style.transform = "scale(" + s + ")";
    img.style.left = x + "px";
    img.style.top = y + "px";
    img.onclick = btnActions;
    document.getElementById(parentDivId).appendChild(img);
    return img;
}
/*
===============================================================
addDiv is a DOM componet function use to add div
===============================================================
*/
function addDiv(divId, parentDivId, show, w, h, curve, bgcolor, x, y, bdrThickness, bdrStyle, bdrColor, shadow) {
    var pid = document.getElementById(parentDivId);
    var div = window.document.createElement('div');
    div.setAttribute('id', divId);
    div.style.width = w + "px";
    div.style.height = h + "px";
    var xpos = (x == 'c') ? (parseInt(pid.style.width) - parseInt(w)) / 2 : x;
    var ypos = (y == 'c') ? (parseInt(pid.style.height) - parseInt(h)) / 2 : y;
    div.style.left = xpos + "px";
    div.style.top = ypos + "px";
    div.style.margin = "0px";
    div.style.boxShadow = "0px 0px " + shadow + "px rgba(0,0,0,0.25)";
    div.style.border = bdrThickness + "px " + bdrStyle + " " + bdrColor;
    div.style.background = bgcolor;
    div.style.borderRadius = curve + "px";
    div.style.MozBorderRadius = curve + "px";
    div.style.WebkitBorderRadius = curve + "px";
    div.style.overflowY = "auto";
    div.style.overflowX = "hidden";
    div.style.position = "absolute";
    div.style.display = (show) ? "block" : "none";
    if (parentDivId == "body") {
        window.document.body.appendChild(div);
    } else {
        document.getElementById(parentDivId).appendChild(div);
    }
    return div;
}
/*
===============================================================
This function is simply an ulternate for console.log
===============================================================
*/
function trace(msg) {
    console.log(msg);
}
