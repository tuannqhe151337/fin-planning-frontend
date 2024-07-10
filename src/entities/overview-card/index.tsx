import { useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Meteors } from "../../shared/meteors";
import { cn } from "../../shared/utils/cn";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

interface Props {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  meteors?: boolean;
}

// Copy from https://ui.aceternity.com/components/3d-card-effect
export const OverviewCard: React.FC<Props> = ({
  icon,
  label,
  value,
  className,
  meteors,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 20;
    const y = (e.clientY - top - height / 2) / 3;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsMouseEntered(true);
    if (!containerRef.current) return;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "w-full h-[100px] transition-all duration-200 ease-linear border dark:border-neutral-800 rounded-xl shadow dark:shadow-[0_0_15px_rgb(0,0,0,0.3)] overflow-hidden",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
      variants={animation}
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
    >
      <div className="flex-1 flex flex-row flex-wrap items-center w-full h-full px-8 py-6">
        <div className="mr-6 text-primary-300 dark:text-primary-800">
          {icon}
        </div>
        <div className="flex-1 flex flex-col flex-wrap gap-1">
          <p className="text-sm font-bold text-primary-400/80">{label}</p>
          <p className="text-base font-extrabold text-primary-500/80">
            {value}
          </p>
        </div>
      </div>

      {meteors && <Meteors number={5} />}
    </motion.div>
  );
};