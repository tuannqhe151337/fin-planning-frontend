import { Variants, motion } from "framer-motion";
import { NumericFormat } from "react-number-format";
import { Pagination } from "../../../shared/pagination";
import { useCallback, useState } from "react";
import { ExpenseTag } from "../../../entities/expense-tag";
import { Expense } from "../../upload-file-stage/type";
import clsx from "clsx";
import { TETooltip } from "tw-elements-react";

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
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

const childrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
  },
};

const rowAnimation: Variants = {
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
  expenses?: Expense[];
  hide?: boolean;
  showExpenseCodeColumn?: boolean;
  showStatusColumn?: boolean;
  pageSize?: number;
}

export const ConfirmExpensesTable: React.FC<Props> = ({
  expenses,
  hide,
  showExpenseCodeColumn = false,
  showStatusColumn = false,
  pageSize = 5,
}) => {
  const [page, setPage] = useState<number>(1);

  const renderExpenseCodeValue = useCallback(
    (expenseCode?: string | number) => {
      if (expenseCode) {
        if (expenseCode.toString().length > 8) {
          return (
            <TETooltip className="cursor-default" title={expenseCode}>
              {expenseCode.toString().substring(0, 8)}...
            </TETooltip>
          );
        } else {
          return <>{expenseCode}</>;
        }
      }
    },
    []
  );

  return (
    <div>
      <div className="min-h-[312px]">
        <table className="table-auto sm:mt-3 lg:mt-5 mx-auto">
          <thead className="xl:text-base lg:text-sm md:text-sm sm:text-sm text-neutral-400/70 dark:text-neutral-500">
            <tr>
              {showExpenseCodeColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": showExpenseCodeColumn || showStatusColumn,
                  })}
                >
                  Code
                </th>
              )}
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Expenses
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Cost type
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Unit price (VND)
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Amount
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Total (VND)
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Project name
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Supplier name
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                PiC
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": showExpenseCodeColumn || showStatusColumn,
                })}
              >
                Notes
              </th>
              {showStatusColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": showExpenseCodeColumn || showStatusColumn,
                  })}
                >
                  Status
                </th>
              )}
            </tr>
          </thead>
          <motion.tbody
            key={page}
            className="[&>*:nth-child(even)]:bg-primary-50/70 [&>*:nth-child(even)]:dark:bg-neutral-700/50 xl:text-base lg:text-sm md:text-sm sm:text-sm text-neutral-500/80 dark:text-neutral-400/80"
            initial={AnimationStage.HIDDEN}
            animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
            variants={staggerChildrenAnimation}
          >
            {expenses &&
              expenses
                .slice((page - 1) * pageSize, page * pageSize)
                .map((expense, index) => (
                  <motion.tr key={index} variants={rowAnimation}>
                    {showExpenseCodeColumn && (
                      <td className="px-4 py-4 lg:w-min sm:w-[100px] font-extrabold text-left">
                        <div
                          className={clsx({
                            "text-sm":
                              showExpenseCodeColumn || showStatusColumn,
                          })}
                        >
                          {renderExpenseCodeValue(expense.code)}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-extrabold text-left">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        {expense.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        {expense.costType.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-right">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        <NumericFormat
                          displayType="text"
                          value={expense.unitPrice}
                          disabled
                          thousandSeparator
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        {expense.amount}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-right">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        <NumericFormat
                          displayType="text"
                          value={expense.unitPrice * expense.amount}
                          thousandSeparator
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        {expense.projectName}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        {expense.supplierName}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        {expense.pic}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-bold text-center text-neutral-400 dark:text-neutral-500">
                      <div
                        className={clsx({
                          "text-sm": showExpenseCodeColumn || showStatusColumn,
                        })}
                      >
                        {expense.notes}
                      </div>
                    </td>
                    {showStatusColumn && (
                      <td>
                        <ExpenseTag
                          className="m-auto"
                          statusCode={expense.status?.code || ""}
                        />
                      </td>
                    )}
                  </motion.tr>
                ))}
          </motion.tbody>
        </table>
      </div>

      <motion.div
        initial={AnimationStage.HIDDEN}
        animate={hide ? AnimationStage.HIDDEN : AnimationStage.VISIBLE}
        variants={childrenAnimation}
        transition={{ delay: 0.4 }}
      >
        <Pagination
          className="mt-1"
          page={page}
          totalPage={Math.ceil(expenses ? expenses.length / pageSize : 1)}
          onNext={() =>
            setPage((prevPage) => {
              if (expenses) {
                if (prevPage + 1 > expenses.length) {
                  return expenses.length;
                } else {
                  return prevPage + 1;
                }
              } else {
                return 1;
              }
            })
          }
          onPageChange={(page) => {
            setPage(page || 1);
          }}
          onPrevious={() =>
            setPage((prevPage) => {
              if (expenses) {
                if (prevPage === 1) {
                  return 1;
                } else {
                  return prevPage - 1;
                }
              } else {
                return 1;
              }
            })
          }
        />
      </motion.div>
    </div>
  );
};
