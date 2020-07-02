class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

class Ball {
    constructor(x, y, dim, color) {
        this.pos = createVector(x, y);
        this.vel = createVector(-1, -1);
        this.dim = dim;
        this.color = color;
    }
}
var lastFill;
var lastDim;
var balls;
class Balls {
    constructor(_balls) {
        balls = _balls;
        this.registered = [];
    }

    update() {
        this.registered = [];

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

            if (this.registered.some(p => p.x >= (ball.pos.x - ball.dim / 2) && p.x < (ball.pos.x + ball.dim / 2) &&
                p.y >= (ball.pos.y - ball.dim / 2) && p.y < (ball.pos.y + ball.dim / 2))) {
                ball.pos.x += -1;
                ball.pos.y += -1;
            }
            this.registered.push(ball.pos);
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