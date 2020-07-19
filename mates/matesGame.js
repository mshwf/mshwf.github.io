const CONST_SIDE = 12;
const MAX_BALLS = 50;
const DEFAULT_WIDTH = 800;
const DEFAULT_Height = 800;

const PLUS_CODE = 107;
const MINUS_CODE = 109;
const ENTER_CODE = 13;
const SPACE_CODE = 32;
const R_CODE = 82;
var balls_count = 5;
var highestScore = 0;
var highestLevel = 0;
var currentScore = 0;
var isBgImg = true;
var pause = true;
var side;
var survived;
var goal;
var matesCount;
var bgImg;
var isDm = false;

//#region HTML tags
var scoreValEl;
var scoreDiv;
var highestScoreEl;
var highestLevelEl;
var flashDiv;
var numInput;
var startBtn;
var ballsCounter;
var bgDiv;
var check_bg;
var imgSource;
var dmDiv;
var check_dm;
var codeSpans;
//#endregion

class MatesGame {

    constructor() {
        this.getHTMLelements();
        this.getUrlParams();

        this.setDarkMode();
        createCanvas(DEFAULT_WIDTH, DEFAULT_Height).parent("canvas");
        this.addListeners();
        this.setupGame();
        bgImg = loadImage('../assets/sea.jpg');
        flashDiv.style.width = DEFAULT_WIDTH;
    }
    setupGame() {
        clear();
        scoreValEl.innerHTML = 0;
        matesCount = 0;
        currentScore = 0;
        side = CONST_SIDE + highestLevel;
        survived = true;
        numInput.value = balls_count;
        this.resetStyles();
        this.setupBalls();
        this.resetPos();
    }
    getUrlParams() {
        var url = new URL(window.location.href);

        var url_balls = url.searchParams.get("balls");
        var url_dm = url.searchParams.get("dark_mode");
        var url_bimg = url.searchParams.get("bg_image");

        if (url_balls !== null)
            balls_count = Math.min(Math.max(parseInt(url_balls), 0), 50);
        if (url_dm !== null)
            isDm = url_dm == '1' || url_dm.toLowerCase() == 'true';
        if (url_bimg !== null)
            isBgImg = !(url_bimg == '0' || url_bimg.toLowerCase() == 'false');

        check_dm.checked = isDm;
        check_bg.checked = isBgImg;
    }
    getHTMLelements() {
        scoreValEl = document.getElementById('scoreValEl');
        scoreDiv = document.getElementById('scoreDiv');
        highestScoreEl = document.getElementById('highestScore');
        highestLevelEl = document.getElementById('highestLevel');
        flashDiv = document.getElementById('flashDiv');
        numInput = document.getElementById('number');
        startBtn = document.getElementById('startBtn');
        ballsCounter = document.getElementById('ballsCounter');
        bgDiv = document.getElementById('bgDiv');
        check_bg = document.getElementById('check_bg');
        imgSource = document.getElementById('imgSource');
        dmDiv = document.getElementById('dmDiv');
        check_dm = document.getElementById('check_dm');
        codeSpans = document.getElementsByClassName('code');
    }
    addListeners() {
        bgDiv.addEventListener('click', (e) => {
            isBgImg = check_bg.checked;
            this.changeBG();
            check_bg.blur();
        });

        dmDiv.addEventListener('click', (e) => {
            isDm = check_dm.checked;
            this.setDarkMode();
            scoreValEl.style.color = survived ? (isDm ? 'white' : 'black') : 'red';
            scoreDiv.style.color = survived ? (isDm ? 'white' : 'black') : 'red';
            check_dm.blur();
        });

        startBtn.addEventListener('click', e => this.startNew(e));
        numInput.addEventListener("keyup", e => this.enterBalls(e));
        document.addEventListener("keydown", e => this.keyEventHandler(e.keyCode));
    }
    setDarkMode() {
        if (isDm) {
            document.body.classList.add("dark-mode");
            for (let codeSpan of codeSpans) {
                codeSpan.style.color = 'black';
            }
        }
        else
            document.body.classList.remove("dark-mode");


    }
    changeBG() {
        imgSource.style.display = isBgImg ? 'block' : 'none';
    }
    resetStyles() {
        scoreValEl.style.textDecoration = 'none';
        scoreValEl.style.color = isDm ? 'white' : 'black';
        scoreValEl.style.fontWeight = 'normal';

        scoreDiv.style.textDecoration = 'none';
        scoreDiv.style.color = survived ? (isDm ? 'white' : 'black') : 'red';
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
                di: random(10, 50),
                color: new Color(Math.round(random(0, 255)), Math.round(random(0, 255)), Math.round(random(0, 255)))
            }));
        }
        this._balls = new Balls(mBalls);
    }
    play() {
        background(isBgImg ? bgImg : 51);
        this._balls.show();
        this._balls.update();
        goal = Math.round(50 * balls.length / targetDi);

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
            var rad = ball.di / 2;

            var left = Math.min(this.pos.x, ball.pos.x - rad);
            var right = Math.max(this.pos.x + side, ball.pos.x + rad);

            var top = Math.min(this.pos.y, ball.pos.y - rad);
            var down = Math.max(this.pos.y + side, ball.pos.y + rad);
            var touched = rad + (side / 2);
            if (right - left > down - top) {
                //compare with horizontal
                if (Math.abs(ball.pos.x - (this.pos.x + side / 2)) <= touched) {
                    if (ball.isTarget && survived)
                        this.achievedGoal(ball.color);

                    else if (!ball.isTarget)
                        this.failedGoal();
                }
            }

            else {
                //compare with vertical
                if (Math.abs(ball.pos.y - (this.pos.y + side / 2)) <= touched) {
                    if (ball.isTarget && survived)
                        this.achievedGoal(ball.color);

                    else if (!ball.isTarget)
                        this.failedGoal();
                }
            }
        }
    }
    achievedGoal(color) {
        balls.pop();
        matesCount++;

        var targetColor = `rgb(${color.r},${color.g},${color.b})`;
        this.setFlash(targetColor);
        currentScore += goal;
        scoreValEl.innerHTML = currentScore;
        if (currentScore > highestScore) {
            highestScore = currentScore;
            highestScoreEl.innerHTML = highestScore;
        }

        if (matesCount == balls_count) {
            if (matesCount > highestLevel) {
                highestLevel = matesCount;
                highestLevelEl.innerHTML = matesCount;
            }
            this.keyEventHandler(PLUS_CODE);
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

    startNew() {
        if (!pause)
            this.playResume();
        this.setBallsNumAndSetup(numInput.value);
        startBtn.blur();
    }

    setBallsNumAndSetup(num) {
        if (num > MAX_BALLS) {
            numInput.value = MAX_BALLS;
            num = MAX_BALLS;
            alert('Sorry, you have to pay for extra balls');
        }
        else if (num <= 0) {
            num = 0;
        }
        balls_count = num;
        this.setupGame();
    }

    enterBalls(e) {
        if (e.keyCode === ENTER_CODE)
            this.startNew();
    }

    //https://keycode.info/
    keyEventHandler(keyCode) {
        if (keyCode === R_CODE) {
            if (!pause)
                this.playResume();
            this.setupGame();
        }
        else if (keyCode === PLUS_CODE) {
            this.setBallsNumAndSetup(++balls_count);
        }
        else if (keyCode === MINUS_CODE) {
            this.setBallsNumAndSetup(--balls_count);
        }
        else if (keyCode === SPACE_CODE) {
            this.playResume();
        }
    }

    playResume() {
        if (pause)
            noLoop();
        else
            loop();
        pause = !pause;
    }
}
