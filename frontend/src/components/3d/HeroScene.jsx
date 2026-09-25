import React, { useRef, useEffect } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00f0ff, 3, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 3, 50);
    pointLight2.position.set(-5, -3, 3);
    scene.add(pointLight2);

    // 3. Central Skill Core (Rotating 3D Torus Knot)
    const coreGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 120, 24);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0x11172e,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.9,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // 4. Orbiting Skill Nodes (Icosahedrons & Octahedrons)
    const nodes = [];
    const nodeColors = [0x00f0ff, 0xf59e0b, 0xec4899, 0x10b981, 0xa855f7];
    const nodeCount = 5;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3.6;
      const geom = i % 2 === 0 ? new THREE.IcosahedronGeometry(0.4, 0) : new THREE.OctahedronGeometry(0.4, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: nodeColors[i],
        emissive: nodeColors[i],
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 2);
      scene.add(mesh);
      nodes.push({ mesh, angle, speed: 0.008 + (i * 0.002), radius });
    }

    // 5. Particle Starfield
    const particlesCount = 350;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 25;
    }
    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x64748b,
      transparent: true,
      opacity: 0.6
    });
    const particlesMesh = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particlesMesh);

    // 6. Interactive Mouse Movement
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 7. Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Core rotation with mouse parallax
      coreMesh.rotation.x += 0.005;
      coreMesh.rotation.y += 0.007;
      coreMesh.rotation.y += mouseX * 0.02;
      coreMesh.rotation.x += mouseY * 0.02;

      // Orbiting nodes
      nodes.forEach((node) => {
        node.angle += node.speed;
        node.mesh.position.x = Math.cos(node.angle) * node.radius;
        node.mesh.position.y = Math.sin(node.angle) * node.radius;
        node.mesh.rotation.x += 0.02;
        node.mesh.rotation.y += 0.02;
      });

      // Subtle starfield float
      particlesMesh.rotation.y += 0.0008;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full min-h-[420px] relative pointer-events-auto cursor-grab active:cursor-grabbing"
      aria-label="Interactive 3D Skill Galaxy Canvas"
    />
  );
}
