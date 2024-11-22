import React, { useState, useEffect } from 'react';
import { Dice3 } from 'lucide-react';

export const DiceAnimation = ({ isRolling }) => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        let animationFrame;
        let startTime;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            if (isRolling) {
                setRotation(prev => (prev + 15) % 360);
                animationFrame = requestAnimationFrame(animate);
            }
        };

        if (isRolling) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            setRotation(0);
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isRolling]);

    return (
        <div 
            className="inline-block transition-all" 
            style={{ 
                transform: `rotate(${rotation}deg)`,
                transition: isRolling ? 'none' : 'transform 0.3s ease-out' 
            }}
        >
            <Dice3 className="w-6 h-6 text-emerald-400" />
        </div>
    );
};