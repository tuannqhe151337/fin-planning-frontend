import { motion } from "framer-motion";
import { FaUpload } from "react-icons/fa";
import { FaListUl } from "react-icons/fa6";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface Props {
  stage: number;
}

export const StepProgress: React.FC<Props> = ({ stage }) => {

  // i18n
  const { t } = useTranslation(["plan-management"]);

  return (
    <div className="relative md:w-[800px] xl:w-[1000px] h-fit">
      <div className="absolute w-full h-full top-[23px] left-0 z-0">
        <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-600 rounded-full z-10"></div>
      </div>

      <div className="absolute w-full h-full top-[23px] left-0 z-0">
        <motion.div
          layout
          className={clsx({
            "h-1 bg-primary-500 dark:bg-primary-800 rounded-full z-20": true,
            "w-0": stage === 0,
            "w-1/4": stage === 1,
            "w-3/4": stage === 2,
          })}
        ></motion.div>
      </div>

      <div className="relative z-30">
        <div className="flex flex-row flex-wrap items-center justify-around">
          {/* Step 1 */}
          <div className="flex flex-col flex-wrap items-center">
            <div
              className={clsx({
                "flex flex-row flex-wrap items-center justify-center size-[50px] rounded-full duration-500":
                  true,
                "bg-neutral-300 dark:bg-neutral-600": stage < 1,
                "bg-primary-500 dark:bg-primary-700": stage >= 1,
              })}
            >
              <FaUpload
                className={clsx({
                  "text-lg mb-1 duration-500": true,
                  "text-white dark:text-neutral-400": stage < 1,
                  "text-white": stage >= 1,
                })}
              />
            </div>
            <p
              className={clsx({
                "mt-1.5 text-sm font-bold duration-500": true,
                "text-neutral-300 dark:text-neutral-500": stage < 1,
                "text-primary-500": stage >= 1,
              })}
            >
              {t("Upload plan")}
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col flex-wrap items-center">
            <div
              className={clsx({
                "flex flex-row flex-wrap items-center justify-center size-[50px] rounded-full duration-500":
                  true,
                "bg-neutral-300 dark:bg-neutral-600": stage < 2,
                "bg-primary-500 dark:bg-primary-800": stage >= 2,
              })}
            >
              <FaListUl
                className={clsx({
                  "text-lg duration-500": true,
                  "text-white dark:text-neutral-400": stage < 2,
                  "text-white": stage >= 2,
                })}
              />
            </div>
            <p
              className={clsx({
                "mt-1.5 text-sm font-bold duration-500": true,
                "text-neutral-300 dark:text-neutral-500": stage < 2,
                "text-primary-500": stage >= 2,
              })}
            >
              {t("Confirm expenses")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
