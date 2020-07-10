var sqrInitY;
var lineY;
var side = 10;

class MyGame {
    setup() {
        background(51);
        side = 10;
        lineY = height - 20;
        sqrInitY = lineY - 13;
        this.resetPos();
        stroke(255, 255, 255);
    }
    resetPos() {
        this.acc = createVector(10, 10);
        this.vel = createVector(0, 0);
        this.pos = createVector(width / 2, sqrInitY);
    }
    up() {
        var a = createVector(0, -1.5);
        if (this.vel.y <= -2)
            a = createVector(0, 0);
        this.acc.add(a);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }
    play() {
        background(51);
        line(0, lineY, width, lineY);
        square(this.pos.x, this.pos.y, side);

        this.acc.set(0, .15);
        this.vel.add(this.acc);
        this.pos.add(this.vel);


        if (keyIsDown(UP_ARROW)) {
            this.up();

        }


        if (keyIsDown(DOWN_ARROW)) {
            var a = createVector(0, .10);
            if (this.vel.y > 2)
                a = createVector(0, 0);

            this.acc.y += 5;
            this.vel.add(this.acc);
            this.pos.add(this.vel);

        }

        if (keyIsDown(RIGHT_ARROW)) {
            this.acc.set(.2, 0);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
        }

        if (keyIsDown(LEFT_ARROW)) {
            this.acc.set(-.2, 0);
            this.vel.add(this.acc);
            this.pos.add(this.vel);

        }
        this.edges();
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, .15);
    }

    edges() {
        if (this.pos.y >= sqrInitY) {
            this.pos.y = sqrInitY;
            this.vel.y *= -.5;
        }

        if (this.pos.y <= 0) {
            this.pos.y = 0;
            this.vel.y *= 0.5;
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
}


function move(dir) {
    switch (dir) {
        case 'u':
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Up' }))

            // game.up();
            break;

        default:
            break;
    }
}