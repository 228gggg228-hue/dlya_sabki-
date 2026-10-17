const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

// Настройка размера холста
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Математическая формула сердца из скриншота
function heartPoint(t, cx, cy, scale) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: cx + x * scale, y: cy - y * scale };
}

class Particle {
    constructor(targetX, targetY) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.targetX = targetX;
        this.targetY = targetY;
        this.size = Math.random() * 2 + 1;
        this.color = `hsl(330, 100%, ${Math.random() * 30 + 50}%)`; // Оттенки розового
    }

    update() {
        // Плавное движение к цели
        this.x += (this.targetX - this.x) * 0.05;
        this.y += (this.targetY - this.y) * 0.05;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff69b4';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 1500; // Количество частиц (если тормозит, уменьшите)

function createHeart() {
    particles.length = 0; // Очищаем старые
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    // Масштаб зависит от размера экрана
    const scale = Math.min(canvas.width, canvas.height) / 45; 

    for (let i = 0; i < particleCount; i++) {
        // Небольшой разброс, чтобы сердце не было идеально ровным
        const t = (i / particleCount) * Math.PI * 2;
        const point = heartPoint(t, centerX, centerY, scale);
        
        // Добавляем случайное смещение для эффекта "облака"
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        
        particles.push(new Particle(point.x + offsetX, point.y + offsetY));
    }
}

createHeart();

// Пересоздаем частицы при изменении размера окна
window.addEventListener('resize', () => {
    resizeCanvas();
    createHeart();
});

function animate() {
    // Эффект шлейфа (полупрозрачный черный прямоугольник)
    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw(ctx);
    });

    requestAnimationFrame(animate);
}

animate();
