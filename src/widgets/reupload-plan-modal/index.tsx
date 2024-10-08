import { useEffect, useState } from "react";
import { Variants, motion } from "framer-motion";
import { IconButton } from "../../shared/icon-button";
import { Modal } from "../../shared/modal";
import { IoClose } from "react-icons/io5";
import { StepProgress } from "./component/step-progress";
import clsx from "clsx";
import { ConfirmExpensesStage } from "../../features/confirm-expenses-stage";
import { Expense } from "../../features/upload-file-stage/type";
import { useReuploadPlanMutation } from "../../providers/store/api/plansApi";
import { toast } from "react-toastify";
import { LocalStorageItemKey } from "../../providers/store/api/type";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { UploadFileStage } from "./component/upload-file-stage";
import { TEInput } from "tw-elements-react";
import { DisabledSelect } from "../../shared/disabled-select";
import { useMeQuery } from "../../providers/store/api/authApi";
import { useTranslation } from "react-i18next";

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
  // i18n
  const { t } = useTranslation(["plan-management"]);

  // Department from user's detail
  const { data: me } = useMeQuery();

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
      toast("Reupload plan successfully!", { type: "success" });
      onClose && onClose();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast("Something went wrong, please try again!", { type: "error" });
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
            {t("Choose term")}
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
                    validateExpenseId
                    onDownloadTemplateClick={() => {
                      const token = localStorage.getItem(
                        LocalStorageItemKey.TOKEN
                      );

                      if (token && planId) {
                        downloadFileFromServer(
                          `${
                            import.meta.env.VITE_BACKEND_HOST
                          }plan/download/last-version-xlsx?planId=${planId}`,
                          token,
                          `${planName}.xlsx`
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
                    inputSection={
                      <div className="flex flex-row flex-wrap items-center justify-center gap-3 mt-3">
                        <div className="flex-1 pt-5">
                          <TEInput
                            disabled
                            className="w-full"
                            label={t("Plan name")}
                            value={planName || ""}
                          />
                        </div>
                        <DisabledSelect
                          className="w-[300px]"
                          label={t("Term")}
                          value={termName || ""}
                          maxLengthBeforeTrim={32}
                        />
                        <DisabledSelect
                          className="w-[200px]"
                          label={t("Department")}
                          value={me?.department.name || ""}
                          maxLengthBeforeTrim={16}
                        />
                      </div>
                    }
                    submitButtonText={t("Reupload plan")}
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
                                id,
                                name,
                                costType,
                                unitPrice,
                                amount,
                                project,
                                supplier,
                                currency,
                                pic,
                                notes,
                              }) => ({
                                expenseId: id,
                                // expenseCode: code,
                                expenseName: name,
                                costTypeId: costType.costTypeId,
                                unitPrice,
                                amount,
                                projectId: project.projectId,
                                supplierId: supplier.supplierId,
                                picId: pic.userId,
                                notes,
                                currencyId: currency.currencyId,
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
