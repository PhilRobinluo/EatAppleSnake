class Game {
    constructor() {
        // 初始化画布
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 设置画布大小
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // 游戏配置
        this.gridSize = 20;
        this.speed = 150; // 移动间隔(毫秒)
        this.score = 0;
        
        // 初始化游戏对象
        this.snake = new Snake(this.canvas);
        this.food = new Food(this.canvas, this.gridSize);
        this.food.setSnake(this.snake);
        
        // 游戏状态
        this.isRunning = false;
        this.gameLoop = null;
        
        // 添加暂停状态
        this.isPaused = false;
        
        // 添加难度设置
        this.difficulties = {
            easy: { speed: 200, scoreMultiplier: 1 },
            normal: { speed: 150, scoreMultiplier: 1.5 },
            hard: { speed: 100, scoreMultiplier: 2 }
        };
        this.currentDifficulty = 'normal';
        
        // 初始化最高分
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.updateHighScore();
        
        // 绑定事件处理
        this.bindEvents();
    }

    // 绑定键盘和按钮事件
    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.snake.direction !== 'down') 
                        this.snake.direction = 'up';
                    break;
                case 'ArrowDown':
                    if (this.snake.direction !== 'up') 
                        this.snake.direction = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.snake.direction !== 'right') 
                        this.snake.direction = 'left';
                    break;
                case 'ArrowRight':
                    if (this.snake.direction !== 'left') 
                        this.snake.direction = 'right';
                    break;
            }
        });

        // 开始按钮
        document.getElementById('startButton').addEventListener('click', () => {
            if (!this.isRunning) {
                this.start();
            }
        });

        // 添加空格键暂停功能
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isRunning) {
                this.togglePause();
            }
        });
    }

    // 开始游戏
    start() {
        this.isRunning = true;
        this.score = 0;
        this.updateScore();
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    // 游戏结束
    gameOver() {
        this.isRunning = false;
        clearInterval(this.gameLoop);
        alert(`游戏结束！得分：${this.score}`);
        // 重置游戏
        this.snake = new Snake(this.canvas);
        this.food = new Food(this.canvas, this.gridSize);
        this.food.setSnake(this.snake);
    }

    // 更新分数显示
    updateScore() {
        document.getElementById('scoreValue').textContent = this.score;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateHighScore();
        }
    }

    updateHighScore() {
        document.getElementById('highScoreValue').textContent = this.highScore;
    }

    // 检查碰撞
    checkCollision() {
        const head = this.snake.body[0];
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= this.canvas.width/this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height/this.gridSize) {
            return true;
        }
        
        // 检查是否撞到自己
        for (let i = 1; i < this.snake.body.length; i++) {
            if (head.x === this.snake.body[i].x && 
                head.y === this.snake.body[i].y) {
                return true;
            }
        }
        
        return false;
    }

    // 游戏主循环
    update() {
        // 移动蛇
        this.snake.move();
        
        // 检查碰撞
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }
        
        // 检查是否吃到食物
        const head = this.snake.body[0];
        if (head.x === this.food.position.x && head.y === this.food.position.y) {
            this.snake.grow();
            this.food.generateNewPosition();
            this.score += 10;
            this.updateScore();
        }
        
        // 清空画布并重新绘制
        this.draw();
    }

    // 绘制游戏画面
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格背景
        this.drawGrid();
        
        // 绘制蛇
        this.drawSnake();
        
        // 绘制食物
        this.food.draw(this.ctx);

        // 如果游戏暂停，绘制暂停提示
        if (this.isPaused) {
            this.drawPauseScreen();
        }
    }

    // 绘制网格背景
    drawGrid() {
        this.ctx.strokeStyle = '#f0f0f0';
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    // 绘制蛇
    drawSnake() {
        const body = this.snake.body;
        
        // 保存当前绘图状态
        this.ctx.save();
        
        // 遍历蛇身
        for (let i = 0; i < body.length; i++) {
            const part = body[i];
            const x = part.x * this.gridSize;
            const y = part.y * this.gridSize;
            
            // 设置基本样式
            this.ctx.fillStyle = i === 0 ? '#2ecc71' : '#27ae60'; // 蛇头深绿，蛇身浅绿
            
            // 绘制圆角矩形作为基本形状
            this.drawRoundedRect(
                x + 1,
                y + 1,
                this.gridSize - 2,
                this.gridSize - 2,
                5
            );

            // 为蛇头添加特殊装饰
            if (i === 0) {
                this.drawSnakeHead(x, y, this.snake.direction);
            }

            // 添加鳞片效果
            this.drawSnakeScales(x, y);
        }
        
        // 恢复绘图状态
        this.ctx.restore();
    }

    // 绘制圆角矩形
    drawRoundedRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // 绘制蛇头
    drawSnakeHead(x, y, direction) {
        const centerX = x + this.gridSize / 2;
        const centerY = y + this.gridSize / 2;
        const eyeRadius = this.gridSize / 8;
        
        // 根据方向调整眼睛位置
        let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
        
        switch(direction) {
            case 'up':
                leftEyeX = centerX - this.gridSize/4;
                leftEyeY = centerY - this.gridSize/4;
                rightEyeX = centerX + this.gridSize/4;
                rightEyeY = centerY - this.gridSize/4;
                break;
            case 'down':
                leftEyeX = centerX - this.gridSize/4;
                leftEyeY = centerY + this.gridSize/4;
                rightEyeX = centerX + this.gridSize/4;
                rightEyeY = centerY + this.gridSize/4;
                break;
            case 'left':
                leftEyeX = centerX - this.gridSize/4;
                leftEyeY = centerY - this.gridSize/4;
                rightEyeX = centerX - this.gridSize/4;
                rightEyeY = centerY + this.gridSize/4;
                break;
            case 'right':
                leftEyeX = centerX + this.gridSize/4;
                leftEyeY = centerY - this.gridSize/4;
                rightEyeX = centerX + this.gridSize/4;
                rightEyeY = centerY + this.gridSize/4;
                break;
        }
        
        // 绘制眼睛
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(leftEyeX, leftEyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.arc(rightEyeX, rightEyeY, eyeRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制眼球
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(leftEyeX, leftEyeY, eyeRadius/2, 0, Math.PI * 2);
        this.ctx.arc(rightEyeX, rightEyeY, eyeRadius/2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 绘制蛇的鳞片效果
    drawSnakeScales(x, y) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        const scaleSize = this.gridSize / 4;
        
        // 绘制鳞片图案
        this.ctx.beginPath();
        this.ctx.arc(x + this.gridSize/2, y + this.gridSize/2, scaleSize, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 绘制暂停屏幕
    drawPauseScreen() {
        // 半透明背景
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 暂停文字
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('游戏暂停', this.canvas.width/2, this.canvas.height/2);
    }

    // 添加暂停/继续功能
    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            clearInterval(this.gameLoop);
            // 显示暂停文字
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.fillText('游戏暂停', this.canvas.width/2 - 60, this.canvas.height/2);
        } else {
            this.gameLoop = setInterval(() => this.update(), this.speed);
        }
    }

    // 设置难度
    setDifficulty(level) {
        this.currentDifficulty = level;
        this.speed = this.difficulties[level].speed;
        if (this.isRunning) {
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => this.update(), this.speed);
        }
    }
}

// 当页面加载完成后初始化游戏
window.onload = () => {
    new Game();
}; 