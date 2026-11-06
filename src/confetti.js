/**
 * =======================================================================
 * CELEBRATION PARTICLES & CONFETTI (Pure Canvas Art Effect)
 * =======================================================================
 * Menghasilkan semburan confetti berbentuk hati, bintang, dan buih ombak
 * saat kata 'cwtch' berhasil terbuka di peti harta karun.
 */

export function launchCelebration() {
  const canvas = document.createElement("canvas");
  canvas.id = "celebration-canvas";
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ["#e76f51", "#f4a261", "#e9c46a", "#2a9d8f", "#264653", "#ff758f", "#ffffff"];
  const particles = [];
  const particleCount = 100;

  // Particle types: heart (0), circle (1), sparkle star (2)
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * 60,
      y: height / 2 + 100,
      vx: (Math.random() - 0.5) * 14,
      vy: -(Math.random() * 16 + 8),
      size: Math.random() * 12 + 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: Math.floor(Math.random() * 3),
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      gravity: 0.35,
      friction: 0.98
    });
  }

  function drawHeart(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size * 1.2);
    ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawStar(ctx, x, y, size, color, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
      ctx.lineTo(
        Math.cos(((i + 0.5) * Math.PI) / 2) * (size * 0.28),
        Math.sin(((i + 0.5) * Math.PI) / 2) * (size * 0.28)
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  let animationFrame;
  let startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    let activeCount = 0;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.rotation += p.vRot;

      if (p.y > height * 0.2) {
        p.opacity -= 0.007;
      }

      if (p.opacity > 0 && p.y < height + 50) {
        activeCount++;
        ctx.globalAlpha = Math.max(0, p.opacity);

        if (p.type === 0) {
          drawHeart(ctx, p.x, p.y, p.size, p.color, p.rotation);
        } else if (p.type === 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          drawStar(ctx, p.x, p.y, p.size, p.color, p.rotation);
        }
      }
    });

    if (activeCount > 0 && Date.now() - startTime < 8000) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  animate();
}

