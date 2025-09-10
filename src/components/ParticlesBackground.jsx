import React from 'react';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

function ParticlesBackground({ variant = "auth" }) {
  const initParticles = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const optionsByVariant = {
    auth: {
      background: { color: { value: "#0b1020" } },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 70, density: { enable: true, area: 800 } },
        color: { value: "#64b5f6" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: { min: 1, max: 3 } },
        links: { enable: true, color: "#64b5f6", distance: 140, opacity: 0.4, width: 1 },
        move: { enable: true, speed: 1.1, outModes: { default: "bounce" } }
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "grab" },
          onClick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.55 } },
          push: { quantity: 2 }
        }
      }
    },
    home: {
      background: { color: { value: "#020913" } },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 55, density: { enable: true, area: 900 } },
        color: { value: ["#00e5ff", "#00c853", "#ffea00"] },
        shape: { type: "circle" },
        opacity: { value: 0.35 },
        size: { value: { min: 1, max: 4 } },
        links: { enable: true, color: "#ffffff", distance: 180, opacity: 0.25, width: 1 },
        move: { enable: true, speed: 0.8, outModes: { default: "out" } }
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "repulse" },
          onClick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          push: { quantity: 2 }
        }
      }
    },
    customize: {
      background: { color: { value: "#001b1f" } },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 40, density: { enable: true, area: 1000 } },
        color: { value: "#80cbc4" },
        shape: { type: "triangle" },
        opacity: { value: 0.3 },
        size: { value: { min: 2, max: 6 } },
        links: { enable: true, color: "#80cbc4", distance: 200, opacity: 0.2, width: 1 },
        move: { enable: true, speed: 0.6, outModes: { default: "out" } }
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: "attract" },
          onClick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          attract: { distance: 150, duration: 0.2, factor: 2 },
          push: { quantity: 2 }
        }
      }
    }
  };

  const options = optionsByVariant[variant] || optionsByVariant.auth;

  return (
    <div className='absolute inset-0 -z-10'>
      <Particles id={`tsparticles-${variant}`} init={initParticles} options={options} />
    </div>
  );
}

export default ParticlesBackground;


