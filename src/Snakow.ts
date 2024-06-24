import { extendObservable } from "mobx";

type Direction = "up" | "right" | "down" | "left";

class Snake {
  dir: Direction = "right";
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

  setDirection(dir: Direction) {}

  feed() {}

  move() {}

  isFreeCoords = (coords: Coords): boolean => false;

  render(ctx: CanvasRenderingContext2D) {}
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
    this.context = canvas.getContext("2d")!;
    this.width = Math.round(canvas.getBoundingClientRect().width);
    this.height = Math.round(canvas.getBoundingClientRect().height);
    canvas.width = this.width;
    canvas.height = this.height;
    this.res = this.width / this.cols;

    this.snakes.push();

    this.animal = this.randomCoords();
  }

  dispose() {}

  onKeyDown = (ev: KeyboardEvent) => {};

  start() {}

  trigger() {}

  playFunnySound = () => {
    // const sound = SOUNDS[Math.round(SOUNDS.length * Math.random())];
    const audio = new Audio(`sounds/funny-kid-voice.wav`);
    audio.play();
  };

  tick = () => {};

  randomCoords = (): Coords => ({ x: 0, y: 0 });

  isFreeCoords = (coords: Coords): boolean => false;

  spawnAnimal = () => {};

  render = () => {
    const ctx = this.context;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.save();
    ctx.beginPath();
    const rad = this.res / 2;
    ctx.fillStyle = "black";
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
