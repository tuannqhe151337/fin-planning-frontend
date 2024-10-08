import { lazy } from "react";
import { Variants, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { MonthlyExpectedActualCostChart } from "../../widgets/monthly-expected-actual-cost-chart";
import { useMeQuery } from "../../providers/store/api/authApi";
import { Role } from "../../providers/store/api/type";
import { MonthlyUserChart } from "../../widgets/monthly-user-chart";
import { DepartmentUserChart } from "../../widgets/department-user-chart";
import { TopListOverviewCard } from "../../widgets/top-list-overview-card";
import { CostTypeConsumptionSection } from "../../widgets/cost-type-consumption-section";
import { DownloadDesktopSection } from "../../widgets/download-desktop-section";

const GlobeSection = lazy(() => import("../../widgets/globe-section"));

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const childrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 5,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

export const HomePage: React.FC = () => {
  // Scroll to top
  useScrollToTopOnLoad();

  // Me query
  const { data: me } = useMeQuery();

  // Use in view
  const { ref, inView } = useInView();

  return (
    <motion.div
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      exit={AnimationStage.HIDDEN}
      variants={staggerChildrenAnimation}
    >
      {/* Overview card */}
      <div className="px-10">
        <TopListOverviewCard />
      </div>

      {/* Chart for accountant and financial staff */}
      {me?.role.code === Role.ACCOUNTANT && (
        <motion.div className="mt-10 px-10" variants={childrenAnimation}>
          <MonthlyExpectedActualCostChart />
        </motion.div>
      )}

      {(me?.role.code === Role.ACCOUNTANT ||
        me?.role.code === Role.FINANCIAL_STAFF) && (
        <div className="mt-10 px-10">
          <CostTypeConsumptionSection />
        </div>
      )}

      {/* Chart for admin */}
      {me?.role.code === Role.ADMIN && (
        <div className="flex flex-row justify-stretch items-stretch justify-items-stretch gap-5 mt-10 px-10 w-full">
          <motion.div className="flex-[2]" variants={childrenAnimation}>
            <MonthlyUserChart />
          </motion.div>
          <motion.div className="flex-1" variants={childrenAnimation}>
            <DepartmentUserChart />
          </motion.div>
        </div>
      )}

      {/* Download desktop section */}
      <div className="mt-10">
        <DownloadDesktopSection />
      </div>

      <div ref={ref} className="mt-32 mb-20">
        <div className="h-[510px]">{inView && <GlobeSection />}</div>
      </div>
    </motion.div>
  );
};
