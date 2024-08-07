import { useEffect, useState } from "react";
import { Variants, motion } from "framer-motion";
import { TableReportExpenses } from "../../widgets/table-report-expense";
import { ListReportExpenseFilter } from "../../widgets/list-report-expense-filter";
import {
  ListReportExpenseParameters,
  reportsAPI,
  useApproveExpensesMutation,
  useDenyExpensesMutation,
  useGetReportDetailQuery,
  useLazyFetchReportExpensesQuery,
} from "../../providers/store/api/reportsAPI";
import { useParams } from "react-router-dom";
import { Expense, LocalStorageItemKey } from "../../providers/store/api/type";
import { useIsAuthorizedAndTimeToReviewReport } from "../../features/use-is-authorized-time-to-review-report";
import { produce } from "immer";
import { useAppDispatch } from "../../providers/store/hook";
import { toast } from "react-toastify";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
      duration: 0.15,
    },
  },
};

interface Row extends Expense {
  isFetching?: boolean;
}

const generateEmptyReportExpenses = (total: number): Row[] => {
  const reportExpenses: Row[] = [];

  for (let i = 0; i < total; i++) {
    reportExpenses.push({
      expenseId: i,
      name: "",
      costType: {
        costTypeId: 0,
        name: "",
      },
      unitPrice: 0,
      amount: 0,
      projectName: "",
      supplierName: "",
      pic: "",
      notes: "",
      status: {
        statusId: 0,
        code: "WAITING_FOR_APPROVAL",
        name: "",
      },
      isFetching: true,
    });
  }

  return reportExpenses;
};

const pageSize = 10;

export const ReportDetailExpensePage: React.FC = () => {
  // Params
  const { reportId } = useParams<{ reportId: string }>();

  // Dispatch
  const dispatch = useAppDispatch();

  // Query
  const [fetchReportExpenses, { data, isFetching }] =
    useLazyFetchReportExpensesQuery();

  const { data: report } = useGetReportDetailQuery({
    reportId: reportId ? parseInt(reportId) : 0,
  });

  // UI: select expenses
  const [listSelectedId, setListSelectedId] = useState<Set<number>>(new Set());

  // Searchbox state
  const [searchboxValue, setSearchboxValue] = useState<string>("");
  const [costTypeId, setCostTypeId] = useState<number | null>();
  const [statusId, setStatusId] = useState<number | null>();
  const [page, setPage] = useState<number>(1);

  const [_showReviewExpense, setShowReviewExpense] = useState<boolean>(false);

  useEffect(() => {
    if (listSelectedId.size !== 0) {
      setShowReviewExpense(true);
    } else {
      setShowReviewExpense(false);
    }
  }, [listSelectedId]);

  // Is data empty (derived from data)
  const [isDataEmpty, setIsDataEmpty] = useState<boolean>();

  useEffect(() => {
    setIsDataEmpty(!isFetching && data && data.data && data.data.length === 0);
  }, [data]);

  // Fetch report expense on change
  useEffect(() => {
    setListSelectedId(new Set());

    if (reportId) {
      const timeoutId = setTimeout(() => {
        const paramters: ListReportExpenseParameters = {
          reportId: parseInt(reportId, 10),
          query: searchboxValue,
          page,
          pageSize: 10,
        };

        if (costTypeId) {
          paramters.costTypeId = costTypeId;
        }

        if (statusId) {
          paramters.statusId = statusId;
        }

        fetchReportExpenses(paramters, true);
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [searchboxValue, page, costTypeId, statusId]);

  // Show checkboxes for review
  const isAuthorizedAndTimeToReviewReport =
    useIsAuthorizedAndTimeToReviewReport({
      reportStatusCode: report?.status.code,
      termEndDate: report?.term.endDate,
      termReuploadStartDate: report?.term.reuploadStartDate,
      termReuploadEndDate: report?.term.reuploadEndDate,
      finalEndTermDate: report?.term.finalEndTermDate,
    });

  // Approve and deny mutation
  const [approveExpenses, { isSuccess: approveExpensesSuccess }] =
    useApproveExpensesMutation();
  const [denyExpenses, { isSuccess: denyExpensesSuccess }] =
    useDenyExpensesMutation();

  // Approve and deny expense success
  useEffect(() => {
    if (approveExpensesSuccess) {
      toast("Approve expenses successfully!", { type: "success" });
    }
  }, [approveExpensesSuccess]);

  useEffect(() => {
    if (denyExpensesSuccess) {
      toast("Deny expenses successfully!", { type: "success" });
    }
  }, [denyExpensesSuccess]);

  // Approve and deny expense with cache handling
  const approveExpenseAndUpdateCache = (listExpenseId: number[]) => {
    if (reportId) {
      let reportIdInt: number;
      try {
        // Parse planId to int
        if (typeof reportId === "string") {
          reportIdInt = parseInt(reportId);
        } else {
          reportIdInt = reportId;
        }

        // Call API approve expenses
        approveExpenses({
          reportId: reportIdInt,
          listExpenseId,
        });

        // Manually update cache
        dispatch(
          reportsAPI.util.updateQueryData(
            "fetchReportExpenses",
            {
              reportId: reportIdInt,
              costTypeId,
              query: searchboxValue,
              page,
              pageSize,
            },
            (draft) => {
              draft.data.forEach((expense, index) => {
                const expenseExists =
                  listExpenseId.findIndex(
                    (expenseId) => expense.expenseId === expenseId
                  ) !== -1;

                if (expenseExists) {
                  (draft.data[index].status.code = "APPROVED"),
                    (draft.data[index].status.name = "Approved");
                }
              });
            }
          )
        );
      } catch {}
    }
  };

  const denyExpensesAndUpdateCache = (listExpenseId: number[]) => {
    if (reportId) {
      // Parse reportId to int
      let reportIdInt: number;
      try {
        if (typeof reportId === "string") {
          reportIdInt = parseInt(reportId);
        } else {
          reportIdInt = reportId;
        }
        // Call API deny expenses
        denyExpenses({
          reportId: reportIdInt,
          listExpenseId,
        });

        // Manually update cache
        dispatch(
          reportsAPI.util.updateQueryData(
            "fetchReportExpenses",
            {
              reportId: reportIdInt,
              costTypeId,
              query: searchboxValue,
              page,
              pageSize,
            },
            (draft) => {
              draft.data.forEach((expense, index) => {
                const expenseExists =
                  listExpenseId.findIndex(
                    (expenseId) => expense.expenseId === expenseId
                  ) !== -1;

                if (expenseExists) {
                  (draft.data[index].status.code = "DENIED"),
                    (draft.data[index].status.name = "Denied");
                }
              });
            }
          )
        );
      } catch {}
    }
  };

  return (
    <motion.div
      initial={AnimationStage.HIDDEN}
      animate={AnimationStage.VISIBLE}
      variants={staggerChildrenAnimation}
    >
      <ListReportExpenseFilter
        className="pl-3 mt-7"
        showReviewExpense={listSelectedId.size > 0}
        searchboxValue={searchboxValue}
        onSearchboxChange={(value) => {
          setSearchboxValue(value);
        }}
        onCostTypeIdChange={(costTypeId) => {
          setCostTypeId(costTypeId);
        }}
        onStatusIdChange={(statusId) => {
          setStatusId(statusId);
        }}
        onApproveExpensesClick={() => {
          approveExpenseAndUpdateCache(Array.from(listSelectedId));
        }}
        onDenyExpensesClick={() => {
          denyExpensesAndUpdateCache(Array.from(listSelectedId));
        }}
        onDownloadClick={() => {
          const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

          if (token && report && reportId) {
            downloadFileFromServer(
              `${
                import.meta.env.VITE_BACKEND_HOST
              }report/download-xlsx?reportId=${reportId}`,
              token,
              `${report.name}.xlsx`
            );
          }
        }}
      />

      <TableReportExpenses
        isRowsSelectable={isAuthorizedAndTimeToReviewReport}
        expenses={isFetching ? generateEmptyReportExpenses(10) : data?.data}
        isDataEmpty={isDataEmpty}
        listSelectedId={listSelectedId}
        onRowClick={(expenseId) => {
          setListSelectedId(
            produce((draft) => {
              if (draft.has(expenseId)) {
                draft.delete(expenseId);
              } else {
                draft.add(expenseId);
              }
            })
          );
        }}
        onSelectAllClick={() => {
          setListSelectedId(
            produce((state) => {
              if (state.size === data?.data.length) {
                state = new Set();
              } else {
                data?.data.forEach(({ expenseId }) => {
                  state.add(expenseId);
                });
              }

              return state;
            })
          );
        }}
        onEscPress={() => {
          setListSelectedId(new Set());
        }}
        onApproveExpensesClick={(expenseIds) => {
          approveExpenseAndUpdateCache(expenseIds);
        }}
        onDenyExpensesClick={(expenseIds) => {
          denyExpensesAndUpdateCache(expenseIds);
        }}
        page={page}
        totalPage={data?.pagination.numPages}
        onNext={() =>
          setPage((prevPage) => {
            if (data?.pagination.numPages) {
              if (prevPage + 1 > data?.pagination.numPages) {
                return data?.pagination.numPages;
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
            if (data?.pagination.numPages) {
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
        isFetching={isFetching}
      />
    </motion.div>
  );
};
