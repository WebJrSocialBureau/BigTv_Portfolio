import * as React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_TRANSITION = {
  type: "spring",
  bounce: 0.16,
  duration: 0.85,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function DiagonalCarousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  loop = true,
  slideSize = 260,
  rotationStep = 15,
  verticalStep = 60,
  inactiveScale = 0.7,
  transition = DEFAULT_TRANSITION,
  showControls = true,
  showDots = true,
  viewportClassName,
  slideClassName,
  imageClassName,
  labelClassName,
  controlsClassName,
  className,
  onKeyDown,
  tabIndex,
  ...props
}) {
  const maxIndex = Math.max(0, items.length - 1);
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(() =>
    clamp(defaultActiveIndex, 0, maxIndex)
  );
  const currentIndex = clamp(activeIndex ?? uncontrolledIndex, 0, maxIndex);
  const [windowWidth, setWindowWidth] = React.useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const safeSlideSize = windowWidth < 640 ? 210 : windowWidth < 1024 ? 260 : Math.max(120, slideSize);
  const safeRotationStep = windowWidth < 640 ? 10 : rotationStep;
  const safeVerticalStep = windowWidth < 640 ? 40 : verticalStep;
  const safeInactiveScale = clamp(inactiveScale, 0.35, 1);

  const selectSlide = React.useCallback(
    (nextIndex) => {
      if (!items.length) {
        return;
      }

      const resolvedIndex = loop
        ? (nextIndex + items.length) % items.length
        : clamp(nextIndex, 0, maxIndex);

      if (activeIndex === undefined) {
        setUncontrolledIndex(resolvedIndex);
      }

      onActiveIndexChange?.(resolvedIndex);
    },
    [activeIndex, items.length, loop, maxIndex, onActiveIndexChange]
  );

  const handleKeyDown = (event) => {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setAutoplayStopped(true);
      selectSlide(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      setAutoplayStopped(true);
      selectSlide(currentIndex + 1);
    }
  };

  const [autoplayStopped, setAutoplayStopped] = React.useState(false);

  React.useEffect(() => {
    if (!loop || autoplayStopped) return;

    const interval = setInterval(() => {
      selectSlide(currentIndex + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, [loop, currentIndex, autoplayStopped, selectSlide]);

  if (!items.length) {
    return null;
  }

  const isPreviousDisabled = !loop && currentIndex === 0;
  const isNextDisabled = !loop && currentIndex === maxIndex;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Diagonal image carousel"
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      className={cn("relative isolate h-full w-full overflow-hidden select-none", className)}
      {...props}
    >
      <div className={cn("absolute inset-0 overflow-hidden", viewportClassName)}>
        <motion.div
          className="absolute left-1/2 top-[10%] sm:top-[15%] md:top-[20%] flex w-fit"
          animate={{ x: -(currentIndex * safeSlideSize + safeSlideSize / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const distance = index - currentIndex;
            const accentColor = item.accentColor || '#e30613';
            const isUnpaid = item.isPaid === false;

            return (
              <motion.div
                key={`${item.src}-${index}`}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-4 will-change-transform",
                  slideClassName
                )}
                style={{ width: safeSlideSize }}
                animate={{
                  rotate: distance * safeRotationStep,
                  scale: isActive ? 1.08 : safeInactiveScale,
                  y: distance * safeVerticalStep,
                }}
                transition={transition}
              >
                <motion.p
                  className={cn(
                    "whitespace-nowrap text-xs md:text-sm font-mono tracking-[0.25em] uppercase font-black transition-all duration-300",
                    isActive 
                      ? "border-b-2 pb-1 px-3" 
                      : "text-neutral-400 dark:text-neutral-500 border-b-2 border-transparent pb-1",
                    labelClassName
                  )}
                  style={isActive ? { color: accentColor, borderColor: accentColor } : {}}
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    scale: isActive ? 1.05 : 0.9,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.p>

                <button
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="aspect-[3/4] w-[180px] md:w-[220px] cursor-pointer overflow-hidden rounded-2xl transition-all duration-500"
                  style={{
                    border: isActive
                      ? `3px solid ${accentColor}`
                      : '2px solid rgba(200,200,200,0.3)',
                    boxShadow: isActive
                      ? `0 0 30px ${accentColor}55, 0 20px 60px rgba(0,0,0,0.18)`
                      : `0 4px 20px rgba(0,0,0,0.08)`,
                  }}
                  onClick={() => {
                    setAutoplayStopped(true);
                    if (isUnpaid) {
                      window.location.hash = `#/pending-payment?name=${encodeURIComponent(item.title)}&role=${encodeURIComponent(item.role || "BIG TV Newsroom")}`;
                      return;
                    }
                    if (isActive) {
                      if (item.link) {
                        if (item.link.startsWith('http')) {
                          window.location.href = item.link;
                        } else {
                          window.location.hash = item.link;
                        }
                      }
                    } else {
                      selectSlide(index);
                    }
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={item.src}
                      alt={item.alt ?? item.title}
                      draggable={false}
                      className={cn(
                        "h-full w-full select-none object-cover transition-all duration-500 hover:scale-105",
                        isUnpaid ? "blur-md opacity-35 grayscale" : "",
                        imageClassName
                      )}
                    />
                    {isUnpaid && (
                      <div className="absolute inset-0 flex flex-col items-center justify-between p-4 bg-black/60 backdrop-blur-[1px] z-10 text-center">
                        <span className="font-mono text-[8px] sm:text-[9px] font-black text-red-500 bg-red-950/90 px-2 py-1 rounded border border-red-500/30 uppercase tracking-widest leading-none mt-2">
                          Amount Pending
                        </span>
                        <img 
                          src="https://www.socialbureau.in/assets/logo.webp" 
                          alt="Social Bureau" 
                          className="h-6 sm:h-7 w-auto opacity-30 -rotate-12 select-none pointer-events-none border border-white/5 px-2 py-1.5 rounded bg-white/[0.01]"
                        />
                        <div className="w-2 h-2" />
                      </div>
                    )}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {showControls && (
        <div
          className={cn(
            "absolute inset-x-4 bottom-5 z-10 mx-auto flex w-fit items-center justify-center gap-3 px-3 py-1.5",
            controlsClassName
          )}
          style={{
            borderRadius: '9999px',
            background: 'rgba(15, 12, 41, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          {/* Prev button */}
          <button
            type="button"
            aria-label="Show previous slide"
            disabled={isPreviousDisabled}
            className="inline-flex size-9 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: '#a78bfa' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.18)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(167,139,250,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            onClick={() => {
              setAutoplayStopped(true);
              selectSlide(currentIndex - 1);
            }}
          >
            <ChevronLeft className="size-5" />
          </button>

          {/* Colorful dots */}
          {showDots && (
            <div className="flex items-center justify-center gap-2">
              {items.map((item, index) => {
                const dotColor = item.accentColor || '#e30613';
                const isActiveDot = currentIndex === index;
                return (
                  <button
                    key={`${item.title}-${index}`}
                    type="button"
                    aria-label={`Show slide ${index + 1}: ${item.title}`}
                    aria-current={isActiveDot ? "true" : undefined}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: isActiveDot ? '28px' : '8px',
                      background: isActiveDot ? dotColor : 'rgba(255,255,255,0.25)',
                      boxShadow: isActiveDot ? `0 0 10px ${dotColor}cc, 0 0 4px ${dotColor}` : 'none',
                      opacity: isActiveDot ? 1 : 0.5,
                    }}
                    onClick={() => {
                      setAutoplayStopped(true);
                      selectSlide(index);
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Next button */}
          <button
            type="button"
            aria-label="Show next slide"
            disabled={isNextDisabled}
            className="inline-flex size-9 items-center justify-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: '#34d399' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.18)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(52,211,153,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
            onClick={() => {
              setAutoplayStopped(true);
              selectSlide(currentIndex + 1);
            }}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default DiagonalCarousel;
