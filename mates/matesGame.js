const constSide = 12;
const maxBalls = 50;
var balls_count = 5;
var highestScore = 0;
var side;
var survived;
var flashDiv;
var goal;
var scoreValEl;
var scoreDiv;
var nextGoal;
var numInput;
var spillBtn;
var ballsCounter;
var highestScoreEl;
var matesCount;
var currentScore = 0;
class MatesGame {

    constructor() {
        this.setupGame();
        spillBtn.addEventListener('click', e => this.spillBalls(e));
        numInput.addEventListener("keyup", e => this.enterBalls(e));
        document.addEventListener("keydown", e => this.keyEventHandler(e));
    }
    setupGame() {
        this.getHTMLelements();
        scoreValEl.innerHTML = 0;
        matesCount = 0;
        currentScore = 0;
        side = constSide;
        survived = true;
        this.resetStyles();
        numInput.value = balls_count;
        stroke(0);
        strokeWeight(0);
        this.setupBalls();
        this.resetPos();
    }
    getHTMLelements() {
        scoreValEl = document.getElementById('scoreValEl');
        scoreDiv = document.getElementById('scoreDiv');
        nextGoal = document.getElementById('nextGoal');
        highestScoreEl = document.getElementById('highestScore');
        flashDiv = document.getElementById('flashDiv');
        numInput = document.getElementById('number');
        spillBtn = document.getElementById('spillBtn');
        ballsCounter = document.getElementById('balls-counter');
    }
    resetStyles() {
        scoreValEl.style.textDecoration = 'none';
        scoreValEl.style.color = 'black';
        scoreValEl.style.fontWeight = 'normal';

        scoreDiv.style.textDecoration = 'none';
        scoreDiv.style.color = 'black';
        scoreDiv.style.fontWeight = 'normal';
    }
    setFlash(color) {
        flashDiv.style.backgroundColor = color;
    }
    resetPos() {
        this.acc = createVector(0, 0);
        this.vel = createVector(0, 0);
        this.pos = createVector(20, height - side);
    }
    setupBalls() {
        ballsCounter.style.display = "table";
        var mBalls = [];
        for (var i = 0; i < balls_count; i++) {
            mBalls.push(new Ball({
                x: random(0, width),
                y: 0,
                di: random(5, 50),
                color: new Color(Math.round(random(0, 255)), Math.round(random(0, 255)), Math.round(random(0, 255)))
            }));
        }
        this._balls = new Balls(mBalls);
    }
    play() {
        background(bg);
        this._balls.show();
        this._balls.update();
        goal = Math.round(50 * balls.length / targetDi);
        nextGoal.innerHTML = goal;

        square(this.pos.x, this.pos.y, side);

        this.acc.set(0, 0);
        this.vel.add(this.acc);
        this.pos.add(this.vel);


        if (keyIsDown(UP_ARROW)) {
            this.vel.x = 0
            var a = createVector(0, -1.5);
            if (this.vel.y <= -2)
                a = createVector(0, 0);
            this.acc.add(a);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
        }

        if (keyIsDown(DOWN_ARROW)) {
            this.vel.x = 0
            var a = createVector(0, 1.5);
            if (this.vel.y > 2)
                a = createVector(0, 0);

            this.acc.add(a);
            this.vel.add(this.acc);
            this.pos.add(this.vel);

        }

        if (keyIsDown(RIGHT_ARROW)) {
            this.vel.y = 0
            var a = createVector(1.5, 0);
            if (this.vel.x > 2)
                a = createVector(0, 0);

            this.acc.add(a);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
        }

        if (keyIsDown(LEFT_ARROW)) {
            this.vel.y = 0
            var a = createVector(-1.5, 0);
            if (this.vel.x <= -2)
                a = createVector(0, 0);

            this.acc.add(a);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
        }
        this.edges();
        this.intersect();
    }
    intersect() {
        this.setFlash("black");
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            var isTargetBool =
                ball.color.r === targetFill.r &&
                ball.color.g === targetFill.g &&
                ball.color.b === targetFill.b;
            var rad = ball.di / 2;

            var left = Math.min(this.pos.x, ball.pos.x - rad);
            var right = Math.max(this.pos.x + side, ball.pos.x + rad);

            var top = Math.min(this.pos.y, ball.pos.y - rad);
            var down = Math.max(this.pos.y + side, ball.pos.y + rad);
            var touched = rad + (side / 2);
            if (right - left > down - top) {
                //compare with horizontal
                if (Math.abs(ball.pos.x - (this.pos.x + side / 2)) <= touched) {
                    if (isTargetBool && survived)
                        this.achievedGoal();

                    else if (!isTargetBool)
                        this.failedGoal();

                }
            }

            else {
                //compare with vertical
                if (Math.abs(ball.pos.y - (this.pos.y + side / 2)) <= touched) {
                    if (isTargetBool && survived)
                        this.achievedGoal();

                    else if (!isTargetBool)
                        this.failedGoal();
                }
            }
        }
    }
    achievedGoal() {
        balls.pop();
        side++;
        matesCount++;

        var randomColor = `rgb(${random(255)},${random(255)},${random(255)})`;
        this.setFlash(randomColor);
        currentScore += goal;
        scoreValEl.style.fontWeight = 'bold';
        scoreValEl.innerHTML = currentScore;
        scoreDiv.style.fontWeight = 'bold';
        if (currentScore > highestScore) {
            highestScore = currentScore;
            highestScoreEl.innerHTML = highestScore;
        }

    }
    failedGoal() {
        survived = false;
        scoreValEl.style.textDecoration = 'line-through';
        scoreDiv.style.textDecoration = 'line-through';
        scoreValEl.style.color = 'red';
        scoreDiv.style.color = 'red';

        for (let index = 0; index < balls.length; index++) {
            var ball = balls[index];
            ball.vel.x = 0;
        }
    }
    edges() {
        if (this.pos.y >= height - side) {
            this.pos.y = height - side;
            this.vel.y *= -0.2;
        }

        if (this.pos.y <= 0) {
            this.pos.y = 0;
            this.vel.y *= 0.2;
        }

        if (this.pos.x >= width - side) {
            this.pos.x = width - side;
            this.vel.x *= -0.2;
        }

        if (this.pos.x <= 0) {
            this.pos.x = 0;
            this.vel.x *= 0.2;
        }
    }

    spillBalls() {
        this.setBallsNum(numInput.value);
    }

    setBallsNum(num) {
        if (num > maxBalls) {
            numInput.value = maxBalls;
            num = maxBalls;
            alert('Sorry, you have to pay for extra balls');
        }
        else if (num <= 0) {
            num = 0;
        }
        balls_count = num;
        this.setupGame();
    }

    enterBalls(event) {
        if (event.keyCode === 13)//enter key
        {
            event.preventDefault();
            spillBtn.click();
        }
    }
    keyEventHandler(event) {
        if (event.keyCode === 82)//R to restart
        {
            this.setupGame();
        }
        else if (event.keyCode === 107)//+ to add 1 ball and restart
        {
            this.setBallsNum(++balls_count);
        }
        else if (event.keyCode === 109)//- to subtract 1 ball and restart
        {
            this.setBallsNum(--balls_count);
        }
    }
}
