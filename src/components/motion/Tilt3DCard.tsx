import React, { useRef, useState } from 'react';
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
  maxTilt = 10,
  scaleOnHover = 1.025,
  glareOpacity = 0.22,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates: -0.5 to 0.5
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mouse position in percentage for specular glare (0% to 100%)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // Spring physics for buttery-smooth tilting
  const springConfig = { stiffness: 260, damping: 22 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);
  const scale = useSpring(isHovered ? scaleOnHover : 1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const normX = mouseX / width - 0.5;
    const normY = mouseY / height - 0.5;

    x.set(normX);
    y.set(normY);

    setGlarePos({
      x: Math.round((mouseX / width) * 100),
      y: Math.round((mouseY / height) * 100),
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

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
      }}
      className={`relative cursor-pointer transition-shadow duration-300 ${className}`}
    >
      {/* Card Content with 3D Depth */}
      <div className="relative z-10 h-full w-full" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>

      {/* Dynamic Specular Sheen Glare */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isHovered ? glareOpacity : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.65), transparent 75%)`,
          pointerEvents: 'none',
        }}
        className="absolute inset-0 z-20 rounded-[inherit] overflow-hidden mix-blend-overlay"
      />
    </motion.div>
  );
};
