'use strict';
var shapes = [];
/*
===============================================================
getPieceArray function is used to create randomly all the jigsaw
pieces provided by row & cols
An array pieceArray will then be retured to its calling function
that holds all the necessary values which we need in order to cut
image into desired shapes
===============================================================
*/
function getPieceArray(row, col) {
    var newP
    var L, T, tIndex;
    var TLArray = new Array("ROBO", "ROBI", "RIBO", "RIBI");
    var TROArray = new Array("LOBO", "LOBI");
    var TRIArray = new Array("LIBO", "LIBI");
    var BLOArray = new Array("ROTO", "RITO");
    var BLIArray = new Array("ROTI", "RITI");
    var TMOArray = new Array("LOROBO", "LOROBI", "LORIBO", "LORIBI");
    var TMIArray = new Array("LIROBO", "LIROBI", "LIRIBO", "LIRIBI");
    var LMOArray = new Array("ROTOBO", "ROTOBI", "RITOBO", "RITOBI");
    var LMIArray = new Array("ROTIBO", "RITIBO", "ROTIBI", "RITIBI");
    var RMIArray = new Array("LOTOBO", "LOTOBI", "LOTIBO", "LOTIBI");
    var RMOArray = new Array("LITIBI", "LITOBI", "LITIBO", "LITIBI");
    var CLOTOArray = new Array("LOROTOBO", "LORITOBO", "LOROTOBI", "LORITOBI");
    var CLOTIArray = new Array("LOROTIBO", "LORITIBO", "LOROTIBI", "LORITIBI");
    var CLITOArray = new Array("LIROTOBO", "LIROTOBI", "LIRITOBO", "LIRITOBI");
    var CLITIArray = new Array("LIROTIBO", "LIRITIBI", "LIROTIBI", "LIRITIBO");
    var RMLOTOArray = new Array("LOTOBO", "LOTOBI");
    var RMLITIArray = new Array("LITIBO", "LITIBI");
    var RMLOTIArray = new Array("LOTIBO", "LOTIBI");
    var RMLITOArray = new Array("LITOBO", "LITOBI");
    var BMLOTOArray = new Array("LOROTO", "LORITO");
    var BMLITIArray = new Array("LIROTI", "LIRITI");
    var BMLOTIArray = new Array("LOROTI", "LORITI");
    var BMLITOArray = new Array("LIROTO", "LIRITO");
    var pieceArray = [];
    var i = 0;
    for (var r = 0; r < row; r++) {
        for (var c = 0; c < col; c++) {
            if (r == 0 && c == 0) {
                L = TLArray[createRandom(4)];
            } else if (r == 0 && c > 0 && c < col - 1) {
                if (L == "ROBO" || L == "ROBI" || L == "LOROBO" || L == "LIROBO" || L == "LOROBI" || L == "LIROBI") {
                    L = TMIArray[createRandom(4)];
                } else {
                    L = TMOArray[createRandom(4)];
                }
            } else if (r == 0 && c == col - 1) {
                if (L == "ROBO" || L == "ROBI" || L == "LOROBO" || L == "LIROBO" || L == "LOROBI" || L == "LIROBI") {
                    L = TRIArray[createRandom(2)];
                } else {
                    L = TROArray[createRandom(2)];
                }
            } else if (r > 0 && r < row - 1 && c == 0) {
                tIndex = (r - 1) * col + c;
                T = pieceArray[tIndex].shape;
                if (T == "ROBO" || T == "RIBO" || T == "ROTOBO" || T == "RITOBO" || T == "ROTIBO" || T == "RITIBO") {
                    L = LMIArray[createRandom(4)];
                } else {
                    L = LMOArray[createRandom(4)];
                }
            } else if (r < row - 1 && c < col - 1) {
                tIndex = (r - 1) * col + c;
                T = pieceArray[tIndex].shape;
                L = pieceArray[pieceArray.length - 1].shape;
                if ((L == "ROTOBO" || L == "ROTOBI" || L == "ROTIBO" || L == "ROTIBI" || L == "LOROTOBO" || L == "LOROTIBO" || L == "LIROTOBO" || L == "LOROTOBI" || L == "LIROTOBI" || L == "LIROTIBO" || L == "LOROTIBI" || L == "LIROTIBI")
                    && (T == "LOROBO" || T == "LIROBO" || T == "LORIBO" || T == "LIRIBO" || T == "LOROTOBO" || T == "LORITOBO" || T == "LOROTIBO" || T == "LIROTOBO" || T == "LIROTIBO" || T == "LORITIBO" || T == "LIRITOBO" || T == "LIRITIBO")) {
                    newP = CLITIArray[createRandom(4)];
                }
                if ((L == "RITOBO" || L == "RITOBI" || L == "RITIBO" || L == "RITIBI" || L == "LORITOBO" || L == "LORITOBI" || L == "LORITIBO" || L == "LIRITOBO" || L == "LIRITIBI" || L == "LIRITOBI" || L == "LORITIBI" || L == "LIRITIBO")
                    && (T == "LOROBI" || T == "LIROBI" || T == "LORIBI" || T == "LIRIBI" || T == "LOROTOBI" || T == "LORITOBI" || T == "LIROTOBI" || T == "LOROTIBI" || T == "LIRITIBI" || T == "LIROTIBI" || T == "LIRITOBI" || T == "LORITIBI")) {
                    newP = CLOTOArray[createRandom(4)];
                }
                if ((L == "ROTOBO" || L == "ROTOBI" || L == "ROTIBO" || L == "ROTIBI" || L == "LOROTOBO" || L == "LOROTIBO" || L == "LIROTOBO" || L == "LOROTOBI" || L == "LIROTOBI" || L == "LIROTIBO" || L == "LOROTIBI" || L == "LIROTIBI")
                    && (T == "LOROBI" || T == "LIROBI" || T == "LORIBI" || T == "LIRIBI" || T == "LOROTOBI" || T == "LORITOBI" || T == "LIROTOBI" || T == "LOROTIBI" || T == "LIRITIBI" || T == "LIROTIBI" || T == "LIRITOBI" || T == "LORITIBI")) {
                    newP = CLITOArray[createRandom(4)];
                }
                if ((L == "RITOBO" || L == "RITOBI" || L == "RITIBO" || L == "RITIBI" || L == "LORITOBO" || L == "LORITOBI" || L == "LORITIBO" || L == "LIRITOBO" || L == "LIRITIBI" || L == "LIRITOBI" || L == "LORITIBI" || L == "LIRITIBO")
                    && (T == "LOROBO" || T == "LIROBO" || T == "LORIBO" || T == "LIRIBO" || T == "LOROTOBO" || T == "LORITOBO" || T == "LOROTIBO" || T == "LIROTOBO" || T == "LIROTIBO" || T == "LORITIBO" || T == "LIRITOBO" || T == "LIRITIBO")) {
                    newP = CLOTIArray[createRandom(4)];
                }
                L = newP;
            } else if (r > 0 && r < row - 1 && c == col - 1) {
                tIndex = (r - 1) * col + c;
                T = pieceArray[tIndex].shape;
                L = pieceArray[pieceArray.length - 1].shape;
                if ((L == "ROTOBO" || L == "ROTOBI" || L == "ROTIBO" || L == "ROTIBI" || L == "LOROTOBO" || L == "LOROTIBO" || L == "LIROTOBO" || L == "LOROTOBI" || L == "LIROTOBI" || L == "LIROTIBO" || L == "LOROTIBI" || L == "LIROTIBI")
                    && (T == "LOBO" || T == "LIBO" || T == "LOTOBO" || T == "LITOBO" || T == "LOTIBO" || T == "LITIBO")) {
                    newP = RMLITIArray[createRandom(2)];
                }
                if ((L == "RITOBO" || L == "RITOBI" || L == "RITIBO" || L == "RITIBI" || L == "LORITOBO" || L == "LORITOBI" || L == "LORITIBO" || L == "LIRITOBO" || L == "LIRITIBI" || L == "LIRITOBI" || L == "LORITIBI" || L == "LIRITIBO")
                    && (T == "LOBI" || T == "LIBI" || T == "LOTOBI" || T == "LITOBI" || T == "LOTIBI" || T == "LITIBI")) {
                    newP = RMLOTOArray[createRandom(2)];
                }
                if ((L == "ROTOBO" || L == "ROTOBI" || L == "ROTIBO" || L == "ROTIBI" || L == "LOROTOBO" || L == "LOROTIBO" || L == "LIROTOBO" || L == "LOROTOBI" || L == "LIROTOBI" || L == "LIROTIBO" || L == "LOROTIBI" || L == "LIROTIBI")
                    && (T == "LOBI" || T == "LIBI" || T == "LOTOBI" || T == "LITOBI" || T == "LOTIBI" || T == "LITIBI")) {
                    newP = RMLITOArray[createRandom(2)];
                }
                if ((L == "RITOBO" || L == "RITOBI" || L == "RITIBO" || L == "RITIBI" || L == "LORITOBO" || L == "LORITOBI" || L == "LORITIBO" || L == "LIRITOBO" || L == "LIRITIBI" || L == "LIRITOBI" || L == "LORITIBI" || L == "LIRITIBO")
                    && (T == "LOBO" || T == "LIBO" || T == "LOTOBO" || T == "LITOBO" || T == "LOTIBO" || T == "LITIBO")) {
                    newP = RMLOTIArray[createRandom(2)];
                }
                L = newP;
            } else if (r == row - 1 && c == 0) {
                tIndex = (r - 1) * col + c;
                T = pieceArray[tIndex].shape;
                if (T == "ROBO" || T == "RIBO" || T == "ROTOBO" || T == "RITOBO" || T == "ROTIBO" || T == "RITIBO") {
                    L = BLIArray[createRandom(2)];
                } else {
                    L = BLOArray[createRandom(2)];
                }
            } else if (r == row - 1 && c < col - 1) {
                tIndex = (r - 1) * col + c;
                T = pieceArray[tIndex].shape;
                L = pieceArray[pieceArray.length - 1].shape;
                if ((L == "LOROTO" || L == "LIROTO" || L == "LOROTI" || L == "LIROTI" || L == "ROTO" || L == "ROTI") && (T == "LOROBO" || T == "LIROBO" || T == "LORIBO" || T == "LIRIBO" || T == "LOROTOBO" || T == "LORITOBO" || T == "LOROTIBO" || T == "LIROTOBO" || T == "LIROTIBO" || T == "LORITIBO" || T == "LIRITOBO" || T == "LIRITIBO")) {
                    newP = BMLITIArray[createRandom(2)];
                } else if ((L == "LORITO" || L == "LORITI" || L == "LIRITO" || L == "LIRITI" || L == "RITO" || L == "RITI") && (T == "LOROBI" || T == "LIROBI" || T == "LORIBI" || T == "LIRIBI" || T == "LOROTOBI" || T == "LORITOBI" || T == "LIROTOBI" || T == "LOROTIBI" || T == "LIRITIBI" || T == "LIROTIBI" || T == "LIRITOBI" || T == "LORITIBI")) {
                    newP = BMLOTOArray[createRandom(2)];
                } else if ((L == "LOROTO" || L == "LIROTO" || L == "LOROTI" || L == "LIROTI" || L == "ROTO" || L == "ROTI") && (T == "LOROBI" || T == "LIROBI" || T == "LORIBI" || T == "LIRIBI" || T == "LOROTOBI" || T == "LORITOBI" || T == "LIROTOBI" || T == "LOROTIBI" || T == "LIRITIBI" || T == "LIROTIBI" || T == "LIRITOBI" || T == "LORITIBI")) {
                    newP = BMLITOArray[createRandom(2)];
                } else if ((L == "LORITO" || L == "LORITI" || L == "LIRITO" || L == "LIRITI" || L == "RITO" || L == "RITI") && (T == "LOROBO" || T == "LIROBO" || T == "LORIBO" || T == "LIRIBO" || T == "LOROTOBO" || T == "LORITOBO" || T == "LOROTIBO" || T == "LIROTOBO" || T == "LIROTIBO" || T == "LORITIBO" || T == "LIRITOBO" || T == "LIRITIBO")) {
                    newP = BMLOTIArray[createRandom(2)];
                }
                L = newP;
            } else if (r == row - 1 && c == col - 1) {
                tIndex = (r - 1) * col + c;
                T = pieceArray[tIndex].shape;
                L = pieceArray[pieceArray.length - 1].shape;
                if ((L == "LOROTO" || L == "LIROTO" || L == "LOROTI" || L == "LIROTI" || L == "ROTO" || L == "ROTI") && (T == "LOTOBO" || T == "LITOBO" || T == "LOTIBO" || T == "LITIBO" || T == "LOBO" || T == "LIBO")) {
                    newP = "LITI";
                } else if ((L == "LORITO" || L == "LORITI" || L == "LIRITO" || L == "LIRITI" || L == "RITO" || L == "RITI") && (T == "LOTOBI" || T == "LITOBI" || T == "LOTIBI" || T == "LITIBI" || T == "LOBI" || T == "LIBI")) {
                    newP = "LOTO";
                } else if ((L == "LOROTO" || L == "LIROTO" || L == "LOROTI" || L == "LIROTI" || L == "ROTO" || L == "ROTI") && (T == "LOTOBI" || T == "LITOBI" || T == "LOTIBI" || T == "LITIBI" || T == "LOBI" || T == "LIBI")) {
                    newP = "LITO";
                } else if ((L == "LORITO" || L == "LORITI" || L == "LIRITO" || L == "LIRITI" || L == "RITO" || L == "RITI") && (T == "LOTOBO" || T == "LITOBO" || T == "LOTIBO" || T == "LITIBO" || T == "LOBO" || T == "LIBO")) {
                    newP = "LOTI";
                }
                L = newP;
            }
            pieceArray.push({ id: i, shape: L, xpos: c, ypos: r, angle: 0, positioned: false, neighbour: [], regX: 0, regY: 0, s: 1, xp: 0, yp: 0 });
            i++;
        }
    }
    return pieceArray;
}
/*
===============================================================
This function is used to get a random value
===============================================================
*/
function createRandom(r) {
    var n = parseInt(r * Math.random());
    return n;
}
/*
===============================================================
This function is use to get the path information on providing
id of shape.
===============================================================
*/
function getPath(id) {
    var sData = shapeData[settings.shapeDataIndex];
    for (var i = 0; i < sData.length; i++) {
        if (sData[i].cell == id) {
            return sData[i];
        }
    }
    return -1;
}
/*
===============================================================
This function is used to create vector shape provide in shape
geometry
===============================================================
*/
function getShapes(id, sx) {
    // var dpi = 1;
    var shp = getPath(id);
    var str = shp.path;
    var item = str.split(" ");
    var cmd = "";
    var sy = sx;
    var cell = new createjs.Shape();
    var effect = new createjs.Shape();
    var outline = new createjs.Shape();
    var stroke = new createjs.Shape();

    cell.graphics.clear();
    effect.graphics.clear();
    stroke.graphics.clear();
    outline.graphics.clear();

    cell.graphics.beginFill("rgba(0,0,255,1)");
    effect.graphics.beginFill("rgba(255, 255, 255, 1)");
    stroke.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,.5)");
    outline.graphics.setStrokeStyle(1).beginStroke("rgba(0,0,0,.5)");
    for (var i = 0; i < item.length; i++) {
        if (item[i] == "M" || item[i] == "L" || item[i] == "Q") {
            cmd = item[i];
            if (item[i] == "M") {
                cell.graphics.moveTo(item[i + 1] * sx, item[i + 2] * sy);
                outline.graphics.moveTo(item[i + 1] * sx, item[i + 2] * sy);
                effect.graphics.moveTo(item[i + 1] * sx, item[i + 2] * sy);
                stroke.graphics.moveTo(item[i + 1] * sx, item[i + 2] * sy);
                i += 2;
            } else if (item[i] == "L") {
                cell.graphics.lineTo(item[i + 1] * sx, item[i + 2] * sy);
                outline.graphics.lineTo(item[i + 1] * sx, item[i + 2] * sy);
                effect.graphics.lineTo(item[i + 1] * sx, item[i + 2] * sy);
                stroke.graphics.lineTo(item[i + 1] * sx, item[i + 2] * sy);
                i += 2;
            } else if (item[i] == "Q") {
                cell.graphics.quadraticCurveTo(item[i + 1] * sx, item[i + 2] * sy, item[i + 3] * sx, item[i + 4] * sy);
                outline.graphics.quadraticCurveTo(item[i + 1] * sx, item[i + 2] * sy, item[i + 3] * sx, item[i + 4] * sy);
                effect.graphics.quadraticCurveTo(item[i + 1] * sx, item[i + 2] * sy, item[i + 3] * sx, item[i + 4] * sy);
                stroke.graphics.quadraticCurveTo(item[i + 1] * sx, item[i + 2] * sy, item[i + 3] * sx, item[i + 4] * sy);
                i += 4;
            }
        } else {
            if (cmd == "L") {
                cell.graphics.lineTo(item[i] * sx, item[i + 1] * sy);
                outline.graphics.lineTo(item[i] * sx, item[i + 1] * sy);
                effect.graphics.lineTo(item[i] * sx, item[i + 1] * sy);
                stroke.graphics.lineTo(item[i] * sx, item[i + 1] * sy);
                i += 1;
            } else if (cmd == "Q") {
                cell.graphics.quadraticCurveTo(item[i] * sx, item[i + 1] * sy, item[i + 2] * sx, item[i + 3] * sy);
                outline.graphics.quadraticCurveTo(item[i] * sx, item[i + 1] * sy, item[i + 2] * sx, item[i + 3] * sy);
                effect.graphics.quadraticCurveTo(item[i] * sx, item[i + 1] * sy, item[i + 2] * sx, item[i + 3] * sy);
                stroke.graphics.quadraticCurveTo(item[i] * sx, item[i + 1] * sy, item[i + 2] * sx, item[i + 3] * sy);
                i += 3;
            }
        }

    }
    cell.graphics.endFill();
    outline.graphics.endFill();
    effect.graphics.endFill();
    stroke.graphics.endFill();
    shapes = [];
    shapes.push({ cell: cell, outline: outline, effect: effect, stroke: stroke, dim: shp.dim });
    return shapes;
}
