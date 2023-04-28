const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
// 添加地板
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

// min max
function getRandomArbitrary(min, max) {
  // wg:min = 100, max = 500, 则Math.floor部分，为0-400， +min，即100 - 500之间的额随机数
  return min + Math.floor(Math.random() * (max - min));
}

//制作小方块
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    if (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    ) {
      return true;
    } else {
      return false;
    }
  }
}

//制作所有的小方块brick
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 550));
}

// 鼠标控制板移动，且尽在canvas面板上监控鼠标
c.addEventListener("mousemove", (e) => {
  // 查看监控鼠标输出的obj属性，根据输出调用并控制
  // console.log(e);
  ground_x = e.clientX;
});

function drawCircle() {
  //   console.log("draw circle");
  // 确认球是否打到砖块
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      console.log(count);
      brick.visible = false;
      //改变X，Y方向速度，并且将brick熊brickArray中移除
      //先判断小球从哪里撞击上去的
      if (circle_y >= brick.y + brick.height) {
        // 从下方撞击
        ySpeed *= -1;
      } else if (circle_y <= brick.y) {
        // 从上方撞击
        ySpeed *= -1;
      } else if (circle_x <= brick.x) {
        //从左方撞击
        xSpeed *= -1;
      } else if (circle_x >= brick.x + radius.width) {
        // 从右方撞击
        xSpeed *= -1;
      }
      // brickArray.splice(index, 1);
      // if (brickArray.length == 0) {
      //   alert("Game Over");
      //   clearInterval(game);
      // }
      if (count == 10) {
        alert("Game Over");
        clearInterval(game);
      }
    }
  });
  // 判断小球是否打到地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    // 即当小球打到板最左或者最右
    if (ySpeed > 0) {
      //速度>0，即往下掉，即触碰到地板需要往上弹
      circle_y -= 50; //因为canvas往右往下x变大，y变大
    } else {
      // 速度<0，即往上弹，触碰到地板往下掉
      circle_y += 50; //数值越大，弹力越明显
    }
    ySpeed *= -1;
  }

  //判断小球是否打到边界
  if (circle_x >= canvasWidth - radius) {
    // 确认小球在右边界，弹到左下角
    xSpeed *= -1;
  }
  if (circle_x <= radius) {
    // 确认小球在左边界，弹到右下角
    xSpeed *= -1;
  }
  if (circle_y <= radius) {
    // 确认小球上边界，弹回下边界
    ySpeed *= -1;
  }
  if (circle_y >= canvasHeight - radius) {
    //确认小球在下边界，弹回上面
    ySpeed *= -1;
  }
  //更新圆的位置
  circle_x += xSpeed;
  circle_y += ySpeed;

  //画出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 画出所有的小方块
  brickArray.forEach((brick) => {
    // brick.drawBrick();
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //画出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  //画小球
  // x, y代表圆心位置 - (x, y, radius, startAngle, endAngle)
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
