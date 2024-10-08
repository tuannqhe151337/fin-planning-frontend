import { useTranslation } from "react-i18next";
import { FaUpload } from "react-icons/fa";

export const EmptyFileUploadUI: React.FC = () => {
  // i18n
  const { t } = useTranslation(["plan-management"]);
  return (
    <div className="flex flex-col flex-wrap items-center justify-evenly w-full h-full">
      <div className="flex flex-col flex-wrap items-center justify-center flex-1">
        <div>
          <FaUpload
            size={75}
            className={
              "text-primary-200/70 group-hover:text-primary-200/90 dark:text-primary-800/80 dark:group-hover:text-primary-700 duration-150"
            }
          />
        </div>
        <p className="mt-3 text-xl font-bold text-primary-500/50 group-hover:text-primary-500/80 duration-150">
          {t("Select plan file to upload", {
            defaultValue: "Select plan file to upload",
          })}
        </p>
        <p className="text-sm text-primary-400/60 group-hover:text-primary-500/60 dark:group-hover:text-primary-500/90 font-semibold duration-150">
          {t("or drag and drop here", {
            defaultValue: "or drag and drop here",
          })}
        </p>
      </div>

      <div className="flex flex-col flex-wrap items-center justify-center gap-1 mt-auto mb-5">
        <p className="text-sm text-primary-400/60 dark:text-primary-600/70 group-hover:text-primary-500/60 dark:group-hover:text-primary-500/90 font-bold duration-150">
          {t("Allow file type: xls, xlsx, csv", {
            defaultValue: "Allow file type: xls, xlsx, csv",
          })}
        </p>
        <p className="text-xs text-primary-400/60 dark:text-primary-600/70 group-hover:text-primary-500/60 dark:group-hover:text-primary-500/90 font-semibold duration-150">
          {t("Maximum file size: 500Mb", {
            defaultValue: "Maximum file size: 500Mb",
          })}
        </p>
      </div>
    </div>
  );
};
