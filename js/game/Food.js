class Food {
    constructor(canvas, gridSize) {
        this.canvas = canvas;
        this.gridSize = gridSize;
        this.position = {x: 0, y: 0};
        this.maxX = Math.floor(canvas.width / gridSize);
        this.maxY = Math.floor(canvas.height / gridSize);
        this.snake = null;
    }

    // 设置蛇的引用
    setSnake(snake) {
        this.snake = snake;
    }

    // 检查位置是否与蛇身重叠
    isPositionOnSnake(pos) {
        if (!this.snake) return false;
        return this.snake.body.some(part => part.x === pos.x && part.y === pos.y);
    }

    // 生成新的食物位置
    generateNewPosition() {
        let newPos;
        let attempts = 0;
        const maxAttempts = 100; // 防止无限循环

        do {
            newPos = {
                x: Math.floor(Math.random() * this.maxX),
                y: Math.floor(Math.random() * this.maxY)
            };
            attempts++;
        } while (this.isPositionOnSnake(newPos) && attempts < maxAttempts);

        this.position = newPos;
    }

    // 绘制食物（苹果）
    draw(ctx) {
        const centerX = this.position.x * this.gridSize + this.gridSize/2;
        const centerY = this.position.y * this.gridSize + this.gridSize/2;
        const radius = this.gridSize/2 * 0.8;

        // 保存当前绘图状态
        ctx.save();

        // 绘制苹果主体
        ctx.beginPath();
        ctx.fillStyle = '#e74c3c'; // 苹果红色
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // 添加苹果高光
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.arc(centerX - radius/3, centerY - radius/3, radius/2, 0, Math.PI * 2);
        ctx.fill();

        // 绘制苹果叶子
        ctx.beginPath();
        ctx.fillStyle = '#2ecc71';
        ctx.moveTo(centerX, centerY - radius);
        ctx.quadraticCurveTo(
            centerX + radius/2, centerY - radius - radius/4,
            centerX + radius/4, centerY - radius + radius/4
        );
        ctx.quadraticCurveTo(
            centerX, centerY - radius,
            centerX, centerY - radius
        );
        ctx.fill();

        // 绘制苹果茎
        ctx.beginPath();
        ctx.strokeStyle = '#795548';
        ctx.lineWidth = 2;
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY - radius - radius/4);
        ctx.stroke();

        // 恢复绘图状态
        ctx.restore();
    }
} 