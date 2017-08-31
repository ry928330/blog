window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var animationJudge;
	var beginGame = false;
	var barJudge = true;
	var barAppear = true;

	ctx.font = '18px serif';
	ctx.fillText("Let's Begin", 100, 300);

	//ball 对象用来存储一个球
	var ball = {
		x: 150,
		y: 200,
		vx: 5, //水平速度
		vy: 5, //垂直速度
		radius: 20,
		color: 'blue',
		draw: function() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fillStyle = this.color;
			ctx.fill();
		}
	};

	//bar对象用来存储接球的横条
	var bar = {
		x: 115,
		y: 500,
		width: 50,
		height: 10,
		color: 'rgb(215,215,215)',
		barDragJudge: false,
		xDistance: 0, //存储横条移动距离
		yDistance: 0,
		draw: function() {
			ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
	//targetRectangle对象用来存储
	var targetRectangle = {
		data: initialTargetRectangleArr(),
		width: 50,
		height: 20,
		totalRectNum: 16,
		warningNumProduceJudge: true,
		targetNum: 0,
		warningNum: function() {
			//生成一个0-15间的随机数
			return parseInt(Math.random()*16, 10)
		}, 
		draw: function() {
			if (targetRectangle.warningNumProduceJudge) {
				this.targetNum = this.warningNum();
				targetRectangle.warningNumProduceJudge = false;
			}
			for (var i=0; i<this.data.length; i++) {
				for (var j=0; j<this.data[i].length; j++) {
					ctx.save();
					ctx.beginPath();
					if (i*4 + j != this.targetNum) {
						ctx.fillStyle = 'rgb(' + (51 * i) + ', ' + (255 - 51 * i) + ', 255)';
					} else {
						ctx.fillStyle = 'rgb(255,0,0)';
					}
					ctx.fillRect(this.data[i][j].x, this.data[i][j].y, this.data[i][j].width, this.data[i][j].height);
					ctx.restore();
				}
			}
		},
	}
	function initialTargetRectangleArr() {
		var targetRectangleArr = [];
		for (var i = 0; i < 4; i++) {
			targetRectangleArr[i] = [];
			for (var j = 0; j < 4; j++) {
				targetRectangleArr[i][j] = {};
				targetRectangleArr[i][j].x = 35 + j*(50 + 10);
				targetRectangleArr[i][j].y = 35 + i*(20 + 10);
				targetRectangleArr[i][j].width = 50;
				targetRectangleArr[i][j].height = 20;
			}
		}
		return targetRectangleArr;
	}



	//scores对象用于计分
	var scores = {
		score: 0,
		bestScore: 16,
		draw: function() {
			ctx.beginPath();
			ctx.font = '18px serif';
			ctx.fillStyle = 'rgb(255,0,0)'
			ctx.fillText("当前得分: " + this.score, 100, 550);
		}
	}

	function draw() {
		ctx.clearRect(0,0, canvas.width, canvas.height);
    	ball.draw();
    	bar.draw();
    	scores.draw();
    	targetRectangle.draw();
		ball.x += ball.vx;
		ball.y += ball.vy;

		if (ball.y + ball.vy - ball.radius < 0) {
		    ball.vy = -ball.vy;
		}
		if (ball.x + ball.vx + ball.radius > canvas.width || ball.x + ball.vx - ball.radius < 0) {
		    ball.vx = -ball.vx;
		}
		//在滚球运动过程中去判断滚球碰到横条儿
		if ((ball.x + ball.vx >= bar.x - ball.radius && ball.x + ball.vx - ball.radius <= bar.x + bar.width) && (ball.y + ball.vy + ball.radius >= bar.y)) {
			ball.vy = -ball.vy;
		}
		//在横条没有接住滚球的时候
		if (((ball.y + ball.vy >= bar.y) && (ball.x + ball.vx + ball.radius < bar.x || ball.x + ball.vx - ball.radius > bar.x + bar.width)) || scores.score == scores.bestScore ) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.fillStyle = 'rgb(255,0,0)';
			ctx.font = '18px serif';
			ctx.fillText("Game Over, your final score is: " + scores.score, 30, 300);
			setTimeout(function(){
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.beginPath();
				ctx.fillStyle = 'rgb(215,215,215)';
				ctx.font = '18px serif';
				ctx.fillText("Click The Screen To Try Again!", 40, 300);
				//所有数据复位
				ball.x = 150;
				ball.y = 200;
				bar.x = 115;
				bar.y = 500;
				ball.vx = 5;
				ball.vy = 5;
				targetRectangle.warningNumProduceJudge = true;
				scores.score = 0;
				targetRectangle.data = initialTargetRectangleArr();
				beginGame = false;
			},2000)
		} else {
			animationJudge = window.requestAnimationFrame(draw);
		}
		//在滚球运动过程中，撞击上方矩形块儿得分时
		for (var i=0; i<targetRectangle.data.length; i++) {
			for (var j=0; j<targetRectangle.data[i].length; j++) {
				if ((ball.y + ball.vy - ball.radius <= targetRectangle.data[i][j].y + targetRectangle.height) && (ball.x + ball.vx + ball.radius >= targetRectangle.data[i][j].x) && (ball.x + ball.vx - ball.radius <= targetRectangle.data[i][j].x + targetRectangle.width)) {
					if ((i*4 + j) == targetRectangle.targetNum) {
						ball.vy = -ball.vy;
						ball.vx = 8;
						ball.vy = 8;
						
					} else {
						ball.vy = -ball.vy;
					}
					ctx.clearRect(targetRectangle.data[i][j].x, targetRectangle.data[i][j].y, targetRectangle.data[i][j].width, targetRectangle.data[i][j].height);
					targetRectangle.data[i][j].x = 800;
					targetRectangle.data[i][j].y = 800;
					targetRectangle.data[i][j].width = 0;
					targetRectangle.data[i][j].height = 0;
					scores.score++;
				}
			}
		}

	}

	canvas.addEventListener('mousedown', function(e) {
		if (!beginGame) {
			draw();
			beginGame = true;
		}
		var x = e.clientX;
		var y = e.clientY;
		//判断拖拽的位置
		if ((x >=bar.x && x <= bar.x + bar.width) && (y >= bar.y && y <= bar.y + bar.height) ) {
			bar.barDragJudge = true;
			bar.xDistance = x;
		}

	})
	canvas.addEventListener('mousemove', function(e) {
		if (bar.barDragJudge) {
			var x = e.clientX;
			var distance = x - bar.xDistance;
			if (bar.x + distance + 60 >= canvas.width) {
				if (distance >= 0) {
					distance = 0;
				}
			} else if (bar.x + distance <= 10) {
				if (distance <= 0) {
					distance = 0;
				}
			}
			bar.x += distance;
			bar.xDistance = x;


		}
	})
	window.addEventListener('mouseup', function(e) {
		bar.barDragJudge = false;
	})
}












