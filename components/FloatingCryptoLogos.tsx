import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface CryptoLogo {
  id: string;
  name: string;
  logo: string;
}

const cryptoLogos: CryptoLogo[] = [
  { id: 'bitcoin', name: 'Bitcoin', logo: '/crypto-logos/bitcoin.png' },
  { id: 'ethereum', name: 'Ethereum', logo: '/crypto-logos/ethereum.png' },
  { id: 'binancecoin', name: 'BNB', logo: '/crypto-logos/binancecoin.png' },
  { id: 'ripple', name: 'XRP', logo: '/crypto-logos/ripple.png' },
  { id: 'cardano', name: 'Cardano', logo: '/crypto-logos/cardano.png' },
];

interface FloatingLogoProps {
  crypto: CryptoLogo;
  index: number;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({ crypto, index }) => {
  // Pre-calculate random values to avoid using Math.random() in render
  const animationConfig = useMemo(() => {
    // Create a grid-based distribution to prevent overlapping
    const cols = 5;
    const rows = 2;
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // Base position with grid spacing (10-90% range)
    const baseX = 10 + (col * 80 / (cols - 1));
    const baseY = 20 + (row * 60 / (rows - 1));
    
    // Add slight offset based on index for variation
    const seed = index * 47.123;
    const offsetX = Math.sin(seed) * 8;
    const offsetY = Math.cos(seed) * 8;
    
    const x = baseX + offsetX;
    const y = baseY + offsetY;
    
    const duration = 20 + (Math.sin(seed * 2) + 1) * 5; // 20-30 seconds (moderate speed)
    const delay = (Math.cos(seed * 3) + 1) * 2;
    const size = 56 + (Math.sin(seed * 4) + 1) * 12; // 56-80px
    const opacity = 0.35 + (Math.cos(seed * 5) + 1) * 0.1; // 0.35-0.55 (balanced)
    
    // Smaller movement to keep logos in their zones
    const xMovement = 20 + (Math.sin(seed * 6) + 1) * 10; // 20-40px
    const yMovement = 20 + (Math.cos(seed * 7) + 1) * 10; // 20-40px
    
    return { x, y, duration, delay, size, opacity, xMovement, yMovement };
  }, [index]);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${animationConfig.x}%`,
        top: `${animationConfig.y}%`,
      }}
      initial={{
        x: 0,
        y: 0,
        opacity: animationConfig.opacity * 0.5,
      }}
      animate={{
        x: [
          0,
          animationConfig.xMovement,
          -animationConfig.xMovement,
          0,
        ],
        y: [
          0,
          -animationConfig.yMovement,
          animationConfig.yMovement,
          0,
        ],
        opacity: [animationConfig.opacity * 0.5, animationConfig.opacity, animationConfig.opacity, animationConfig.opacity * 0.5],
      }}
      transition={{
        duration: animationConfig.duration,
        delay: animationConfig.delay,
        repeat: Infinity,
        ease: 'easeInOut',
        repeatType: 'loop',
      }}
    >
      <img
        src={crypto.logo}
        alt={crypto.name}
        style={{ width: `${animationConfig.size}px`, height: `${animationConfig.size}px` }}
        className="object-contain"
        loading="eager"
      />
    </motion.div>
  );
};

const FloatingCryptoLogos: React.FC = () => {
  // Create multiple instances of each logo
  const logoInstances = useMemo(() => {
    const instances: Array<{ crypto: CryptoLogo; instanceId: number }> = [];
    
    // Create 2 instances of each logo for better coverage
    cryptoLogos.forEach((crypto, cryptoIndex) => {
      for (let i = 0; i < 2; i++) {
        instances.push({
          crypto,
          instanceId: cryptoIndex * 2 + i,
        });
      }
    });
    
    return instances;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {logoInstances.map(({ crypto, instanceId }) => (
        <FloatingLogo
          key={`${crypto.id}-${instanceId}`}
          crypto={crypto}
          index={instanceId}
        />
      ))}
    </div>
  );
};

export default FloatingCryptoLogos;
