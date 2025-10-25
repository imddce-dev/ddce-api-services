"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadLinksPreset } from "@tsparticles/preset-links";

export default function ParticlesNetwork() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadLinksPreset(engine); // โหลด preset network
    }).then(() => {
      setInitialized(true);
    });
  }, []);

  if (!initialized) return null;

  return (
    <Particles
      id="tsparticles-network"
      options={{
        preset: "links",
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: "#05091c", // พื้นหลังดำ
        },
        particles: {
          color: { value: "#4cd6ea" }, // Matrix Green
          links: {
            color: "#4cd6ea",
            opacity: 0.5,
            distance: 150,
            width: 1,
          },
          move: { speed: 1 },
          number: { value: 60 },
        },
      }}
    />
  );
}
