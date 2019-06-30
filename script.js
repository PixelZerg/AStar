//prototypes
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//https://gist.github.com/Nicholas-Swift/003e1932ef2804bebef2710527008f44#file-astar-py

// colours
const C_BACKG = '#222';
const C_FORE = '#ccc';
const C_FORE_DIM = '#666';

var size = 40;
var delay = 5; // delay in ms

var downPos = null;

var c = document.getElementById('c'),
    cx = c.getContext('2d');

var maze = [
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var positions = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];

//classes
class Node {

    constructor(parent, position) {
        this.parent = parent;
        this.position = position;

        // a star params
        this.g = 0;
        this.h = 0;
        this.f = 0;
    }

}

async function astar(maze, start, end) {
    console.log("doing astar: "+start+" - "+end);
    // graphics
    draw();

    // create start node
    var startNode = new Node(null, start);
    var endNode = new Node(null, end);

    // open and closed lists initialisation
    var openList = [];
    var closedList = [];

    // add the start node
    openList.push(startNode);

    // loop until find end
    while (openList.length > 0) {
        // get current node
        var curNode = openList[0];
        var curIndex = 0;
        
        for(var i = 0; i < openList.length; i++){
            if(openList[i].f < curNode.f){
                curNode = openList[i];
                curIndex = i;
            }
        }

        // draw();
        // drawSquare(curNode.position,"#fff");
        // await sleep(delay);

        // pop cur off open list, add to closed list
        openList.splice(curIndex,1);
        closedList.push(curNode);

        // found the goal
        if(curNode.position.equals(endNode.position)){
            console.log("found goal");
            var path = [];
            cur = curNode;
            while(cur != null){
                path.push(cur.position);
                cur = cur.parent;
            }
            // console.log(path.reverse());
            drawPath(path.reverse());
            return;
        }

        // generate children
        var children = [];
        for(var i = 0; i < positions.length; i++){
            // console.log("gen children: "+positions[i]);
            // new node position
            nodePos = [curNode.position[0]+positions[i][0], curNode.position[1]+positions[i][1]];
            // console.log(nodePos);

            // make sure within range
            if(nodePos[1] > maze.length - 1||nodePos[1]<0|| nodePos[0]>maze[0].length-1 || nodePos[0]<0){
                continue;
            }

            // make sure walkable terrain
            if(maze[nodePos[1]][nodePos[0]]){
                continue;
            }

            // new node
            newNode = new Node(curNode, nodePos);

            // draw();
            drawSquare(newNode.position,"#bb3344d1");
            await sleep(delay);
            children.push(newNode);
        }

        for(var i = 0; i < children.length; i++){
            var shouldContinue = false;
            var child = children[i];

            // child is on the closed list
            for(var j = 0; j<closedList.length; j++){
                if(child.position.equals(closedList[j].position)){
                    shouldContinue = true;
                    break; //todo
                }
            }
            if(shouldContinue){continue;}

            // create the fgh values
            child.g = curNode.g+1;
            child.h = Math.pow((child.position[0] - endNode.position[0]),2) + Math.pow((child.position[1] - endNode.position[1]), 2);
            child.f = child.g + child.h;

            // child already in the open list
            for(var j = 0; j<openList.length; j++){
                openNode = openList[j];
                if(child.position.equals(openNode.position) && child.g > openNode.g){
                    shouldContinue = true;
                    break;
                }
            }
            if(shouldContinue){continue;}

            // add the child to the open list
            openList.push(child);
        }

    }
}

function drawMaze(maze) {
    //implement this, Manas //nvm lol
    cx.fillStyle = C_FORE;
    cx.strokeStyle = C_FORE_DIM;

    for (var col = 0; col < maze.length; col++) {
        for (var row = 0; row < maze[col].length; row++) {
            if (maze[col][row]) {
                // cx.beginPath();
                cx.fillRect(row * size, col * size, size, size);
                cx.stroke();
            } else {
                // cx.beginPath();
                cx.rect(row * size, col * size, size, size);
                cx.stroke();
            }
        }
    }
}

function drawSquare(pos, colour){
    cx.fillStyle = colour;
    cx.fillRect(pos[0] * size, pos[1] * size, size, size);
    cx.stroke();
}

function drawPath(path){
    cx.strokeStyle = "#fff";
    cx.fillStyle = "#fff";
    cx.beginPath();
    cx.moveTo(path[0][0]*size+size/2,path[0][1]*size+size/2);
    for(var i = 1; i < path.length; i++){
        cx.lineTo(path[i][0]*size+size/2,path[i][1]*size+size/2);     
        cx.stroke();
    }

    // bug thing
    cx.beginPath();
    cx.moveTo(0,0);
    cx.lineTo(0,0);
    cx.stroke();
    cx.closePath();
}


function clearAll() {
    //background
    cx.fillStyle = C_BACKG;
    cx.clearRect(0, 0, c.width, c.height);
    cx.fillRect(0, 0, c.width, c.height);
    cx.stroke();
}

function draw(){
    clearAll();
    drawMaze(maze);
}

function initMaze(w,h){
    var ret = [];
    for(var row = 0; row<h; row++){
        var buf = [];
        for(var col = 0; col<w; col++){
            buf.push(0);
        }
        ret.push(buf);
    }
    maze = ret;
}

function random(){
    for(var row = 0; row<maze.length; row++){
        for(var col = 0; col<maze[row].length; col++){
            maze[row][col] = Math.random() >= 0.7 ? 1:0; 
        }
    }
}

(function () {
    function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;

        draw();
    }
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

    window.addEventListener('mousedown',function(e){
        // console.log(e);
        downPos = [Math.round(e.clientX/size),Math.round(e.clientY/size)];
    });
    c.addEventListener('mousemove',function(e){
        curPos = [Math.round((e.clientX-size)/size),Math.round((e.clientY-size)/size)];
        // draw();
        drawSquare(curPos,"#a7a7a7bd");
    });
    window.addEventListener('mouseup',function(e){
        // console.log(e);
        if(downPos != null){
            curPos = [Math.round(e.clientX/size),Math.round(e.clientY/size)];
            astar(maze,downPos,curPos);
        }
    });

    init();
    function init() {
        initMaze(c.width/size,c.height/size);
        random();
        draw();
    }
})();
