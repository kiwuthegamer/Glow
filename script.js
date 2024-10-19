const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let mouse = { x: 0, y: 0, down: false };
let keys = {};

window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})

window.addEventListener('mousedown', function(event) {
    mouse.down = true;
    this.setTimeout(function() {
        mouse.down = false
    }, 100)
})

window.addEventListener('mouseup', function(event) {
    mouse.down = false;
})

window.addEventListener('keydown', function(event) {
    keys[event.key] = true;
})

window.addEventListener('keyup', function(event) {
    keys[event.key] = false;
})

class Position {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}

class Velocity {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
}

class Polygon {
    constructor(sides, color, size, position, velocity) {
        this.sides = sides;
        this.color = color;
        this.glowColor = this.color;
        this.coloroverlay = "rgba(255, 255, 255, 0.0)";
        this.size = size;
        this.position = position;
        this.velocity = velocity
    }

    draw(ctx) {
        const angle = 360 / this.sides;
        const rotationRadians = this.position.angle * Math.PI / 180;

        ctx.shadowBlur = 20;  // Keep the glow effect
        ctx.shadowColor = this.glowColor;

        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const theta = (i * angle * Math.PI / 180) + rotationRadians;
            const x = this.position.x + this.size * Math.cos(theta);
            const y = this.position.y + this.size * Math.sin(theta);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();

        // Change from fill to stroke to draw outlines only
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;  // You can adjust the outline thickness here
        ctx.stroke();

        // Optional overlay for mouse hover effect, using stroke instead of fill
        if (this.coloroverlay !== "rgba(255, 255, 255, 0.0)") {
            ctx.strokeStyle = this.coloroverlay;
            ctx.lineWidth = 4;  // Thicker for the overlay
            ctx.stroke();
        }

        ctx.shadowBlur = 0;  // Turn off shadow after drawing
    }

    update() {
        if (this.is_mouse_over()) {
            this.coloroverlay = "rgba(255, 255, 255, 0.3)";
        } else {
            this.coloroverlay = "rgba(255, 255, 255, 0.0)";
        }

        if (this.is_mouse_over() && mouse.down) {
            this.coloroverlay = "rgba(255, 255, 255, 1)";
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.position.angle += this.velocity.angle;
    }

    is_mouse_over() {
        const dx = mouse.x - this.position.x;
        const dy = mouse.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.size;
    }
}


let polygons = [
    new Polygon(4, '#ff3333', 50, new Position(-10, 200, 0), new Velocity(1, 0.5, 1)),
];

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const polygon of polygons) {
        polygon.update();
        polygon.draw(ctx);
    }

    const cursor = document.querySelector('.cursor');
    cursor.style.left = `${mouse.x}px`;
    cursor.style.top = `${mouse.y}px`;
    
    requestAnimationFrame(tick);
}

tick();
