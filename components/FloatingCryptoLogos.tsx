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
    const seed = index * 123.456;
    
    // Generate pseudo-random values based on index
    const x = (Math.sin(seed) * 40 + 50) % 100;
    const y = (Math.cos(seed) * 40 + 50) % 100;
    const duration = 20 + (Math.sin(seed * 2) + 1) * 5; // 20-30 seconds (moderate speed)
    const delay = (Math.cos(seed * 3) + 1) * 2;
    const size = 48 + (Math.sin(seed * 4) + 1) * 16; // 48-80px
    const opacity = 0.3 + (Math.cos(seed * 5) + 1) * 0.15; // 0.3-0.6 (more visible)
    
    // Smaller movement range for smoother, subtle float
    const xMovement = 15 + (Math.sin(seed * 6) + 1) * 5; // 15-25
    const yMovement = 15 + (Math.cos(seed * 7) + 1) * 5; // 15-25
    
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
