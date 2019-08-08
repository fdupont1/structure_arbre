window.onload = init;

var listTas = [3, 5, 6,6,5, 10, 11, 12, 13, 20, 21, 22, 23, 24 ,25,15,4,8,5,3,5,6,8,6,7,8,5,4,6,78,5];
//var listTas = [10];
var min;

var cellDim = 25;
var cellPad = 1;
var height = 50;

var canvas;
var ctx;
var text = document.getElementById('text');


function init() {
  canvas = document.getElementById('listAnimation');
    if(!canvas) {
        alert("Impossible de récupérer le canvas");
        return;
    }
  ctx = canvas.getContext('2d');
    if(!ctx) {
        alert("Impossible de récupérer le context du canvas");
        return;
    }
  ctx.textAlign = 'center';
  List.init(ctx)
  List.draw(20, canvas.height-95);
  Pile.init();
  Pile.draw(0);
  }

var Pile = {
  
  nodeRadius: 15,
  spaceHeight:50,
  height: 0,
  nodeFillColor: "silver",
  valueColor: "blue",
  nodeXY: [],
  padX: 4,
  padY: 10,
  
  init: function() {
    
    var width = canvas.width - 2*this.padX;
    var height = canvas.height - 2*this.padY
    
    for (var e=0; e<5; e++) {
      decX = width/(2**(e+1));
      x = Math.round(decX);
      y = this.padY+e*this.spaceHeight;
      for (var l=1; l<(2**e)+1; l++) {
        this.nodeXY.push([this.padX+x, this.padY+y]);
        x += 2*decX;  
      }
    } 
  },
    
  draw: function(index) {
    // if not leaf, draw son
    if (2*index+1 < listTas.length) {
      // left son
      var fg = this.draw(2*index+1)
      this.drawEdge(index, fg);
      this.drawNodeXY(this.nodeXY[fg], fg, listTas[fg]);
      // if right son
      if (2*index+2 < listTas.length) {
        var fd = this.draw(2*index+2);
        this.drawEdge(index, fd);
        this.drawNodeXY(this.nodeXY[fd], fd, listTas[fd]);
        }
      }
    if (listTas.length > 0 && index<1) {
      this.drawNodeXY(this.nodeXY[index], index, listTas[index]);
      }
    
    return index;
    },
    
  refresh: function() {
    ctx.clearRect(0,0, canvas.width, 5*this.spaceHeight);
    this.draw(0);
   },
   
  drawEdge: function(index1, index2) {
    var pos1 = this.nodeXY[index1];
    var pos2 = this.nodeXY[index2];
    ctx.beginPath();
    ctx.moveTo(pos1[0], pos1[1]);
    ctx.lineTo(pos2[0], pos2[1]);
    ctx.stroke();
    },
      
  drawNode: function(index) {
    var pos = this.nodeXY[index];
    this.drawNodeXY(pos, index, listTas[index]);
    },
    
  clearNodeXY: function(pos) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.nodeRadius, 0, 2 * Math.PI);
    ctx.fill();
    },
    
  drawNodeXY: function(pos,index, value, color = this.nodeFillColor) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.nodeRadius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(pos[0], pos[1], this.nodeRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.font = "16px Helvetica";
    ctx.fillStyle = this.valueColor;
    ctx.fillText(value, pos[0], pos[1]+5);
    ctx.font = "10px Helvetica";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(index, pos[0], pos[1]+28);
    }  
  }
  
var List = {

  xList: 0,
  yList: 0,
  height: height = cellDim,
  cellWidth: cellWidth = cellDim,
  cellPadding: cellPadding = cellPad,
  valueColor: "blue",
  ctx: 0,
  
  init: function() {
    ctx.lineWidth = 2;
    this.cellPadding = cellPad+ctx.lineWidth;
    },
    
  draw: function (x, y) {
    this.xList = x;
    this.yList = y;
    for (var c=0; c < listTas.length; c++) {
      this.drawCell(c);
      }
    },
    
  drawCell: function(index) {
    var x;
    var y;
    if (index>14) {
      x = (index-15)*(cellDim + this.cellPadding)+this.xList;
      y = this.yList+47;
    }
    else {
      x = index*(cellDim + this.cellPadding)+this.xList;
      y = this.yList;
    }
    ctx.strokeRect(x, y, this.height, this.height);
    ctx.font = "18px Helvetica";
    ctx.fillStyle = this.valueColor;
    ctx.fillText(listTas[index], x+this.height/2, y+this.height*0.7);
    ctx.fillStyle = "#0095DD";
    ctx.font = "12px Helvetica";
    ctx.fillText(index, x+this.height/2, y+38);
    },
    
  clear: function() {
    ctx.clearRect(this.xList-10, this.yList-10 , 480,200);
    }, 
     
  clearCell: function(index) {
    x = index*(cellDim + this.cellPadding)+this.xList-ctx.lineWidth;
    ctx.clearRect(x + ctx.lineWidth/2, this.yList - ctx.lineWidth/2 ,
     this.height+ctx.lineWidth, this.height+ctx.lineWidth + 18);
    },
    
  clearValue: function(index) {
    x = index*(cellDim + this.cellPadding)+this.xList;
    ctx.clearRect(x + ctx.lineWidth/2, this.yList+ ctx.lineWidth/2 ,
     dim-ctx.lineWidth, dim-ctx.lineWidth);
    },
    
  pop: function() {

    this.clearCell(listTas.length-1);
    listTas.pop();
    this.draw(this.xList, canvas.height-95);
    },
    
  push: function(value) {
    listTas.push(value);
    this.drawCell(listTas.length-1);
    },
    
  refresh: function() {
    this.clear();
    this.draw(20, canvas.height-95);
    }
  }

function printLog(message) {
  var log = document.getElementById('log');
  log.innerHTML += "> " + message + "<br>";
  document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
}

function listPop() {
  if (listTas.length > 0) {
    printLog("suppression liste :");
    printLog("<s>["+(listTas.length-1)+"]</s>");
    List.pop();
    Pile.refresh();
    }
  };

function push() {
  let temp = document.getElementById('valuePush').value
  List.push(parseInt(temp));
  Pile.refresh();
  printLog("insertion liste :");
  printLog(temp+"-> ["+(listTas.length-1)+"]");
  }

function parseList(list) {
  list = list.split(",");
  // delete first [ if exist
  if (list[0][0] == '[') {
    list[0] = list[0].replace('[','');
    }
  // delete last ] if exist
  if (list[list.length-1][list[list.length-1].length-1] == ']') {
    list[list.length-1] = list[list.length-1].replace(']','');
    }
  for (var c=0; c < list.length; c++) {
    list[c] = parseInt(list[c]);
    }
  return list
  }

function create() {
  var list = document.getElementById('listCreate').value;
    list = parseList(list);
    listTas = list;
    List.refresh();
    Pile.refresh();
    printLog("création tas :");
    printLog("-> ["+listTas+"]");
  }

function shuffle() {
  printLog("Mélange tas");
  var temp = [];
  var copy = listTas.slice();
  for (var i=0; i<listTas.length; i++) {
    temp.push(copy.splice(Math.floor(Math.random() * copy.length),1)[0]);
  }
  listTas = temp;
  List.refresh();
  Pile.refresh();
}


