import React from 'react';

const SnowBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="snow-layer layer-1"></div>
            <div className="snow-layer layer-2"></div>
            <div className="snow-layer layer-3"></div>
            <style>{`
                .snow-layer {
                    position: absolute;
                    top: -10px;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: transparent;
                    border-radius: 50%;
                    animation: snow-fall linear infinite;
                }
                
                .layer-1 {
                    width: 10px;
                    height: 10px;
                    box-shadow: 
                        10vw 10vh #fff, 20vw 80vh #fff, 30vw 20vh #fff, 40vw 60vh #fff, 
                        50vw 90vh #fff, 60vw 30vh #fff, 70vw 70vh #fff, 80vw 10vh #fff, 
                        90vw 50vh #fff, 5vw 40vh #fff, 15vw 90vh #fff, 25vw 10vh #fff;
                    animation-duration: 10s;
                    opacity: 0.8;
                }

                .layer-2 {
                    width: 6px;
                    height: 6px;
                    box-shadow: 
                        5vw 20vh #fff, 15vw 70vh #fff, 25vw 30vh #fff, 35vw 90vh #fff, 
                        45vw 10vh #fff, 55vw 50vh #fff, 65vw 80vh #fff, 75vw 20vh #fff, 
                        85vw 60vh #fff, 95vw 10vh #fff, 10vw 50vh #fff, 30vw 80vh #fff;
                    animation-duration: 15s;
                    opacity: 0.5;
                }

                .layer-3 {
                    width: 4px;
                    height: 4px;
                    box-shadow: 
                        2vw 10vh #fff, 12vw 60vh #fff, 22vw 30vh #fff, 32vw 80vh #fff, 
                        42vw 20vh #fff, 52vw 70vh #fff, 62vw 10vh #fff, 72vw 50vh #fff, 
                        82vw 90vh #fff, 92vw 40vh #fff, 8vw 30vh #fff, 18vw 80vh #fff;
                    animation-duration: 20s;
                    opacity: 0.3;
                }

                @keyframes snow-fall {
                    0% { transform: translateY(-10vh); }
                    100% { transform: translateY(110vh); }
                }
            `}</style>
        </div>
    );
};

export default SnowBackground;
