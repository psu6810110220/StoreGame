import React, { useEffect, useState, memo } from 'react';

// Define Snowflake Interface
interface Snowflake {
    id: number;
    left: number;
    animationDuration: number;
    animationDelay: number;
    opacity: number;
    size: number;
}

const SnowBackground: React.FC = memo(() => {
    const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

    useEffect(() => {
        // Generate static random values ONCE on mount
        const flakes: Snowflake[] = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            animationDuration: 10 + Math.random() * 10,
            animationDelay: Math.random() * 5,
            opacity: 0.2 + Math.random() * 0.5,
            size: 0.2 + Math.random() * 0.5
        }));
        setSnowflakes(flakes);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <div
                    key={flake.id}
                    className="absolute top-[-10%] text-white animate-fall"
                    style={{
                        left: `${flake.left}%`,
                        fontSize: `${flake.size}rem`,
                        opacity: flake.opacity,
                        animation: `fall ${flake.animationDuration}s linear infinite`,
                        animationDelay: `-${flake.animationDelay}s`,
                        willChange: 'transform'
                    }}
                >
                    ❄
                </div>
            ))}

            {/* 🎄 Decoration: Christmas Tree (Bottom Left) */}
            <div className="absolute bottom-[-20px] left-[-20px] text-[8rem] md:text-[12rem] opacity-20 filter blur-[2px] transform -rotate-12 select-none z-0">
                🎄
            </div>

            {/* 🦌 Decoration: Reindeer (Bottom Right) */}
            <div className="absolute bottom-[-20px] right-[-20px] text-[8rem] md:text-[12rem] opacity-20 filter blur-[2px] transform rotate-12 select-none z-0 scale-x-[-1]">
                🦌
            </div>

            <style>{`
        @keyframes fall {
          0% {
            transform: translate3d(-10px, -10vh, 0) rotate(0deg); 
          }
          100% {
            transform: translate3d(10px, 110vh, 0) rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
});

export default SnowBackground;
