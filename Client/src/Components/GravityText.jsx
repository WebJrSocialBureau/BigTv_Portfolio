import React, { useEffect, useRef, useState, useCallback } from "react";
import { Play, MoveRight } from "lucide-react";

// Auto-looping GravityText â€” blocks fall, text reveals, then resets and repeats.
// revealPauseSec : seconds to show the revealed text before resetting  (default 4s)
// resetPauseSec  : seconds to show the covered blocks before falling again (default 1.5s)
export default function GravityText({
  text,
  blockColor,
  textColor,
  labelColor = "text-red-500/50",
  config = {
    gravity: 3.5,
    wind: 0,
    friction: 0.1,
    restitution: 0.3,
    triggerAllOnScroll: true,
  },
  className = "",
  interactive = true,
  revealPauseSec = 4,
  resetPauseSec = 1.5,
}) {
  const containerRef = useRef(null);
  const [blocks, setBlocks] = useState([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasScrollTriggered, setHasScrollTriggered] = useState(false);

  const blocksRef = useRef([]);
  const animationFrameId = useRef(null);
  const isLoopRunning = useRef(false);
  const autoLoopTimer = useRef(null);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const words = [
    "TRUTH", "VISION", "NEWS", "ETHICS", "MEDIA",
    "INTEGRITY", "CRIMSON", "DIGITAL", "GLOBAL", "REPORT",
    "GRAVITY", "BEACON", "MALAYALAM", "NETWORK", "FUTURE",
  ];

  const generateBlocks = useCallback(
    (width, height) => {
      if (width === 0 || height === 0) return [];
      const rowsCount = 4;
      const rowHeight = height / rowsCount;
      const generated = [];

      for (let r = 0; r < rowsCount; r++) {
        const y = r * rowHeight;
        const blocksInRow = r % 2 === 0 ? 2 : 3;
        let xOffset = 0;
        const ratios = [];

        if (blocksInRow === 2) {
          const split = 0.35 + Math.random() * 0.3;
          ratios.push(split, 1 - split);
        } else {
          const split1 = 0.2 + Math.random() * 0.2;
          const split2 = 0.25 + Math.random() * 0.25;
          ratios.push(split1, split2, 1 - split1 - split2);
        }

        for (let c = 0; c < blocksInRow; c++) {
          const blockWidth = width * ratios[c];
          const blockId = `block-${r}-${c}-${Math.random().toString(36).substring(2, 6)}`;
          const padding = 15;
          const left = xOffset - (c > 0 ? padding : 0);
          const actualWidth =
            blockWidth +
            (c > 0 ? padding : 0) +
            (c < blocksInRow - 1 ? padding : 0);
          const label = words[Math.floor(Math.random() * words.length)];

          generated.push({
            id: blockId,
            x: left,
            y,
            vx: 0,
            vy: 0,
            angle: 0,
            angularVelocity: 0,
            width: actualWidth,
            height: rowHeight + 2,
            initialX: left,
            initialY: y,
            isFalling: false,
            color: blockColor,
            mass: actualWidth * rowHeight * 0.01,
            restitution: config.restitution,
            friction: config.friction,
            label: Math.random() > 0.4 ? label : undefined,
          });

          xOffset += blockWidth;
        }
      }
      return generated;
    },
    [blockColor, config.restitution, config.friction]
  );

  // Measure container & initialise blocks
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const w = rect.width || 300;
      const h = rect.height || 120;
      dimensionsRef.current = { width: w, height: h };
      setDimensions({ width: w, height: h });
      const initialBlocks = generateBlocks(w, h);
      setBlocks(initialBlocks);
      blocksRef.current = initialBlocks;
      setIsRevealed(false);
      setHasInitialized(true);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) updateDimensions();
      }
    });

    resizeObserver.observe(containerRef.current);
    updateDimensions();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (autoLoopTimer.current) clearTimeout(autoLoopTimer.current);
    };
  }, [text, blockColor]);

  useEffect(() => {
    blocksRef.current = blocksRef.current.map((b) => ({
      ...b,
      restitution: config.restitution,
      friction: config.friction,
    }));
  }, [config.restitution, config.friction]);

  // Forward-declare so scheduleAutoReset and triggerReveal can reference each other
  const scheduleAutoResetRef = useRef(null);
  const triggerRevealRef = useRef(null);

  const runPhysicsLoop = useCallback(() => {
    if (!isLoopRunning.current) return;
    let hasActiveAnimations = false;
    const { height } = dimensionsRef.current;
    const currentBlocks = [...blocksRef.current];

    currentBlocks.forEach((block) => {
      const element = document.getElementById(block.id);
      if (!element) return;
      if (block.isFalling) {
        block.vy += config.gravity * 0.12;
        block.vx += (config.wind || 0) * 0.05;
        block.vx *= 1 - block.friction * 0.1;
        block.vy *= 1 - block.friction * 0.1;
        block.x += block.vx;
        block.y += block.vy;
        block.angle += block.angularVelocity;
        const floorY = height + 400;
        if (block.y < floorY) hasActiveAnimations = true;
        element.style.transform = `translate3d(${block.x - block.initialX}px, ${block.y - block.initialY}px, 0) rotate(${block.angle}deg)`;
        element.style.opacity = `${Math.max(0, 1 - (block.y - height) / 300)}`;
      } else {
        element.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        element.style.opacity = "1";
      }
    });

    if (hasActiveAnimations) {
      animationFrameId.current = requestAnimationFrame(runPhysicsLoop);
    } else {
      isLoopRunning.current = false;
      // All blocks off-screen â€” schedule auto-reset
      if (scheduleAutoResetRef.current) scheduleAutoResetRef.current();
    }
  }, [config.gravity, config.wind]);

  const startAnimation = useCallback(() => {
    if (!isLoopRunning.current) {
      isLoopRunning.current = true;
      runPhysicsLoop();
    }
  }, [runPhysicsLoop]);

  const resetEffect = useCallback(() => {
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    isLoopRunning.current = false;
    const { width, height } = dimensionsRef.current;
    // Fresh random splits on every loop for variety
    const fresh = generateBlocks(width, height);
    blocksRef.current = fresh;
    setBlocks(fresh);
    setIsRevealed(false);
    fresh.forEach((block) => {
      const element = document.getElementById(block.id);
      if (element) {
        element.style.transform = "translate3d(0, 0, 0) rotate(0deg)";
        element.style.opacity = "1";
      }
    });
  }, [generateBlocks]);

  const triggerReveal = useCallback(() => {
    if (autoLoopTimer.current) clearTimeout(autoLoopTimer.current);
    setIsRevealed(true);
    blocksRef.current = blocksRef.current.map((block) => {
      if (!block.isFalling) {
        const randomDir = Math.random() > 0.5 ? 1 : -1;
        return {
          ...block,
          isFalling: true,
          vx: (Math.random() - 0.5) * 4 + (config.wind || 0) * 2,
          vy: -2 - Math.random() * 3,
          angularVelocity: randomDir * (3 + Math.random() * 6),
        };
      }
      return block;
    });
    setBlocks([...blocksRef.current]);
    startAnimation();
  }, [config.wind, startAnimation]);

  // Wire up refs so the physics loop callback can call them
  triggerRevealRef.current = triggerReveal;

  const scheduleAutoReset = useCallback(() => {
    if (autoLoopTimer.current) clearTimeout(autoLoopTimer.current);
    // Phase 1: hold revealed text
    autoLoopTimer.current = setTimeout(() => {
      resetEffect();
      // Phase 2: briefly show covered blocks, then fall again
      autoLoopTimer.current = setTimeout(() => {
        if (triggerRevealRef.current) triggerRevealRef.current();
      }, resetPauseSec * 1000);
    }, revealPauseSec * 1000);
  }, [resetEffect, revealPauseSec, resetPauseSec]);

  scheduleAutoResetRef.current = scheduleAutoReset;

  const triggerSingleBlock = useCallback(
    (id) => {
      if (!interactive) return;
      blocksRef.current = blocksRef.current.map((block) => {
        if (block.id === id && !block.isFalling) {
          const randomDir = Math.random() > 0.5 ? 1 : -1;
          return {
            ...block,
            isFalling: true,
            vx: (Math.random() - 0.5) * 6 + (config.wind || 0) * 2,
            vy: -1 - Math.random() * 3,
            angularVelocity: randomDir * (5 + Math.random() * 10),
          };
        }
        return block;
      });
      const allFalling = blocksRef.current.every((b) => b.isFalling);
      if (allFalling) setIsRevealed(true);
      setBlocks([...blocksRef.current]);
      startAnimation();
    },
    [interactive, config.wind, startAnimation]
  );

  // Scroll-intersection observer â€” kick off the loop on first view
  useEffect(() => {
    if (!containerRef.current || !config.triggerAllOnScroll) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasScrollTriggered) {
            setHasScrollTriggered(true);
            const timer = setTimeout(() => triggerReveal(), 600);
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasInitialized, config.triggerAllOnScroll, hasScrollTriggered, triggerReveal]);

  return (
    <div
      className={`relative flex flex-col items-center ${className}`}
      id="gravity-reveal-container"
    >
      <div
        ref={containerRef}
        className="relative w-full overflow-visible select-none min-h-[120px] md:min-h-[180px] flex items-center justify-center p-4 md:p-8"
        id="gravity-stage"
      >
        {/* Revealed text underlay */}
        <div
          className={`w-full font-display font-extrabold uppercase leading-[1.1] tracking-tight text-center ${textColor} text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl max-w-5xl py-2 px-1 transition-all duration-700 ${
            isRevealed
              ? "scale-100 opacity-100 filter-none"
              : "scale-[0.98] opacity-90 blur-[0.5px]"
          }`}
          id="revealed-text-target"
        >
          {text}
        </div>

        {/* Falling slabs overlay */}
        <div
          className="absolute inset-0 pointer-events-none overflow-visible"
          id="gravity-slabs-overlay"
        >
          {blocks.map((block) => (
            <div
              key={block.id}
              id={block.id}
              onClick={() => triggerSingleBlock(block.id)}
              style={{
                left: `${block.initialX}px`,
                top: `${block.initialY}px`,
                width: `${block.width}px`,
                height: `${block.height}px`,
              }}
              className={`absolute pointer-events-auto rounded-[4px] cursor-pointer shadow-md transition-shadow hover:shadow-lg hover:brightness-105 active:scale-95 flex items-center justify-center border border-black/5 select-none ${block.color} ${
                block.isFalling ? "z-50 pointer-events-none" : "z-10"
              }`}
              title={
                interactive && !block.isFalling ? "Click to drop this piece!" : undefined
              }
            >
              <div className="absolute inset-1 border border-white/5 rounded-[2px]" />

              {block.label && !block.isFalling && (
                <span
                  className={`font-mono text-[9px] md:text-[10px] tracking-widest font-bold select-none ${labelColor} uppercase opacity-60 transition-opacity duration-300 hover:opacity-100`}
                >
                  {block.label}
                </span>
              )}

              {!block.isFalling && interactive && (
                <div className="absolute right-2 bottom-1.5 flex gap-1 opacity-20">
                  <div className="w-[3px] h-[3px] rounded-full bg-current" />
                  <div className="w-[3px] h-[3px] rounded-full bg-current" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual trigger â€” only shown before the first scroll-trigger fires */}
      {interactive && !hasScrollTriggered && (
        <div className="flex gap-4 mt-6 z-40 relative" id="gravity-stage-controls">
          <button
            onClick={() => {
              setHasScrollTriggered(true);
              triggerReveal();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-mono text-xs font-semibold uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-all shadow-md active:scale-95 group cursor-pointer"
            id="btn-reveal-all"
          >
            <Play className="w-3.5 h-3.5 fill-current animate-pulse" />
            Tumble &amp; Reveal
            <MoveRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
