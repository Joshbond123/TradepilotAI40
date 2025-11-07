import React from 'react';
import { motion } from 'framer-motion';

interface ExchangeLogo {
    name: string;
    image: string;
}

const exchanges: ExchangeLogo[] = [
    { name: 'Binance', image: '/exchange-logos/binance.png' },
    { name: 'Coinbase', image: '/exchange-logos/coinbase.png' },
    { name: 'Kraken', image: '/exchange-logos/kraken.png' },
    { name: 'KuCoin', image: '/exchange-logos/kucoin.png' },
    { name: 'OKX', image: '/exchange-logos/okx.png' },
    { name: 'Bybit', image: '/exchange-logos/bybit.png' },
    { name: 'Bitfinex', image: '/exchange-logos/bitfinex.png' },
    { name: 'Crypto.com', image: '/exchange-logos/crypto-com.png' },
    { name: 'Gate.io', image: '/exchange-logos/gate-io.png' },
    { name: 'Gemini', image: '/exchange-logos/gemini.png' },
];

const ExchangeLogosMarquee: React.FC = () => {
    const duplicatedExchanges = [...exchanges, ...exchanges, ...exchanges];

    return (
        <div className="relative w-full overflow-hidden py-16 bg-gradient-to-b from-brand-bg via-brand-surface/5 to-brand-bg">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-transparent to-brand-bg pointer-events-none z-10"></div>
            
            <div className="text-center mb-12 relative z-20">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-sm uppercase tracking-widest text-brand-text-secondary mb-3"
                >
                    Trusted Integration Partners
                </motion.p>
                <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-2xl md:text-3xl font-bold text-white"
                >
                    Connected to <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">Leading Exchanges</span>
                </motion.h3>
            </div>

            <div className="relative flex items-center justify-center">
                <motion.div
                    className="flex gap-16 md:gap-20"
                    animate={{
                        x: [0, -33.33 + '%'],
                    }}
                    transition={{
                        x: {
                            duration: 40,
                            repeat: Infinity,
                            ease: "linear",
                        },
                    }}
                >
                    {duplicatedExchanges.map((exchange, index) => (
                        <motion.div
                            key={`${exchange.name}-${index}`}
                            className="flex-shrink-0 group relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div 
                                    className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-brand-primary/50 transition-all duration-300"
                                    style={{
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 245, 255, 0.1)',
                                    }}
                                ></div>
                                
                                <div className="relative z-10 p-6 flex items-center justify-center">
                                    <img
                                        src={exchange.image}
                                        alt={exchange.name}
                                        className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                                        style={{
                                            filter: 'drop-shadow(0 4px 12px rgba(0, 245, 255, 0.2)) brightness(0.9)',
                                        }}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const fallback = document.createElement('div');
                                                fallback.className = 'text-brand-primary text-sm font-bold text-center';
                                                fallback.textContent = exchange.name;
                                                parent.appendChild(fallback);
                                            }
                                        }}
                                    />
                                </div>
                                
                                <div 
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                ></div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center mt-12 text-sm text-brand-text-secondary"
            >
                Seamlessly executing arbitrage across all major global exchanges
            </motion.p>
        </div>
    );
};

export default ExchangeLogosMarquee;
