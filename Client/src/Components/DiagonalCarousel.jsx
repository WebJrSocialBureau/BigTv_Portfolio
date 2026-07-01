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
  const safeSlideSize = Math.max(120, slideSize);
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
          className="absolute left-[38%] top-[25%] md:left-[45%] flex w-fit"
          animate={{ x: -(currentIndex * safeSlideSize + safeSlideSize / 2) }}
          transition={transition}
        >
          {items.map((item, index) => {
            const isActive = currentIndex === index;
            const distance = index - currentIndex;

            return (
              <motion.div
                key={`${item.src}-${index}`}
                className={cn(
                  "flex shrink-0 flex-col items-center gap-4 will-change-transform",
                  slideClassName
                )}
                style={{ width: safeSlideSize }}
                animate={{
                  rotate: distance * rotationStep,
                  scale: isActive ? 1.05 : safeInactiveScale,
                  y: distance * verticalStep,
                }}
                transition={transition}
              >
                <motion.p
                  className={cn("whitespace-nowrap text-xs md:text-sm font-mono tracking-widest uppercase font-bold text-neutral-800 dark:text-white", labelClassName)}
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {item.title}
                </motion.p>

                <button
                  type="button"
                  aria-label={`Show ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="aspect-[3/4] w-[180px] md:w-[220px] cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800"
                  onClick={() => {
                    setAutoplayStopped(true);
                    if (isActive) {
                      if (item.link) {
                        window.location.hash = item.link;
                      }
                    } else {
                      selectSlide(index);
                    }
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt ?? item.title}
                    draggable={false}
                    className={cn(
                      "h-full w-full select-none object-cover shadow-2xl transition-all duration-500 hover:scale-105",
                      imageClassName
                    )}
                  />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {showControls && (
        <div
          className={cn(
            "absolute inset-x-4 bottom-5 z-10 mx-auto flex w-fit items-center justify-center gap-3 rounded-full border border-neutral-300/80 bg-neutral-200/70 px-2 text-neutral-700 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-neutral-900/70 dark:text-neutral-100",
            controlsClassName
          )}
        >
          <button
                  type="button"
                  aria-label="Show previous slide"
                  disabled={isPreviousDisabled}
                  className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
                  onClick={() => {
                    setAutoplayStopped(true);
                    selectSlide(currentIndex - 1);
                  }}
                >
                  <ChevronLeft className="size-5" />
                </button>

                {showDots && (
                  <div className="flex items-center justify-center gap-2">
                    {items.map((item, index) => (
                      <button
                        key={`${item.title}-${index}`}
                        type="button"
                        aria-label={`Show slide ${index + 1}: ${item.title}`}
                        aria-current={currentIndex === index ? "true" : undefined}
                        className={cn(
                          "h-2 rounded-full bg-current transition-[width,opacity] duration-300",
                          currentIndex === index ? "w-7 opacity-100" : "w-2 opacity-30"
                        )}
                        onClick={() => {
                          setAutoplayStopped(true);
                          selectSlide(index);
                        }}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  aria-label="Show next slide"
                  disabled={isNextDisabled}
                  className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-35 dark:hover:bg-white/10"
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
