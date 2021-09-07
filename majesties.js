const NS = "http://www.w3.org/2000/svg";
const svg = document.getElementById("svg");
const square_size = 40;

function drawBoard(x0, y0, w, color0, color1){ 
    function square(x, y, dark) {
        const r = document.createElementNS(NS, "rect");
        r.height.baseVal.value = w;
        r.width.baseVal.value = w;
        r.x.baseVal.value = x0+x*w;
        r.y.baseVal.value = y0+y*w;
        r.style.fill = dark ? color0 : color1;
        return r
    }
    for (let i = 0; i < 8; i++ ) {
        for (let j = 0; j < 8; j++) {
            svg.appendChild(square(i, 7-j, (i+j+1)%2));
        }
    }
}

function overlay(x0, y0, w, board, color, opacity) {
    function square(x, y) {
        const r = document.createElementNS(NS, "rect");
        r.height.baseVal.value = w;
        r.width.baseVal.value = w;
        r.x.baseVal.value = x0+x*w;
        r.y.baseVal.value = y0+y*w;
        r.style.fill = color;
        r.style.opacity = opacity;
        return r
    }
    for (let i = 0; i < 8; i++ ) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j]) {
                console.log(i, j);
                svg.appendChild(square(i, 7-j));
            }
        }
    }
}

function circle() {
    let r = document.createElementNS(NS, "circle");
    r.r.baseVal.value = .4*square_size;
    r.style.fill = "black";
    r.style.display = "None";
    return r
}

blankBoard = () => Array.from(
    {length : 8}, () => Array.from(
        {length : 8}, () => false));

drawBoard(0, 0, square_size, "#C57837", "#FEC38D");


function plot(circles, vec) {
    console.log(cs);
    circles.forEach( c => {c.style.display = "None"});
    vec.forEach((pos, i) => {
        let c = circles[i];
        c.cx.baseVal.value = (2*i+1)*square_size/2;
        c.cy.baseVal.value = (2*(7-pos)+1)*square_size/2;
        c.style.display = "block";
    })
}


forbidden = blankBoard();

copy  = x=>x.map(y=>y);
copy2 = x=>x.map(copy);

cs = Array.from( {length : 8}, () => circle());
cs.forEach(cs => svg.appendChild(cs));

function* dfs(vec, forbidden, x) {
    if (x==8) yield vec;
    else for (let i = 0; i < 8; i++ ) {
        if (!forbidden[x][i]) {
            _vec = copy(vec);
            _vec.push(i)
            _forbidden = copy2(forbidden);
            for (let j = 1; j+x < 8; j++) {
                _forbidden[x+j][i] = true;
                if (i+j<8) _forbidden[x+j][i+j] = true;
                if (i-j>=0) _forbidden[x+j][i-j] = true;
            }
            yield* dfs(_vec, _forbidden, x+1);
        }
    }
}

gen = dfs([], blankBoard(), 0);
let s = 0;
function next() {
    if( solution = gen.next().value){
        console.time("calc");
        plot(cs, solution);
        console.log(solution, s);
        console.timeEnd("calc");
        s++;
    }
}