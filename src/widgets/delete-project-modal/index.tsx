import { IconButton } from "../../shared/icon-button";
import { Modal } from "../../shared/modal";
import { IoClose } from "react-icons/io5";
import { Button } from "../../shared/button";
import { IoIosWarning } from "react-icons/io";
import {
  Project,
  useDeleteProjectMutation,
} from "../../providers/store/api/projectsApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ErrorData } from "../../providers/store/api/type";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import { useTranslation } from "react-i18next";

interface Props {
  project: Project;
  show: boolean;
  onClose: () => any;
  onDeleteSuccessfully?: (project: Project) => any;
}

export const DeleteProjectModal: React.FC<Props> = ({
  project,
  show,
  onClose,
  onDeleteSuccessfully,
}) => {
  // i18n
  const { t } = useTranslation(["project-management"]);

  // Mutation
  const [deleteProject, { isError, isLoading, isSuccess, error }] =
    useDeleteProjectMutation();

  useEffect(() => {
    if (!isLoading && !isError && isSuccess) {
      toast("Delete project successfully!", { type: "success" });
      onClose && onClose();
      onDeleteSuccessfully && onDeleteSuccessfully(project);
    }
  }, [isError, isLoading, isSuccess]);

  // Error message
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isError) {
      if (
        error &&
        typeof error === "object" &&
        "data" in error &&
        error.data &&
        typeof error.data === "object" &&
        "message" in (error.data as any)
      ) {
        setErrorMessage(
          uppercaseFirstCharacter((error.data as ErrorData).message)
        );
      } else {
        setErrorMessage("Something went wrong, please try again!");
      }
    }
  }, [isError]);

  useEffect(() => {
    if (isError) {
      toast(errorMessage, { type: "error" });
    }
  }, [isError, errorMessage]);

  return (
    <Modal
      className="w-[70vw] xl:w-[50vw] h-max flex flex-col justify-center items-center"
      show={show}
      onClose={onClose}
    >
      <div className="relative w-full h-full flex flex-col items-center justify-center px-10 py-8">
        <div className="absolute top-3 right-5">
          <IconButton
            className="hover:bg-neutral-100"
            onClick={(event) => {
              event.stopPropagation();
              onClose && onClose();
            }}
          >
            <IoClose className="text-3xl text-neutral-500" />
          </IconButton>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-row flex-wrap items-center justify-center size-[100px] bg-red-100 dark:bg-red-900/50 rounded-full">
            <IoIosWarning className="text-[56px] text-red-500/80 dark:text-red-700/80" />
          </div>
          <div className="font-bold dark:font-extrabold text-2xl text-red-400 dark:text-red-500/70 mt-5">
            {t("Delete project")}
          </div>
          <div className="font-semibold dark:font-bold text-red-400 dark:text-red-500 mt-5">
            {t("delete_project_message.part1")}{" "}
            <span className="font-extrabold text-red-500 dark:text-red-600">
              {/* "{supplier.name}" */}"
              {t("delete_project_message.part2", {
                projectName: project.name,
              })}
              "
            </span>
            {t("delete_project_message.part3")}
          </div>
          <div className="mt-3 font-semibold dark:font-bold text-red-400 dark:text-red-500">
            {t("confirmation_message.part1")}{" "}
            <span className="font-extrabold text-red-500 dark:text-red-600">
              {t("confirmation_message.part2")}
            </span>{" "}
            {t("confirmation_message.part3")}
          </div>
        </div>

        <div className="mt-10 flex flex-row gap-6 w-full">
          <Button
            className="font-bold w-[250px] p-3"
            onClick={() => {
              onClose && onClose();
            }}
          >
            {t("No, cancel")}
          </Button>
          <Button
            containerClassName="flex-1"
            className="p-3"
            variant="error"
            buttonType="outlined"
            onClick={() => {
              deleteProject({ projectId: project.projectId });
            }}
          >
            {t("Yes, delete")}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
