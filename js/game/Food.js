class Food {
    constructor(canvas, gridSize) {
        this.canvas = canvas;
        this.gridSize = gridSize; // 网格大小，与蛇身大小相同
        this.position = {x: 0, y: 0};
        // 计算画布中可用的格子数
        this.maxX = Math.floor(canvas.width / gridSize);
        this.maxY = Math.floor(canvas.height / gridSize);
        this.generateNewPosition();
    }

    // 生成新的食物位置
    generateNewPosition() {
        this.position = {
            x: Math.floor(Math.random() * this.maxX),
            y: Math.floor(Math.random() * this.maxY)
        };
    }

    // 绘制食物
    draw(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        // 画一个圆形的食物
        ctx.arc(
            this.position.x * this.gridSize + this.gridSize/2,
            this.position.y * this.gridSize + this.gridSize/2,
            this.gridSize/2 * 0.8, // 食物略小于格子
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
} 