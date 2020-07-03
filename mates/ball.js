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
        this.vel = createVector(random(-2, -1), random(-2, -1),);
        this.dim = b.dim;
        this.color = b.color;
    }
}
var lastFill;
var lastDim;
var balls;
class Balls {
    constructor(_balls) {
        balls = _balls;
    }

    update() {
        balls.forEach(ball => {

            if (ball.pos.x >= width - ball.dim / 2)
                ball.vel.x += -.1;
            if (ball.pos.x <= 0 + ball.dim / 2)
                ball.vel.x += .1;

            if (ball.pos.y >= height - ball.dim / 2)
                ball.vel.y += -.5;
            if (ball.pos.y <= 0 + ball.dim / 2)
                ball.vel.y += .5;

            ball.pos.add(ball.vel);
        });
    }

    show() {
        balls.forEach(ball => {
            fill(ball.color.r, ball.color.g, ball.color.b);
            ellipse(ball.pos.x, ball.pos.y, ball.dim);
            lastFill = ball.color;
            lastDim = ball.dim;
        });
    }
}