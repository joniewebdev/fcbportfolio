//variables
let board;
let score = 0;
let rows = 4;
let columns = 4;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//slide gesture variables
let startX = 0;
let startY = 0;

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    // board = [
    //     [2, 4, 8, 32],
    //     [64, 128, 256, 512],
    //     [1024, 2048, 4096, 8192],
    //     [0, 0, 0, 0]
    // ];

    //losing board
    // board = [
    // 	[32, 8, 4, 0],
    //     [4, 128, 64, 256],
    //     [8, 32, 16, 2],
    //     [16, 2, 256, 1024]
    // ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div") //create tile

            tile.id = r.toString() + "-" + c.toString() //tile ID

            let num = board[r][c];

            updateTile(tile, num);

            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";

    tile.classList.add("tile"); //add class "tile"

    if (num > 0) {
        tile.innerText = num.toString(); //display number of the tile

        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

window.onload = function () {
    setGame();
}

function noMovement(previous, current) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (previous[r][c] !== current[r][c]) {
                console.log("may movement");
                return false;
            }
        }
    }
    console.log("no movement");
    return true;
}

function handleSlide(e) {
    console.log(e.code);

    let previousTile = board.map(row => row.slice());
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
        if (e.code == "ArrowLeft" || e.code == "KeyA") {
            slideLeft();
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        }
        else if (e.code == "ArrowRight" || e.code == "KeyD") {
            slideRight();
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        }
        else if (e.code == "ArrowUp" || e.code == "KeyW") {
            slideUp();
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        }
        else if (e.code == "ArrowDown" || e.code == "KeyS") {
            slideDown();
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        }
    }

    document.getElementById("score").innerText = score;

    setTimeout(() => {
        checkWin();
    }, 500);
    if (hasLost() == true) {

        setTimeout(() => {
            alert("Game Over! Sadx :( You have lost the game. Game will restart");
            restartGame();
            alert("Click any arrow key to restart");
        }, 100)
    }
}

document.addEventListener("keydown", handleSlide);

function filterZero(arr) {
    return arr.filter(num => num != 0);
}

function slide(arr) { //eto yung cause ng problema sa animation
    arr = filterZero(arr); //remove zeros

    for (let i = 0; i < arr.length - 1; i++) { //combine
        if (arr[i] == arr[i + 1]) {
            arr[i] *= 2;
            arr[i + 1] = 0;

            score += arr[i]; //score increment
        }
    }

    arr = filterZero(arr);

    while (arr.length < 4) { //add zero
        arr.push(0);
    }
    return arr; //final position
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];

        let originalRow = row.slice(); //for animation

        row = slide(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            //animation
            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }
            updateTile(tile, num);
        }

    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];

        let originalRow = row.slice(); //for animation

        row.reverse(); //difference ng left at right
        row = slide(row);

        row.reverse();
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //animation
            if (originalRow[c] !== num && num !== 0) {
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice(); //for animation

        col = slide(col);

        let changedIndices = []; //records
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changedIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //animation
            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

        let originalCol = col.slice(); //for animation

        col.reverse();
        col = slide(col);
        col.reverse();

        let changedIndices = []; //records
        for (let r = 0; r < rows; r++) {
            if (originalCol[r] !== col[r]) {
                changedIndices.push(r);
            }
        }

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];

            //animation
            if (changedIndices.includes(r) && num !== 0) {
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300)
            }

            updateTile(tile, num);
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false; //check muna whole board after mag false
}

function setTwo() {
    if (hasEmptyTile() == false) { //exit function pag walang empty tiles
        return;
    }
    let found = false;

    while (found == false) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        let chance = Math.random();
        if (board[r][c] == 0) {
            // Generate new tile 
            if (chance < 0.9) {
                board[r][c] = 2;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "2";
                tile.classList.add("x2");
                tile.style.animation = "zoom-in-two 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            else {
                board[r][c] = 4;
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                tile.innerText = "4";
                tile.classList.add("x4");
                tile.style.animation = "zoom-in-two 0.3s";
                setTimeout(() => {
                    tile.style.animation = "";
                }, 300);
            }
            found = true;
        }
    }
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 2048 && is2048Exist == false) {
                alert("You win! You got the 2048.");
                is2048Exist = true;
            }
            else if (board[r][c] == 4096 && is4096Exist == false) {
                alert("You got the 4096!");
                is4096Exist = true;
            }
            else if (board[r][c] == 8192 && is8192Exist == false) {
                alert("You got the 8192!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||

                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                return false;
            }
        }
    }
    return true;
}

function restartGame() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            board[r][c] = 0;
        }
    }
    score = 0;

    setTwo();
}

document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!e.target.className.includes("tile")) {
        return;
    }

    //disable scrolling feature
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (!e.target.className.includes("tile")) {
        return;
    }

    let diffX = startX - e.changedTouches[0].clientX;
    let diffY = startY - e.changedTouches[0].clientY;

    let previousTile = board.map(row => row.slice());
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            slideLeft(); // Call a function for sliding left
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        } else {
            slideRight(); // Call a function for sliding right
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        }
    }
    else {
        // Vertical swipe
        if (diffY > 0) {
            slideUp(); // Call a function for sliding up
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        } else {
            slideDown(); // Call a function for sliding down
            let currentTile = board.map(row => row.slice());
            if (noMovement(previousTile, currentTile) == false) {
                console.log("set two");
                setTwo();
            }
        }
    }

    document.getElementById("score").innerText = score;

    checkWin();

    // Call hasLost() to check for game over conditions
    if (hasLost()) {
        // Use setTimeout to delay the alert
        setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any key to restart");
        }, 100);
    }
});
