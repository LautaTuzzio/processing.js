// ============================================
// 1. Partículas con Física (p5.js)
// ============================================
let physicsParticles = [];
let physicsSketch = function(p) {
    p.setup = function() {
        let canvas = p.createCanvas(400, 250);
        canvas.parent('physics-container');
        p.colorMode(p.HSB, 255);
        
        // Crear partículas iniciales
        for (let i = 0; i < 50; i++) {
            physicsParticles.push({
                pos: p.createVector(p.random(p.width), p.random(p.height)),
                vel: p5.Vector.random2D().mult(p.random(0.5, 2)),
                size: p.random(5, 15),
                hue: p.random(100, 200)
            });
        }
    };

    p.draw = function() {
        if (window.animations.physics) {
            p.background(26, 26, 46, 20);
            
            // Actualizar y dibujar partículas
            for (let particle of physicsParticles) {
                // Atracción al ratón
                let mouse = p.createVector(p.mouseX, p.mouseY);
                let dir = p5.Vector.sub(mouse, particle.pos);
                let distance = dir.mag();
                dir.normalize();
                
                // Fuerza de atracción/repulsión
                if (distance < 100) {
                    dir.mult(-0.5);
                } else {
                    dir.mult(0.05);
                }
                
                // Aplicar fuerzas
                particle.vel.add(dir);
                particle.vel.limit(3);
                particle.pos.add(particle.vel);
                
                // Rebotar en los bordes
                if (particle.pos.x < 0 || particle.pos.x > p.width) particle.vel.x *= -1;
                if (particle.pos.y < 0 || particle.pos.y > p.height) particle.vel.y *= -1;
                
                // Dibujar partícula
                p.noStroke();
                p.fill(particle.hue, 200, 200, 150);
                p.ellipse(particle.pos.x, particle.pos.y, particle.size);
                
                // Conectar partículas cercanas
                for (let other of physicsParticles) {
                    if (particle !== other) {
                        let d = p.dist(
                            particle.pos.x, particle.pos.y,
                            other.pos.x, other.pos.y
                        );
                        if (d < 80) {
                            p.stroke(particle.hue, 100, 255, 50);
                            p.strokeWeight(1);
                            p.line(
                                particle.pos.x, particle.pos.y,
                                other.pos.x, other.pos.y
                            );
                        }
                    }
                }
            }
        }
    };
};

// ============================================
// 2. Ondas de Sonido (p5.js)
// ============================================
let waveSketch = function(p) {
    let t = 0;
    let particles = [];
    
    p.setup = function() {
        let canvas = p.createCanvas(400, 250);
        canvas.parent('wave-container');
        p.colorMode(p.HSB, 255);
        
        // Crear partículas en una línea
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: p.map(i, 0, 49, 0, p.width),
                y: p.height / 2,
                size: p.random(3, 8),
                hue: p.map(i, 0, 49, 0, 255)
            });
        }
    };

    p.draw = function() {
        if (window.animations.wave) {
            p.background(15, 34, 96, 20);
            
            // Actualizar y dibujar partículas
            for (let i = 0; i < particles.length; i++) {
                let particle = particles[i];
                
                // Mover partículas en ondas
                let angle = p.map(i, 0, particles.length, 0, p.TWO_PI * 4) + t;
                let wave = p.sin(angle) * p.height * 0.2;
                
                // Efecto de onda que se propaga
                let wave2 = p.sin(angle * 2 + t * 2) * p.height * 0.1;
                
                // Dibujar línea de onda
                if (i > 0) {
                    p.stroke(particle.hue, 200, 255, 150);
                    p.strokeWeight(2);
                    p.line(
                        particles[i-1].x, particles[i-1].y + wave,
                        particle.x, particle.y + wave
                    );
                }
                
                // Actualizar posición Y
                particle.y = p.height / 2 + wave + wave2;
                
                // Dibujar partícula
                p.noStroke();
                p.fill(particle.hue, 200, 255);
                p.ellipse(particle.x, particle.y, particle.size);
            }
            
            t += 0.05;
        }
    };
};

// ============================================
// 3. Fractales Generativos (p5.js)
// ============================================
let fractalSketch = function(p) {
    let angle = 0;
    let len = 100;
    
    p.setup = function() {
        let canvas = p.createCanvas(400, 250);
        canvas.parent('fractal-container');
        p.angleMode(p.DEGREES);
    };
    
    p.draw = function() {
        if (window.animations.fractal) {
            p.background(22, 33, 62, 20);
            p.stroke(200, 100, 255, 150);
            p.strokeWeight(1);
            p.noFill();
            
            p.translate(p.width/2, p.height);
            branch(100);
            
            angle += 0.5;
            len = 100 + p.sin(p.frameCount * 0.02) * 20;
        }
    };
    
    function branch(len) {
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        
        if (len > 4) {
            p.push();
            p.rotate(angle + p.sin(p.frameCount * 0.01) * 10);
            branch(len * 0.67);
            p.pop();
            
            p.push();
            p.rotate(-angle - p.cos(p.frameCount * 0.01) * 10);
            branch(len * 0.67);
            p.pop();
        }
    }
};

// ============================================
// 4. Partículas Magnéticas (Processing.js)
// ============================================
function initMagneticParticles() {
    let container = document.getElementById("magnetic-container");
    if (!container) return;
    
    // Crear canvas para Processing
    let canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    container.appendChild(canvas);
    
    let sketch = function(processing) {
        let particles = [];
        let magnets = [];
        
        processing.setup = function() {
            processing.size(400, 250);
            processing.colorMode(processing.HSB, 255);
            
            // Crear partículas
            for (let i = 0; i < 30; i++) {
                particles.push({
                    x: processing.random(processing.width),
                    y: processing.random(processing.height),
                    vx: processing.random(-1, 1),
                    vy: processing.random(-1, 1),
                    hue: processing.random(180, 280)
                });
            }
            
            // Crear imanes
            for (let i = 0; i < 5; i++) {
                magnets.push({
                    x: processing.random(processing.width),
                    y: processing.random(processing.height),
                    charge: processing.random() > 0.5 ? 1 : -1
                });
            }
        };
        
        processing.draw = function() {
            if (window.animations.magnetic) {
                processing.background(26, 26, 46, 20);
                
                // Actualizar imanes (se mueven en patrones)
                for (let i = 0; i < magnets.length; i++) {
                    let m = magnets[i];
                    m.x = processing.width/2 + processing.cos(processing.frameCount * 0.01 + i * 0.5) * 100;
                    m.y = processing.height/2 + processing.sin(processing.frameCount * 0.015 + i * 0.5) * 50;
                    
                    // Dibujar imán
                    processing.noStroke();
                    processing.fill(m.charge > 0 ? 0 : 255, 0, 0, 50);
                    processing.ellipse(m.x, m.y, 20, 20);
                }
                
                // Actualizar partículas
                for (let p of particles) {
                    // Aplicar fuerzas de los imanes
                    for (let m of magnets) {
                        let dx = m.x - p.x;
                        let dy = m.y - p.y;
                        let distanceSq = dx*dx + dy*dy;
                        let distance = processing.sqrt(distanceSq);
                        
                        // Evitar división por cero
                        if (distance < 5) distance = 5;
                        
                        // Fuerza magnética (inversamente proporcional al cuadrado de la distancia)
                        let force = (m.charge * 1000) / distanceSq;
                        
                        // Aplicar fuerza
                        p.vx += (dx / distance) * force * 0.1;
                        p.vy += (dy / distance) * force * 0.1;
                    }
                    
                    // Fricción
                    p.vx *= 0.98;
                    p.vy *= 0.98;
                    
                    // Actualizar posición
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    // Rebotar en los bordes
                    if (p.x < 0 || p.x > processing.width) p.vx *= -0.5;
                    if (p.y < 0 || p.y > processing.height) p.vy *= -0.5;
                    
                    // Mantener dentro de los límites
                    p.x = processing.constrain(p.x, 0, processing.width);
                    p.y = processing.constrain(p.y, 0, processing.height);
                    
                    // Dibujar partícula
                    processing.noStroke();
                    processing.fill(p.hue, 200, 255, 150);
                    processing.ellipse(p.x, p.y, 8, 8);
                }
            }
        };
    };
    
    // Inicializar Processing
    new Processing(canvas, sketch);
}

// ============================================
// Inicialización de todas las visualizaciones
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Estado de las animaciones
    window.animations = {
        physics: false,
        wave: false,
        fractal: false,
        magnetic: false
    };
    
    // Inicializar p5.js
    new p5(physicsSketch);
    new p5(waveSketch);
    new p5(fractalSketch);
    
    // Inicializar Processing.js
    initMagneticParticles();
    
    // Configurar botones de control
    document.querySelectorAll('.control-btn').forEach(btn => {
        const canvasId = btn.getAttribute('data-canvas');
        
        btn.addEventListener('click', function() {
            // Cambiar estado
            window.animations[canvasId] = !window.animations[canvasId];
            
            // Actualizar botón
            if (window.animations[canvasId]) {
                this.textContent = 'Detener';
                this.classList.add('playing');
            } else {
                this.textContent = 'Iniciar Animación';
                this.classList.remove('playing');
            }
        });
    });
});
