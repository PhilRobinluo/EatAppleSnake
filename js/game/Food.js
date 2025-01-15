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

    // 绘制食物
    draw(ctx) {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        
        // 绘制圆形食物
        const centerX = this.position.x * this.gridSize + this.gridSize/2;
        const centerY = this.position.y * this.gridSize + this.gridSize/2;
        const radius = this.gridSize/2 * 0.8;
        
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // 添加光晕效果
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#c0392b';
        ctx.fill();
    }
} 