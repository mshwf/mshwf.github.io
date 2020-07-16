class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Ball {
    constructor(b) {
        this.acc = createVector(0, 0);
        this.pos = createVector(b.x, b.y);
        this.vel = createVector(random(-2, 5), random(-2, 5)).setMag(random(3, 5));
        this.di = b.di;
        this.color = b.color;
    }
}
var targetDi;
var balls;
var strokeW = 2;
class Balls {
    constructor(_balls) {
        balls = _balls;
    }

    update() {
        balls.forEach(ball => {
            if (!survived) {
                ball.acc = createVector(0, 1);
                if (ball.pos.y + ball.di / 2 > height)
                    ball.pos.y = height - ball.di / 2;
            }

            if ((ball.pos.x <= ball.di / 2 && ball.vel.x < 0) || (ball.pos.x >= width - ball.di / 2 && ball.vel.x > 0))
                ball.vel.x *= survived ? -1 : 0;
            if ((ball.pos.y <= ball.di / 2 && ball.vel.y < 0) || (ball.pos.y >= height - ball.di / 2 && ball.vel.y > 0))
                ball.vel.y *= survived ? -1 : -.5;
            ball.vel.add(ball.acc);
            ball.pos.add(ball.vel);

        });
    }

    show() {
        for (let index = 0; index < balls.length; index++) {
            var ball = balls[index];
            if (index == balls.length - 1) {
                strokeWeight(strokeW);
                stroke(255);
                ball.isTarget = true;
                targetDi = ball.di;
            }
            else {
                strokeWeight(0);
            }

            fill(ball.color.r, ball.color.g, ball.color.b);
            ellipse(ball.pos.x, ball.pos.y, ball.di);
        }

    }
}