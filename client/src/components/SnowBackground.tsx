import React, { useEffect, useState } from 'react';

const SnowBackground: React.FC = () => {
    const [snowflakes, setSnowflakes] = useState<number[]>([]);

    useEffect(() => {
        // Generate 50 snowflakes
        const flakes = Array.from({ length: 50 }, (_, i) => i);
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((i) => {
                const left = Math.random() * 100;
                const animationDuration = 5 + Math.random() * 10;
                const animationDelay = Math.random() * 5;
                const opacity = 0.3 + Math.random() * 0.7;
                const size = 0.2 + Math.random() * 0.8; // rem

                return (
                    <div
                        key={i}
                        className="absolute top-[-10%] text-white animate-fall"
                        style={{
                            left: `${left}%`,
                            fontSize: `${size}rem`,
                            opacity: opacity,
                            animation: `fall ${animationDuration}s linear infinite`,
                            animationDelay: `-${animationDelay}s`,
                            textShadow: '0 0 5px rgba(255,255,255,0.8)'
                        }}
                    >
                        ❄
                    </div>
                );
            })}
            <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) translateX(-10px) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) translateX(10px) rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
};

export default SnowBackground;
