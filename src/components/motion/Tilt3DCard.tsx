import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface Tilt3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scaleOnHover?: number;
  glareOpacity?: number;
  onClick?: () => void;
}

export const Tilt3DCard: React.FC<Tilt3DCardProps> = ({
  children,
  className = '',
  maxTilt = 8,
  scaleOnHover = 1.02,
  glareOpacity = 0.2,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ width: number; height: number; left: number; top: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates: -0.5 to 0.5 (driven via MotionValues - 0 React re-renders)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for buttery-smooth tilting (GPU accelerated)
  const springConfig = { stiffness: 280, damping: 25 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);
  const scale = useSpring(isHovered ? scaleOnHover : 1, springConfig);

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      rectRef.current = {
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
      };
    }
    setIsHovered(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;
    const { width, height, left, top } = rectRef.current;

    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const normX = mouseX / width - 0.5;
    const normY = mouseY / height - 0.5;

    x.set(normX);
    y.set(normY);

    if (glareRef.current) {
      const gx = Math.round((mouseX / width) * 100);
      const gy = Math.round((mouseY / height) * 100);
      glareRef.current.style.background = `radial-gradient(circle 240px at ${gx}% ${gy}%, rgba(255, 255, 255, 0.65), transparent 75%)`;
    }
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rectRef.current = null;
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: 'preserve-3d',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
      className={`relative cursor-pointer transition-shadow duration-300 transform-gpu ${className}`}
    >
      {/* Card Content with 3D Depth */}
      <div className="relative z-10 h-full w-full" style={{ transform: 'translateZ(16px)' }}>
        {children}
      </div>

      {/* Dynamic Specular Sheen Glare */}
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{
          opacity: isHovered ? glareOpacity : 0,
          transition: 'opacity 0.25s ease',
          pointerEvents: 'none',
        }}
        className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden mix-blend-overlay"
      />
    </motion.div>
  );
};
