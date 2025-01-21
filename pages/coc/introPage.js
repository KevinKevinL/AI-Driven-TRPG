import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function IntroPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);
  
  const handleEnterGame = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/coc/mainplay');
    }, 1200); // 延长一点转场时间，使动画更流畅
  };
  
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/DeadRay.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Circular transition overlay */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   rounded-full bg-white pointer-events-none
                   transition-all duration-1200 ease-out
                   ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
        style={{
          width: '100vh', // 使用视口高度作为基准
          height: '100vh',
          transform: isTransitioning 
            ? 'translate(-50%, -50%) scale(2.5)' 
            : 'translate(-50%, -50%) scale(0)',
        }}
      />
      
      {/* Central button container with horror-themed styling */}
      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={handleEnterGame}
          className={`text-emerald-400 text-2xl font-serif tracking-widest 
                     hover:text-emerald-300 transition-all duration-700 
                     hover:tracking-wider hover:scale-105
                     px-8 py-4 rounded-none backdrop-blur-sm
                     animate-pulse
                     ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          disabled={isTransitioning}
        >
          M e r g e &nbsp; i n t o &nbsp; t h e &nbsp; S t o r y
        </button>
      </div>
    </div>
  );
}