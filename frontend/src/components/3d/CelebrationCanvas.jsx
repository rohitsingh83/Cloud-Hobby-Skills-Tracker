import confetti from "canvas-confetti";

export function triggerMilestoneCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // Multi-tier fireworks burst
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#00F0FF', '#A855F7', '#EC4899']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#F59E0B', '#10B981', '#3B82F6']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#E0F2FE', '#FDF4FF']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}
