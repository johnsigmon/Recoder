import React from 'react';
import Tone from 'tone';
import Circle from './Circle';
import FxParams from './FxParams';
/*import SnakeView from '../util/snake/snake_view';*/
import classNames from 'classnames';

class Effects extends React.Component {
  constructor(props) {
    super(props);
    this.lpFilter = new Tone.Filter(22000, "lowpass");
    this.hpFilter = new Tone.Filter(0, "highpass");
    this.reverb = new Tone.Freeverb(0.9, 5000);
    this.phaser = new Tone.Phaser(5, 5);
    this.phaser.wet.value = 0;
    this.reverb.wet.value = 0;

    this.fx1 = this.lpFilter;
    this.fx2 = this.reverb;
    this.state = {
      fx1Active: 'lpFilter',
      fx2Active: 'reverb',
      mouseX: 0,
      mouseY: 0,
      snakeOn: false
    };
    Tone.Master.chain(this.fx1, this.fx2);

    this.getMousePos = this.getMousePos.bind(this);
    this.mouseMoveEvent = this.mouseMoveEvent.bind(this);
    this.initializeCanvas = this.initializeCanvas.bind(this);
    this.canvasTrail = this.canvasTrail.bind(this);
    this.removeListeners = this.removeListeners.bind(this);
    this.animationLoop = this.animationLoop.bind(this);
    this.changeFx = this.changeFx.bind(this);
/*    this.toggleSnake = this.toggleSnake.bind(this);*/
    this.resetFx = this.resetFx.bind(this);
  }

  getMousePos(e) {
    let rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  mouseMoveEvent(e) {
    let mousePos = this.getMousePos(e);
    if (mousePos.y < 1) {
      mousePos.y = 1;
    }
    if (this.fx1 === this.lpFilter) {
      this.fx1[FxParams['lpFilter']].value = Math.pow(10, (mousePos.y / 46.057239172)) + 500;
    } else if (this.fx1 === this.hpFilter) {
      this.fx1[FxParams['hpFilter']].value = Math.pow(10, (mousePos.y / 46.057239172));
    }
    if (this.fx2 === this.reverb) {
      this.fx2[FxParams['reverb']].value = mousePos.x * 0.0003;
    } else if (this.fx2 === this.phaser) {
      this.fx2[FxParams['phaser']].value = mousePos.x * 0.0048;
    }
    const canvasPos = this.getPosition(this.canvas);
    this.setState({ mouseX: e.clientX - canvasPos.x, mouseY:e.clientY - canvasPos.y});
  }

  getPosition(el) {
    let xPos = 0;
    let yPos = 0;

    while (el) {
      xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
  }

  componentDidMount(){
    this.canvas = document.getElementById("fx-canvas");
    this.fxHighlight = document.getElementById('fx-highlighter');
    this.ctx = this.canvas.getContext("2d");
    this.circle = new Circle(this.ctx);
    this.circles = [];
    for (let i = 0; i < 10; i++) {
      this.circles.push(new Circle(this.ctx));
    }
    this.canvas.addEventListener('mousedown', (e) => {
      this.canvas.classList.add("canvas-active");
      this.fxHighlight.classList.add("highlight-active");
      let mousePos = this.getMousePos(e);
      const canvasPos = this.getPosition(this.canvas);
      this.animationLoop(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
      this.canvas.addEventListener(
        'mousemove',
        this.mouseMoveEvent,
        false);
    }, false);
    document.getElementById('root').addEventListener('mouseup',
    this.removeListeners, false);
  }

  removeListeners() {
    this.resetFx();
    this.canvas.classList.remove("canvas-active");
    this.fxHighlight.classList.remove("highlight-active");
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.removeEventListener('mousemove', this.mouseMoveEvent);
    window.cancelAnimationFrame(this.animationId);
  }

  resetFx() {
    this.lpFilter.frequency.value = 22000;
    this.hpFilter.frequency.value = 1;
    this.phaser.wet.value = 0;
    this.reverb.wet.value = 0;
  }

  initializeCanvas() {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.clearRect(0, 0, 300, 300);
    this.ctx.fillStyle = "#052436";
    this.ctx.fillRect(0, 0, 300, 300);
  }

  canvasTrail(xPos, yPos) {
    this.initializeCanvas();
    for(let i = 0; i < this.circles.length; i++) {
      let c1 = this.circles[i],
          c2 = this.circles[i-1];

      this.circles[this.circles.length - 1].draw();
      this.circles[this.circles.length - 1].x = xPos;
      this.circles[this.circles.length - 1].y = yPos;
      c1.draw();

      if (i > 0) {
        c2.x += (c1.x - c2.x) * 0.6;
        c2.y += (c1.y - c2.y) * 0.6;
      }
    }
  }

  animationLoop(xPos, yPos) {
    this.canvasTrail(this.state.mouseX, this.state.mouseY);
    this.animationId = window.requestAnimationFrame(
      this.animationLoop.bind(this, this.state.mouseX, this.state.mouseY)
    );
  }

  changeFx(fxNum, e) {
    e.preventDefault();
    const effect = e.currentTarget.value;
    this.setState({
      [`${fxNum}Active`]: effect
    });
    this[fxNum] = this[effect];
    Tone.Master.chain(this.fx1, this.fx2);
  }

  /*snakeBoard() {
    let board = [];
    for (let i = 0; i < 20; i++) {
      let row = [];
      for (let j = 0; j < 20; j++) {
        row.push(<li className='snake-li' key={j}></li>);
      }
      board.push(
        <ul className="snake-ul" key={i}>
          {row}
        </ul>
      );
    }
    return board;
  }*/

/*  toggleSnake() {
    if (this.state.snakeOn) {
      window.clearInterval(this.snakeView.intervalId);
      window.clearInterval(this.snakeFxId);
      this.setState({ snakeOn: false });
    } else {
      this.setState({ snakeOn: true });
      this.snakeView = new SnakeView(this);
    }
  }*/

  render() {
    const fxClasses = classNames({
      "fx-pad": true,
      "hidden": this.state.snakeOn
    });

    return (
      <div className="fx-container" id="fx-highlighter">
        <div className="fx-div">
  {/*        <p className="fx-name name1">{this.state.fx1Active}</p>
          <p className="fx-name name2">{this.state.fx2Active}</p>*/}
          <div className={fxClasses}>
            <canvas id="fx-canvas" width="175" height="175"></canvas>
          </div>
        </div>
        <div className="fx-selectors">
          <select
            onChange={this.changeFx.bind(this, 'fx1')}
            value={this.state.fx1Active}
            className="fx-selector">
            <option value="lpFilter">
              lowpass filter
            </option>
            <option value="hpFilter">
              highpass filter
            </option>
          </select>
          <select
            onChange={this.changeFx.bind(this, 'fx2')}
            value={this.state.fx2Active}
            className="fx-selector">
            <option value="reverb">
              reverb
            </option>
            <option value="phaser">
              phaser
            </option>
          </select>
        </div>
      </div>
    );
  }
}

export default Effects;
