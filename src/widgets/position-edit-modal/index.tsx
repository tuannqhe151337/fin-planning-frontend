import React, { useEffect } from "react";
import { Modal } from "../../shared/modal";
import { IconButton } from "../../shared/icon-button";
import { IoClose } from "react-icons/io5";
import { Button } from "../../shared/button";
import { TEInput } from "tw-elements-react";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputValidationMessage } from "../../shared/validation-input-message";
import {
  Position,
  useUpdatePositionMutation,
} from "../../providers/store/api/positionApi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { ErrorNotificationCard } from "../../shared/error-notification-card";
import clsx from "clsx";
import { useProcessError } from "../../shared/utils/use-process-error";
import { useTranslation } from "react-i18next";

type FormData = {
  positionName: string;
};

const PositionNameSchema = z
  .string()
  .min(5, "Position name length must be at least 5 characters")
  .max(50, "Position name length must be at most 50 characters");

export const UpdatePositionSchema: ZodType<FormData> = z.object({
  positionName: PositionNameSchema,
});

interface Props {
  show: boolean;
  position: Position;
  onClose: () => any;
  onUpdateSuccessfully?: () => any;
}

export const PositionEditModal: React.FC<Props> = ({
  show,
  position,
  onClose,
  onUpdateSuccessfully,
}) => {
  // i18n
  const { t } = useTranslation(["position-management"]);

  // Form
  const {
    register,
    watch,
    formState: { dirtyFields, isValid },
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(UpdatePositionSchema), // Apply the zodResolver
    defaultValues: {
      positionName: position.name,
    },
  });

  // Reset
  useEffect(() => {
    reset();
  }, [show]);

  // Update form on external position name change
  useEffect(() => {
    setValue("positionName", position.name);
  }, [position]);

  // Update new Position mutation
  const [updatePosition, { isSuccess, isLoading, isError, error }] =
    useUpdatePositionMutation();

  // On submit
  const onSubmit: SubmitHandler<FormData> = (data) => {
    updatePosition({
      positionId: position.id,
      positionName: data.positionName,
    });
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      toast("Update position successfully!", { type: "success" });

      onUpdateSuccessfully && onUpdateSuccessfully();
    }
  }, [isLoading, isSuccess]);

  // Error message
  const errorMessage = useProcessError({ error, isError });

  return (
    <Modal
      className="w-[45vw] h-max flex flex-col justify-center items-center"
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

        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center w-full">
            <div className="font-bold dark:font-extra bold text-2xl text-primary-400 dark:text-primary-500/70 -mt-2.5">
              {t("Update position")}
            </div>

            <ErrorNotificationCard
              className="mt-3"
              show={!isLoading && isError}
              errorMessage={errorMessage}
            />

            <div
              className={clsx({
                "w-full": true,
                "mt-5": !isError,
                "mt-1.5": isError,
              })}
            >
              <TEInput
                autoFocus
                className="w-full"
                label={t("Position name")}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.currentTarget.blur();
                  }
                }}
                {...register("positionName", { required: true })}
              />
              <InputValidationMessage
                show={dirtyFields.positionName || false}
                validateFn={() =>
                  PositionNameSchema.parse(watch("positionName"))
                }
              />
            </div>
          </div>

          <div className="mt-5 flex flex-row gap-3 w-full">
            <Button
              type="button"
              variant="tertiary"
              tabIndex={-1}
              className="font-bold w-[200px] p-3"
              onClick={() => {
                onClose && onClose();
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              tabIndex={-1}
              containerClassName="flex-1"
              className="p-3"
            >
              {!isLoading && t("Update position")}
              {isLoading && (
                <CgSpinner className="m-auto text-lg animate-spin" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
