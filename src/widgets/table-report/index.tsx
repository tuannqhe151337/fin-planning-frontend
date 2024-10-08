import { Pagination } from "../../shared/pagination";
import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { DeleteReportModal } from "../delete-report-modal";
import { Report } from "../../providers/store/api/reportsAPI";
import { Skeleton } from "../../shared/skeleton";
import { parseISOInResponse } from "../../shared/utils/parse-iso-in-response";
import { format } from "date-fns";
import { useHotkeys } from "react-hotkeys-hook";
import { ReportActionContextMenu } from "../../entities/report-action-context-menu";
import { LocalStorageItemKey } from "../../providers/store/api/type";
import { downloadFileFromServer } from "../../shared/utils/download-file-from-server";
import { useIsAuthorizedAndTimeToReviewReport } from "../../features/use-is-authorized-time-to-review-report";
import { TermPreviewer } from "../../entities/term-previewer";
import { ReportPreviewer } from "../../entities/report-previewer";
import { truncateString } from "../../shared/utils/truncate-string";
import { ReportStatusIcon } from "../../entities/report-status-icon";
import { useTranslation } from "react-i18next";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

const rowAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

export interface Row extends Report {
  isFetching?: boolean;
}

interface Props {
  isFetching?: boolean;
  reports?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onMarkAsReviewed?: (reportId?: number) => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TableReportManagement: React.FC<Props> = ({
  reports,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onMarkAsReviewed,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // i18n
  const { t } = useTranslation(["report-management"]);

  // Navigation
  const navigate = useNavigate();

  // UI: show delete button
  const [showDeleteModel, setShowDeleteModal] = useState<boolean>(false);

  const handleDeleteReportModal = () => {
    setShowDeleteModal(false);
  };

  // UI: context menu
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuTop, setContextMenuTop] = useState<number>(0);
  const [contextMenuLeft, setContextMenuLeft] = useState<number>(0);
  const [chosenReport, setChosenReport] = useState<Report>();

  useEffect(() => {
    const clickHandler = () => {
      setShowContextMenu(false);
    };

    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  }, []);

  useHotkeys("esc", () => {
    setShowContextMenu(false);
  });

  // UI: context menu: show review option
  const isAuthorizedAndTimeToReviewReport =
    useIsAuthorizedAndTimeToReviewReport({
      reportStatusCode: chosenReport?.status.code,
      termEndDate: chosenReport?.term.endDate,
      allowReupload: chosenReport?.term.allowReupload,
      termReuploadStartDate: chosenReport?.term.reuploadStartDate,
      termReuploadEndDate: chosenReport?.term.reuploadEndDate,
      finalEndTermDate: chosenReport?.term.finalEndTermDate,
    });

  return (
    <div>
      <table className="text-center text-sm font-light mt-6 min-w-full shadow rounded-lg">
        <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600">
          <tr>
            <th
              scope="col"
              className="pl-28 py-4 font-extrabold text-left text-primary-500/80 dark:text-primary-600/80 rounded-tl-lg"
            >
              {t("Report")}
            </th>
            <th
              scope="col"
              className="px-10 py-4 font-extrabold text-left text-primary-500/80 dark:text-primary-600/80"
            >
              {t("Term")}
            </th>
            <th
              scope="col"
              className="pl-10 pr-20 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80 rounded-tr-lg"
            >
              {t("Created at")}
            </th>
          </tr>
        </thead>
        <tbody>
          {reports &&
            reports.map((report, index) => (
              <motion.tr
                key={index}
                variants={rowAnimation}
                initial={AnimationStage.HIDDEN}
                animate={AnimationStage.VISIBLE}
                exit={AnimationStage.HIDDEN}
                className={clsx({
                  "group cursor-pointer border-b-2 border-neutral-100 dark:border-neutral-800 duration-200":
                    true,
                  "text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-400":
                    true,
                  "bg-white hover:bg-primary-50/50 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/70":
                    index % 2 === 0,
                  "bg-primary-50 hover:bg-primary-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-800":
                    index % 2 === 1,
                })}
                onClick={() => {
                  navigate(`detail/expenses/${report.reportId}`);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowContextMenu(true);
                  setContextMenuLeft(e.pageX);
                  setContextMenuTop(e.pageY);
                  setChosenReport(report);
                }}
              >
                <td
                  className={clsx({
                    "whitespace-nowrap w-[550px] px-6 py-5 font-extrabold":
                      true,
                    "rounded-bl-lg": index === reports.length - 1,
                  })}
                >
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <div className="flex flex-row flex-wrap items-center ml-14 pr-5 group-hover:underline">
                      <ReportStatusIcon statusCode={report.status.code} />
                      <ReportPreviewer
                        containerClassName="px-4 text-left"
                        reportId={report.reportId}
                      >
                        {truncateString(report.name, 38)}
                      </ReportPreviewer>
                    </div>
                  )}
                </td>
                <td
                  className="whitespace-nowrap px-6 py-5 w-max text-left font-bold"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <TermPreviewer termId={report.term.termId}>
                      <Link
                        to={`/term-management/detail/information/${report.term.termId}`}
                        className="hover:text-sky-600 dark:hover:text-sky-600 hover:underline duration-200"
                      >
                        {truncateString(report.term.name, 45)}
                      </Link>
                    </TermPreviewer>
                  )}
                </td>
                <td
                  className={clsx({
                    "whitespace-nowrap pl-10 pr-20 py-5 font-bold": true,
                    "rounded-br-lg": index === reports.length - 1,
                  })}
                >
                  {isFetching ? (
                    <Skeleton className="w-[200px]" />
                  ) : (
                    <>
                      {format(
                        parseISOInResponse(report.createdAt),
                        "dd MMMM yyyy"
                      )}
                    </>
                  )}
                </td>
              </motion.tr>
            ))}
        </tbody>
      </table>

      {isDataEmpty && (
        <div className="flex flex-row flex-wrap items-center justify-center w-full min-h-[250px] text-lg font-semibold text-neutral-400 italic">
          {t("No data found")}
        </div>
      )}
      {!isDataEmpty && (
        <motion.div
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={animation}
        >
          <Pagination
            className="mt-6"
            page={page}
            totalPage={totalPage || 1}
            onNext={onNext}
            onPageChange={onPageChange}
            onPrevious={onPrevious}
          />
        </motion.div>
      )}

      <DeleteReportModal
        show={showDeleteModel}
        onClose={handleDeleteReportModal}
      />

      {chosenReport && (
        <ReportActionContextMenu
          show={showContextMenu}
          top={contextMenuTop}
          left={contextMenuLeft}
          showReviewOption={isAuthorizedAndTimeToReviewReport}
          onViewDetail={() => {
            navigate(
              `/report-management/detail/information/${chosenReport.reportId}`
            );
          }}
          onMarkAsReviewed={() => {
            onMarkAsReviewed && onMarkAsReviewed(chosenReport.reportId);
          }}
          onReview={() => {
            navigate(
              `/report-management/detail/expenses/${chosenReport.reportId}`
            );
          }}
          onDownload={() => {
            const token = localStorage.getItem(LocalStorageItemKey.TOKEN);

            if (token && chosenReport) {
              downloadFileFromServer(
                `${
                  import.meta.env.VITE_BACKEND_HOST
                }report/download-xlsx?reportId=${chosenReport.reportId}`,
                token,
                `${chosenReport.name}.xlsx`
              );
            }
          }}
        />
      )}
    </div>
  );
};
