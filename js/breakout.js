rulesBtn = document.getElementById('rules-btn')
rules = document.getElementById('rules')
closeBtn = document.getElementById('close-btn')
startBtn = document.getElementById('start-btn')
var gameRunning = true;

// game interaction
canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')

score = 0
rowCount = 9
columnCount = 5

// ball properties
ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    size: 8,
    speed: 4,
    dx: 4,
    dy: -4,
}
// paddle properties
paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0,
}

// brick properties
brickInfo = {
    w: 64,
    h: 16,
    padding: 8,
    offsetX: 64,
    offsetY: 64,
    visible: true,
}
bricks = []
for (let i = 0; i < rowCount; i++) {
    bricks[i] = []
    for (let j = 0; j < columnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY
        bricks[i][j] = {x, y, ...brickInfo}
    }
}

// create ball
function drawBall() {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2)
    ctx.fillStyle = '#A2323B'
    ctx.fill()
    ctx.closePath()
}
// create paddle
function drawPaddle() {
    ctx.beginPath()
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = '#A2323B'
    ctx.fill()
    ctx.closePath()
}
// create score
function drawScore() {
    ctx.font = '24px VT323'
    ctx.fillText(`SCORE: ${score}`, canvas.width-96, 32)
}

// create bricks!!
function drawBricks () {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath()
            ctx.rect(brick.x, brick.y, brick.w, brick.h)
            ctx.fillStyle = brick.visible ? '#808080' : 'transparent';
            ctx.fill()
            ctx.closePath()
        })
    })
}

// draw paddle and ball and bricks...
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawPaddle()
    drawBall()
    drawScore()
    drawBricks()
}

// move the paddle
function movePaddle () {
    paddle.x = paddle.x + paddle.dx
    if (paddle.x < 0) {
        paddle.x = 0
    }
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w
    }
}



// detect input from user
function keyDown(e) {
    if (e.key == 'ArrowRight' || e.key == 'Right') {
        paddle.dx = paddle.speed
    }
    if (e.key == 'ArrowLeft' || e.key == 'Left') {
        paddle.dx = -1 * paddle.speed
    }
}
function keyUp(e) {
    if (e.key == 'ArrowRight' || e.key == 'Right' || e.key == 'ArrowLeft' || e.key == 'Left') {
        paddle.dx = 0
    }
}
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)

function moveBall() {
    ball.x = ball.x + ball.dx
    ball.y = ball.y + ball.dy

    //wall detection
    if (ball.y - ball.size < 0) {
        ball.dy = -1 * ball.dy
    }
    if (ball.y + ball.size > canvas.height) {
        ball.dy = -1 * ball.dy
        gameRunning = false;
    }

    if (ball.x + ball.size > canvas.width) {
        ball.dx = -1 * ball.dx
    }
    if (ball.x - ball.size < 0) {
        ball.dx = -1 * ball.dx
    }
    //paddle collision
    if (ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y) {
        ball.dy = -1 * ball.speed
    }
    //brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (ball.x - ball.size > brick.x && ball.x + ball.size < brick.x + brick.w && ball.y - ball.size < brick.y + brick.h && ball.y + ball.size > brick.y) {
                    ball.dy = -1 * ball.dy
                    brick.visible = false
                    increaseScore()
                }
            }
        })
    })
}

function increaseScore() {
    score++
    if (score == rowCount * columnCount) {
        score = 0
        showAllBricks()
    }
}

function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => {
            brick.visible = true
            ball.dx = 0
            ball.dy = 0
            paddle.speed = 0
        })
    })
}



// draw new frame

function update() {
    if (gameRunning = false) {
        return 0;
    }
    moveBall()
    movePaddle()
    draw()
    requestAnimationFrame(update)
}

// rules interaction
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show')
})

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show')
})

startBtn.addEventListener('click', () => {
    gameRunning = true;
    update()
    element = document.getElementById("start-btn")
    ball.x = 4
    ball.y = -4
    ball.x = canvas.width/2
    ball.y = canvas.height/2
    paddle.speed = 8
    score = 0
})

