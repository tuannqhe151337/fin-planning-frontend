import { Variants, motion } from "framer-motion";
import { NumericFormat } from "react-number-format";
import { Pagination } from "../../../shared/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ExpenseTag } from "../../../entities/expense-tag";
import { Expense } from "../../upload-file-stage/type";
import clsx from "clsx";
import { TETooltip } from "tw-elements-react";
import { useWindowHeight } from "../../../shared/utils/use-window-height";
import { truncateString } from "../../../shared/utils/truncate-string";
import { useTranslation } from "react-i18next";

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
  tableOffsetHeight?: number;
  showExpenseIdColumn?: boolean;
  showExpenseCodeColumn?: boolean;
  showStatusColumn?: boolean;
  pageSize?: number;
}

export const ConfirmExpensesTable: React.FC<Props> = ({
  expenses,
  hide,
  tableOffsetHeight = 380,
  showExpenseIdColumn = false,
  showExpenseCodeColumn = false,
  showStatusColumn = false,
}) => {
  // i18n
  const { t } = useTranslation(["plan-management"]);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const renderTruncateValue = useCallback((value?: string | number) => {
    if (value) {
      if (value.toString().length > 8) {
        return (
          <TETooltip className="cursor-default" title={value}>
            {value.toString().substring(0, 8)}...
          </TETooltip>
        );
      } else {
        return <>{value}</>;
      }
    }
  }, []);

  // UI: small text for large table
  const isSmallText = useMemo(() => {
    return showExpenseIdColumn || showExpenseCodeColumn || showStatusColumn;
  }, [showExpenseIdColumn, showExpenseCodeColumn, showStatusColumn]);

  // Calculate optimal height for table
  const windowHeight = useWindowHeight();

  const tableHeight = useMemo(() => {
    return windowHeight * 0.95 - tableOffsetHeight;
  }, [windowHeight, tableOffsetHeight]);

  useEffect(() => {
    const headerHeight = isSmallText ? 28 : 32;
    const rowHeight = isSmallText ? 72 : 56;
    setPageSize(Math.floor((tableHeight - headerHeight) / rowHeight));
  }, [windowHeight, tableHeight, tableOffsetHeight]);

  return (
    <div>
      <div style={{ height: tableHeight }}>
        <table className="table-auto sm:mt-3 lg:mt-5 mx-auto">
          <thead className="xl:text-base lg:text-sm md:text-sm sm:text-sm text-neutral-400/70 dark:text-neutral-500">
            <tr>
              {showExpenseIdColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": isSmallText,
                  })}
                >
                  {t("ID")}
                </th>
              )}
              {showExpenseCodeColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": isSmallText,
                  })}
                >
                  {t("Code")}
                </th>
              )}
              <th
                className={clsx({
                  "px-4 lg:py-1 font-semibold dark:font-bold text-left": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Expenses")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Cost type")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Unit price")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Amount")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Total")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Currency")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Project name")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Supplier name")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("PiC")}
              </th>
              <th
                className={clsx({
                  "px-1 lg:py-1 font-semibold dark:font-bold": true,
                  "text-sm": isSmallText,
                })}
              >
                {t("Notes")}
              </th>
              {showStatusColumn && (
                <th
                  className={clsx({
                    "px-1 lg:py-1 font-semibold dark:font-bold": true,
                    "text-sm": isSmallText,
                  })}
                >
                  {t("Status")}
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
                    {showExpenseIdColumn && (
                      <td className="px-4 py-4 w-min font-extrabold text-left">
                        <div
                          className={clsx({
                            "text-sm": isSmallText,
                          })}
                        >
                          {expense.id}
                        </div>
                      </td>
                    )}
                    {showExpenseCodeColumn && (
                      <td className="px-4 py-4 w-min font-extrabold text-left">
                        <div
                          className={clsx({
                            "w-min": true,
                            "text-sm": isSmallText,
                          })}
                        >
                          {renderTruncateValue(expense.code)}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4 w-min font-extrabold text-left">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {renderTruncateValue(expense.name)}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.costType.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min w-min font-bold text-right">
                      <div
                        className={clsx({
                          "w-min": true,
                          "text-sm": isSmallText,
                        })}
                      >
                        <NumericFormat
                          displayType="text"
                          value={expense.unitPrice}
                          disabled
                          thousandSeparator
                          decimalScale={2}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.amount}
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-right">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        <NumericFormat
                          displayType="text"
                          value={expense.unitPrice * expense.amount}
                          thousandSeparator
                          decimalScale={2}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4 xl:w-min font-bold text-right">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        <div
                          className={clsx({
                            "text-sm": isSmallText,
                          })}
                        >
                          {expense.currency.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.project.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 w-min font-bold text-center">
                      <div
                        className={clsx({
                          "text-sm": isSmallText,
                        })}
                      >
                        {truncateString(expense.supplier.name, 8)}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold text-center">
                      <div
                        className={clsx({
                          "w-min": true,
                          "text-sm": isSmallText,
                        })}
                      >
                        {expense.pic.username}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:w-min sm:w-[100px] font-bold text-center text-neutral-400 dark:text-neutral-500">
                      <div
                        className={clsx({
                          "w-min": true,
                          "text-sm": isSmallText,
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
