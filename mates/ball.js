class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Ball {
    constructor(b) {
        this.pos = createVector(b.x, b.y);
        this.vel = createVector(random(-2, 5), random(-2, 5)).setMag(random(3, 5));
        this.di = b.di;
        this.color = b.color;
    }
}
var targetFill;
var targetDi;
var balls;
var strokeW = 2;
class Balls {
    constructor(_balls) {
        balls = _balls;
    }

    update() {
        balls.forEach(ball => {

            if ((ball.pos.x <= ball.di / 2 && ball.vel.x < 0) || (ball.pos.x >= width - ball.di / 2 && ball.vel.x > 0))
                ball.vel.x *= -1;

            if ((ball.pos.y <= ball.di / 2 && ball.vel.y < 0) || (ball.pos.y >= height - ball.di / 2 && ball.vel.y > 0))
                ball.vel.y *= -1;

            ball.pos.add(ball.vel);
        });
    }

    show() {
        for (let index = 0; index < balls.length; index++) {
            if (index == balls.length - 1) {
                strokeWeight(strokeW);
                stroke(255, 255, 255);
            }
            else
                strokeWeight(0);

            const ball = balls[index];
            fill(ball.color.r, ball.color.g, ball.color.b);
            ellipse(ball.pos.x, ball.pos.y, ball.di);
            targetFill = ball.color;
            targetDi = ball.di;
        }

    }
}