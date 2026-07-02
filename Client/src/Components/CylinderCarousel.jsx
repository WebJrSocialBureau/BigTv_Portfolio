import React from "react";

export function CylinderCarousel({
  items,
  className,
  containerClassName,
  cardClassName,
  animationDuration = 24, // Rotation time in seconds
  cardWidth = 280,
  cardHeight = 180,
  ...props
}) {
  let displayItems = [...(items || [])];
  if (displayItems.length === 1) {
    displayItems = [displayItems[0], displayItems[0], displayItems[0]];
  } else if (displayItems.length === 2) {
    displayItems = [displayItems[0], displayItems[1], displayItems[0], displayItems[1]];
  }

  const count = displayItems.length;
  if (count === 0) return null;

  // Calculate 3D radius using trigonometry: radius = (cardWidth / 2) / tan(PI / count)
  // We use count for distribution angle = 360 / count
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / count));

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden py-12 ${containerClassName || ""}`}
      style={{
        perspective: "1200px",
        height: `${cardHeight + 80}px`,
      }}
      {...props}
    >
      {/* Rotating 3D Container */}
      <div
        className={`relative flex items-center justify-center cylinder-hover-pause ${className || ""}`}
        style={{
          transformStyle: "preserve-3d",
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          animation: `cylinder-spin ${animationDuration}s linear infinite`,
        }}
      >
        <style>{`
          @keyframes cylinder-spin {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
          .cylinder-hover-pause:hover {
            animation-play-state: paused !important;
          }
        `}</style>
        
        {displayItems.map((item, index) => {
          const angle = (360 / count) * index;
          return (
            <div
              key={index}
              className={`absolute inset-0 rounded-2xl border border-white/5 bg-neutral-950/90 shadow-2xl p-5 hover:border-[#2563eb]/40 hover:bg-neutral-900 transition-all duration-300 select-none ${cardClassName || ""}`}
              style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden", // ensures card isn't visible from behind
              }}
            >
              {item.src ? (
                // Simple Image Mode if requested
                <img
                  src={item.src}
                  alt={item.alt || `carousel-item-${index}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                // Rich Editorial Log Mode
                <div className="w-full h-full flex flex-col justify-between text-left p-1">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="px-2.5 py-0.5 rounded bg-[#2563eb]/10 text-[#2563eb] text-[9px] md:text-[10px] font-mono font-bold uppercase tracking-wider">
                        {item.tag}
                      </span>
                      <span className="font-mono text-[9px] md:text-[10px] text-neutral-500">{item.date}</span>
                    </div>
                    <h4 className="font-display font-black text-xs md:text-sm tracking-tight mb-2 uppercase text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="font-body text-[11px] md:text-xs text-neutral-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  {item.code && (
                    <div className="font-mono text-[9px] md:text-[10px] text-neutral-600 border-t border-white/5 pt-2 mt-1 uppercase">
                      LOG ID: {item.code}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CylinderCarousel;
