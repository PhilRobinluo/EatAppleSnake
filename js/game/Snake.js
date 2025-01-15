class Snake {
    constructor(canvas) {
        // 初始化蛇的属性
        this.canvas = canvas;
        this.size = 20; // 蛇身每一节的大小
        this.direction = 'right'; // 初始方向
        this.body = [
            {x: 3, y: 1}, // 蛇头
            {x: 2, y: 1}, // 蛇身
            {x: 1, y: 1}  // 蛇尾
        ];
    }

    // 移动蛇
    move() {
        const head = {...this.body[0]};
        
        // 根据方向移动蛇头
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
        // 将新的头部添加到身体数组的开头
        this.body.unshift(head);
        // 移除尾部
        this.body.pop();
    }

    // 吃到食物后增长
    grow() {
        // 复制尾部的最后一节
        const tail = {...this.body[this.body.length - 1]};
        this.body.push(tail);
    }
} 