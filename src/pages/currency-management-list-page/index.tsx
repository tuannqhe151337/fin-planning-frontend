import { Variants, motion } from "framer-motion";
import { useScrollToTopOnLoad } from "../../shared/hooks/use-scroll-to-top-on-load";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { TableCurrency } from "../../widgets/table-currency";
import { CurrencyCreateModal } from "../../widgets/currency-create-modal";
import { useHotkeys } from "react-hotkeys-hook";

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
      duration: 0.15,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
      duration: 0.15,
    },
  },
};

export const CurrencyManagementListPage: React.FC = () => {
  // Navigate
  const navigate = useNavigate();

  // Scroll to top
  useScrollToTopOnLoad();

  // Currency create modal
  const [showCreateCurrencyModal, setShowCreateCurrencyModal] =
    useState<boolean>(false);

  useHotkeys("ctrl + =", (e) => {
    e.preventDefault();
    setShowCreateCurrencyModal(true);
  });

  return (
    <motion.div
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <TableCurrency
        onCreateCurrency={() => {
          setShowCreateCurrencyModal(true);
        }}
      />

      <CurrencyCreateModal
        show={showCreateCurrencyModal}
        onClose={() => {
          setShowCreateCurrencyModal(false);
        }}
      />
    </motion.div>
  );
};