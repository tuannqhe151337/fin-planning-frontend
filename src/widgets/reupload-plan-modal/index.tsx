import { useEffect, useState } from "react";
import { Variants, motion } from "framer-motion";
import { IconButton } from "../../shared/icon-button";
import { Modal } from "../../shared/modal";
import { IoClose } from "react-icons/io5";
import { StepProgress } from "./component/step-progress";
import clsx from "clsx";
import { UploadFileStage } from "../../features/upload-file-stage";
import { ConfirmExpensesStage } from "../../features/confirm-expenses-stage";
import { Expense } from "../../features/upload-file-stage/type";
import { useReuploadPlanMutation } from "../../providers/store/api/plansApi";
import { toast } from "react-toastify";
import { LocalStorageItemKey } from "../../providers/store/api/type";
import { downloadTemplateFileFromServer } from "../../shared/utils/download-file-from-server";

enum AnimationStage {
  LEFT = "left",
  VISIBLE = "visible",
  RIGHT = "right",
}

const stageAnimation: Variants = {
  left: {
    opacity: 0,
    x: -200,
    transition: {
      bounce: 0,
      duration: 0.5,
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      bounce: 0,
    },
  },
  right: {
    opacity: 0,
    x: 200,
    transition: {
      bounce: 0,
      duration: 0.5,
    },
  },
};

interface Props {
  planId?: string | number;
  planName?: string;
  termName?: string;
  show: boolean;
  onClose: () => any;
}

export const ReuploadPlanModal: React.FC<Props> = ({
  planId,
  planName,
  termName,
  show,
  onClose,
}) => {
  // Stages
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    if (show) {
      const timeoutId = setTimeout(() => {
        setStage(1);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setStage(0);
    }
  }, [show]);

  // Mutation
  const [reuploadPlan, { isLoading, isError, isSuccess }] =
    useReuploadPlanMutation();

  // Expenses read from file
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Close modal after upload successfully
  useEffect(() => {
    if (isSuccess) {
      toast("Create plan successfully!", { type: "success" });
      onClose && onClose();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast("Something went wrong, please try again!");
    }
  }, [isError]);

  return (
    <Modal
      className={`w-[95vw] xl:w-[90vw] h-[95vh]`}
      show={show}
      onClose={onClose}
    >
      <>
        {/* Header */}
        <div className="relative pt-5">
          <p className="w-fit m-auto text-xl font-bold text-primary-500 dark:text-primary-600">
            Choose term
          </p>
          <div className="absolute top-3 right-5">
            <IconButton
              className="hover:bg-neutral-100"
              onClick={() => {
                onClose && onClose();
              }}
            >
              <IoClose className="text-3xl text-neutral-500" />
            </IconButton>
          </div>
        </div>

        {/* Body */}
        <div className="pt-6">
          <div className="flex flex-col flex-wrap items-center justify-center w-full">
            <StepProgress stage={stage} />

            <div className="relative w-full">
              <div className="absolute flex flex-row flex-wrap justify-center w-full top-0 left-0">
                <motion.div
                  className={clsx({
                    block: stage === 1,
                    hidden: stage !== 1,
                  })}
                  initial={AnimationStage.RIGHT}
                  animate={(() => {
                    if (stage < 1) return AnimationStage.RIGHT;
                    if (stage === 1) return AnimationStage.VISIBLE;
                    if (stage > 1) return AnimationStage.LEFT;
                  })()}
                  variants={stageAnimation}
                >
                  <UploadFileStage
                    hide={stage !== 1}
                    termName={termName}
                    planName={planName}
                    isPlanNameEditable={false}
                    onDownloadTemplateClick={() => {
                      const token = localStorage.getItem(
                        LocalStorageItemKey.TOKEN
                      );

                      if (token && planId) {
                        downloadTemplateFileFromServer(
                          `${
                            import.meta.env.VITE_BACKEND_HOST
                          }plan/download/last-version-xlsx?planId=${planId}`,
                          token
                        );
                      }
                    }}
                    hideBackButton={true}
                    onNextStage={(expenses) => {
                      setExpenses(expenses);
                      setStage(2);
                    }}
                  />
                </motion.div>
              </div>

              <div className="absolute flex flex-row flex-wrap justify-center w-full top-0 left-0 h-full">
                <motion.div
                  className={clsx({
                    block: stage === 2,
                    hidden: stage !== 2,
                  })}
                  initial={AnimationStage.RIGHT}
                  animate={(() => {
                    if (stage < 2) return AnimationStage.RIGHT;
                    if (stage === 2) return AnimationStage.VISIBLE;
                    if (stage > 2) return AnimationStage.LEFT;
                  })()}
                  variants={stageAnimation}
                >
                  <ConfirmExpensesStage
                    submitButtonText="Reupload plan"
                    isLoading={isLoading}
                    expenses={expenses}
                    termName={termName}
                    planName={planName}
                    hide={stage !== 2}
                    onPreviousState={() => {
                      setStage(1);
                    }}
                    onNextStage={() => {
                      if (termName && planName) {
                        planId &&
                          reuploadPlan({
                            planId,
                            data: expenses.map(
                              ({
                                code,
                                name,
                                costType,
                                unitPrice,
                                amount,
                                projectName,
                                supplierName,
                                pic,
                                notes,
                              }) => ({
                                expenseCode: code,
                                expenseName: name,
                                costTypeId: costType.costTypeId,
                                unitPrice,
                                amount,
                                projectName,
                                supplierName,
                                pic,
                                notes,
                              })
                            ),
                          });
                      }
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Modal>
  );
};
