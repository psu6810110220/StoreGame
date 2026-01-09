import React from 'react';

const SnowBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
            {/* Layer 1 - Seamless Pair */}
            <div className="snow-layer layer-1"></div>
            <div className="snow-layer layer-1 offset-layer"></div>

            {/* Layer 2 - Seamless Pair */}
            <div className="snow-layer layer-2"></div>
            <div className="snow-layer layer-2 offset-layer"></div>

            {/* Layer 3 - Seamless Pair */}
            <div className="snow-layer layer-3"></div>
            <div className="snow-layer layer-3 offset-layer"></div>

            <style>{`
                .snow-layer {
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: transparent;
                    border-radius: 50%;
                    animation: snow-fall linear infinite;
                }

                .offset-layer {
                    top: -100vh; /* Start strictly above the viewport */
                }
                
                .layer-1 {
                    width: 10px;
                    height: 10px;
                    /* Updated to 100vh height spread for seamless loop */
                    box-shadow: 
                        10vw 10vh #fff, 20vw 80vh #fff, 30vw 30vh #fff, 40vw 60vh #fff, 
                        50vw 90vh #fff, 60vw 15vh #fff, 70vw 70vh #fff, 80vw 25vh #fff, 
                        90vw 50vh #fff, 5vw 45vh #fff, 15vw 85vh #fff, 25vw 5vh #fff;
                    animation-duration: 15s;
                    opacity: 0.8;
                }

                .layer-2 {
                    width: 6px;
                    height: 6px;
                    box-shadow: 
                        5vw 10vh #fff, 15vw 60vh #fff, 25vw 20vh #fff, 35vw 70vh #fff, 
                        45vw 30vh #fff, 55vw 80vh #fff, 65vw 40vh #fff, 75vw 90vh #fff, 
                        85vw 15vh #fff, 95vw 55vh #fff, 10vw 35vh #fff, 30vw 95vh #fff;
                    animation-duration: 25s;
                    opacity: 0.5;
                }

                .layer-3 {
                    width: 4px;
                    height: 4px;
                    box-shadow: 
                        2vw 10vh #fff, 12vw 50vh #fff, 22vw 30vh #fff, 32vw 70vh #fff, 
                        42vw 20vh #fff, 52vw 60vh #fff, 62vw 15vh #fff, 72vw 55vh #fff, 
                        82vw 90vh #fff, 92vw 35vh #fff, 8vw 25vh #fff, 18vw 80vh #fff;
                    animation-duration: 35s;
                    opacity: 0.3;
                }

                @keyframes snow-fall {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100vh); }
                }
            `}</style>
        </div>
    );
};

export default SnowBackground;
