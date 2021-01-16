import { extendObservable, runInAction } from 'mobx';

type Direction = 'up' | 'right' | 'down' | 'left';

/*
const SOUNDS = [
    'cartoon-clown-fun-nose-sound.wav',
    'clown-squeaky-toy.wav',
    'drum-joke.wav',
    'funny-game-over.wav',
    'funny-kid-voice.wav',
    'winning-an-extra-bonus.wav',
    'mixkit-trombone-disappoint-744.wav',
    'mixkit-sad-party-horn-sound-529.wav',
    'mixkit-little-cartoon-creature-hiccup-10.wav',
    'mixkit-falling-male-scream-391.wav',
];
*/

class Snake {
    dir: Direction = 'right';
    segments: Coords[] = [];
    rows: number;
    cols: number;
    res: number;
    length = 0;
    color: string;

    constructor({
        rows,
        cols,
        res,
        dir,
        color,
    }: {
        rows: number;
        cols: number;
        res: number;
        dir: Direction;
        color: string;
    }) {
        this.rows = rows;
        this.cols = cols;
        this.res = res;
        this.dir = dir;
        this.color = color;
        this.segments.push({
            x: rows / 2,
            y: cols / 2,
        });
        extendObservable(this, {
            length: 0,
        });
    }

    setDirection(dir: Direction) {
        if (
            (dir === 'up' && this.dir !== 'down') ||
            (dir === 'down' && this.dir !== 'up') ||
            (dir === 'right' && this.dir !== 'left') ||
            (dir === 'left' && this.dir !== 'right')
        ) {
            this.dir = dir;
        }
    }

    feed() {
        runInAction(() => {
            this.length += 5;
        });
    }

    move() {
        const seg = this.segments[0];

        if (this.dir === 'up') {
            this.segments.unshift({
                x: seg.x,
                y: (this.rows + seg.y - 1) % this.rows,
            });
        } else if (this.dir === 'right') {
            this.segments.unshift({
                x: (seg.x + 1) % this.cols,
                y: seg.y,
            });
        } else if (this.dir === 'down') {
            this.segments.unshift({
                x: seg.x,
                y: (this.rows + seg.y + 1) % this.rows,
            });
        } else {
            this.segments.unshift({
                x: (this.cols + seg.x - 1) % this.cols,
                y: seg.y,
            });
        }
        if (this.segments.length > this.length + 10) {
            this.segments.pop();
        }
    }

    isFreeCoords = (coords: Coords): boolean =>
        !this.segments.some((seg) => seg.x === coords.x && seg.y === coords.y);

    render(ctx: CanvasRenderingContext2D) {
        ctx.save();

        this.segments.forEach((seg, i) => {
            if (i === 0) {
                ctx.fillStyle = 'brown';
            } else {
                ctx.fillStyle = this.color;
            }
            ctx.fillRect(
                seg.x * this.res,
                seg.y * this.res,
                this.res,
                this.res
            );
        });
        ctx.restore();
    }
}

type Coords = {
    x: number;
    y: number;
};

export class Snakow {
    canvas: HTMLCanvasElement;
    running = true;
    speed = 50;
    context: CanvasRenderingContext2D;
    snakes: Snake[] = [];

    animal: Coords;

    width: number;
    height: number;

    rows: number = 100;
    cols: number = 100;

    res: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')!;
        this.width = Math.round(canvas.getBoundingClientRect().width);
        this.height = Math.round(canvas.getBoundingClientRect().height);
        canvas.width = this.width;
        canvas.height = this.height;
        this.res = this.width / this.cols;

        this.snakes.push(
            new Snake({
                rows: this.rows,
                cols: this.cols,
                res: this.res,
                dir: 'left',
                color: 'red',
            })
        );

        this.snakes.push(
            new Snake({
                rows: this.rows,
                cols: this.cols,
                res: this.res,
                dir: 'right',
                color: 'black',
            })
        );

        this.animal = this.randomCoords();
        window.addEventListener('keydown', this.onKeyDown);
    }

    dispose() {}

    onKeyDown = (ev: KeyboardEvent) => {
        const [snake1, snake2] = this.snakes;
        if (ev.key === 'ArrowUp') {
            snake2.setDirection('up');
        } else if (ev.key === 'ArrowRight') {
            snake2.setDirection('right');
        } else if (ev.key === 'ArrowDown') {
            snake2.setDirection('down');
        } else if (ev.key === 'ArrowLeft') {
            snake2.setDirection('left');
        } else if (ev.key === 'w') {
            snake1.setDirection('up');
        } else if (ev.key === 'd') {
            snake1.setDirection('right');
        } else if (ev.key === 's') {
            snake1.setDirection('down');
        } else if (ev.key === 'a') {
            snake1.setDirection('left');
        }
    };

    start() {
        this.running = true;
        this.tick();
    }

    trigger() {
        if (this.running) {
            setTimeout(this.tick, this.speed);
        }
    }

    playFunnySound = () => {
        // const sound = SOUNDS[Math.round(SOUNDS.length * Math.random())];
        const audio = new Audio(`sounds/funny-kid-voice.wav`);
        audio.play();
    };

    tick = () => {
        this.snakes.forEach((snake) => {
            if (!snake.isFreeCoords(this.animal)) {
                snake.feed();
                this.playFunnySound();
                this.spawnAnimal();
            }

            snake.move();
        });

        requestAnimationFrame(this.render);
        this.trigger();
    };

    randomCoords = (): Coords => {
        return {
            x: Math.round(Math.random() * this.cols),
            y: Math.round(Math.random() * this.rows),
        };
    };

    isFreeCoords = (coords: Coords): boolean =>
        this.snakes.every((snake) => snake.isFreeCoords(coords));

    spawnAnimal = () => {
        do {
            this.animal = this.randomCoords();
        } while (!this.isFreeCoords(this.animal));
    };

    render = () => {
        const ctx = this.context;

        ctx.clearRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.beginPath();
        const rad = this.res / 2;
        ctx.fillStyle = 'black';
        ctx.arc(
            this.animal.x * this.res + rad,
            this.animal.y * this.res + rad,
            rad,
            0,
            2 * Math.PI
        );
        ctx.fill();
        ctx.restore();

        this.snakes.forEach((snake) => snake.render(ctx));
    };
}
