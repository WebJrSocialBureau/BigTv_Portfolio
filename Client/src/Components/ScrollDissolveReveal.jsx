import React from "react";
import { motion } from "framer-motion";

export function ScrollDissolveReveal({
  childrenFront,
  childrenBack,
  className,
  containerClassName,
}) {
  return (
    <div className={`w-full flex flex-col gap-8 py-8 ${containerClassName || ""}`}>
      {/* Front Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full"
      >
        {childrenFront}
      </motion.div>

      {/* Decorative Divider Line */}
      <div className="w-full max-w-4xl mx-auto px-6">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#2563eb]/20 to-transparent" />
      </div>

      {/* Back Panel */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        className="w-full"
      >
        {childrenBack}
      </motion.div>
    </div>
  );
}

export default ScrollDissolveReveal;
