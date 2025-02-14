const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Firework {
    constructor(startX = Math.random() * canvas.width) {
        this.x = startX;
        this.y = canvas.height;
        this.targetY = canvas.height * 0.2 + (Math.random() * canvas.height * 0.2);
        this.speed = 3 + Math.random() * 4;
        this.particles = [];
        this.colors = [
            '#ff0000', // Rojo
            '#ffd700', // Dorado
            '#ff69b4', // Rosa
            '#00ff00', // Verde brillante
            '#ff4500', // Naranja rojizo
            '#9400d3', // Violeta
            '#00ffff', // Cian
            '#ff1493'  // Rosa profundo
        ];
        this.sparkTrail = [];
    }

    update() {
        if (this.y > this.targetY) {
            // Efecto de chispas mientras sube
            for (let i = 0; i < 2; i++) {
                this.sparkTrail.push({
                    x: this.x + (Math.random() * 4 - 2),
                    y: this.y + (Math.random() * 4 - 2),
                    alpha: 1,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)]
                });
            }
            this.y -= this.speed;
            return true;
        } else {
            this.explode();
            return false;
        }
    }

    explode() {
        const particleCount = 150; // Más partículas
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = 8 + Math.random() * 8;
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            // Crear múltiples capas de partículas
            for (let layer = 0; layer < 3; layer++) {
                const layerVelocity = velocity - (layer * 2);
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * layerVelocity,
                    vy: Math.sin(angle) * layerVelocity,
                    radius: Math.random() * 3 + 1,
                    color: color,
                    alpha: 1,
                    decay: 0.015 + Math.random() * 0.02
                });
            }
        }
    }

    draw() {
        // Dibujar el cohete
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Dibujar chispas del trail
        for (let i = this.sparkTrail.length - 1; i >= 0; i--) {
            const spark = this.sparkTrail[i];
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${spark.alpha})`;
            ctx.fill();
            spark.alpha -= 0.05;
            if (spark.alpha <= 0) this.sparkTrail.splice(i, 1);
        }

        // Dibujar partículas de explosión
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // Gravedad
            p.alpha -= p.decay;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color.replace(')', `, ${p.alpha})`);
            ctx.fill();

            if (p.alpha <= 0) this.particles.splice(i, 1);
        }
    }
}

const fireworks = [];

// Lanzar múltiples fuegos artificiales
function addFireworks() {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 fuegos artificiales a la vez
    for (let i = 0; i < count; i++) {
        fireworks.push(new Firework());
    }
}

// Lanzar fuegos artificiales más frecuentemente
setInterval(addFireworks, 800);

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        if (!fw.update()) {
            fireworks.splice(i, 1);
        }
        fw.draw();
    }

    requestAnimationFrame(animate);
}

animate();
