import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function FactoryIntroPage() {
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

  const handleEnterFactory = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      router.push('/factory/worldview');
    }, 1500);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* 🎥 背景视频 */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/IntroCreativityFactory.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🌌 黑色半透明遮罩 (增加文字可读性) */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

      {/* 🔆 霓虹绿光渐强动画 */}
      <div 
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                   rounded-full bg-emerald-500 pointer-events-none
                   shadow-[0_0_40px_rgba(0,255,100,0.8)]
                   transition-all duration-[1500ms] ease-out
                   ${isTransitioning ? 'opacity-100 scale-[2.5]' : 'opacity-0 scale-0'}`}
        style={{
          width: '100vh',
          height: '100vh',
        }}
      />

      {/* 🎭 文字 & 按钮 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        
        {/* 🕯️ 标题 - 增加克苏鲁幽光感 */}
        <h1 
          className={`text-emerald-400 text-5xl md:text-6xl font-lovecraft tracking-widest 
                      transition-opacity duration-700 ease-in-out 
                      drop-shadow-[0_0_15px_rgba(0,255,150,0.8)]
                      ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        >
          C r e a t i v e &nbsp; F a c t o r y
        </h1>

        {/* 📜 副标题 - 模仿古神低语的幽光 */}
        <p className={`text-emerald-300 mt-4 text-lg tracking-wider font-serif 
                       transition-opacity duration-700 ease-in-out 
                       drop-shadow-[0_0_10px_rgba(0,255,100,0.5)]
                       ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          让你的故事，在此诞生
        </p>

        {/* 🎬 进入创作工厂按钮 - 增加扭曲霓虹感 */}
        <button
          onClick={handleEnterFactory}
          className={`mt-10 text-emerald-400 text-2xl font-serif tracking-widest 
                     hover:text-emerald-300 transition-all duration-700 
                     hover:tracking-wider hover:scale-105 
                     px-8 py-4 rounded-md backdrop-blur-md 
                     border border-emerald-400 shadow-[0_0_15px_rgba(0,255,150,0.6)]
                     animate-[pulse_1.5s_infinite] relative
                     before:absolute before:inset-0 before:rounded-md
                     before:border before:border-emerald-400 before:opacity-60
                     before:animate-[twist_3s_infinite_linear]
                     ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
          disabled={isTransitioning}
        >
          <span className="animate-[flicker_1.8s_infinite]">
            S t a r t &nbsp; C r e a t i n g
          </span>
        </button>
      </div>
    </div>
  );
}
