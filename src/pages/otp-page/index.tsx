import { AnimatePresence, Variants, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate } from "react-router-dom";
import { LanguageChanger } from "../../features/language-changer";
import { ThemeChanger } from "../../features/theme-changer";
import { DarkmodeChanger } from "../../features/darkmode-changer";
import { BubbleBackground } from "../../entities/bubble-background";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../widgets/otp-input";

import { useDispatch, useSelector } from "react-redux";
import {
  selectEmailToken,
  setOtpToken,
} from "../../providers/store/slices/forgotPasswordSlice";
import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useOtpMutation } from "../../providers/store/api/usersApi";
import { useEffect, useState } from "react";
import { ErrorData } from "../../providers/store/api/type";
import { uppercaseFirstCharacter } from "../../shared/utils/uppercase-first-character";
import { InputValidationMessage } from "../../shared/validation-input-message";
import { CgSpinner } from "react-icons/cg";
import { Button } from "../../shared/button";
import { FaCircleExclamation } from "react-icons/fa6";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const staggerChildrenAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
  [AnimationStage.VISIBLE]: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      duration: 0.2,
    },
  },
};

const childrenAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const imageAnimation: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
    },
  },
};

const heightPlaceholderAnimation: Variants = {
  hidden: {
    height: 0,
    transition: {
      delay: 0.5,
    },
  },
  visible: {
    height: 60,
  },
};

type FormData = {
  otp: string;
};

const OtpSchema = z.string().length(6, "OTP must be 6 characters long");

export const OTPSchema: ZodType<FormData> = z.object({
  otp: OtpSchema,
});

export const OtpPage: React.FC = () => {
  const dispatch = useDispatch();

  const { t } = useTranslation(["otp"]);

  // Navigate
  const navigate = useNavigate();

  const emailToken = useSelector(selectEmailToken);

  // Form
  const {
    // register,
    watch,
    formState: { isValid },
    handleSubmit,
    control,
    // setValue,
  } = useForm<FormData>({
    resolver: zodResolver(OTPSchema),
  });

  // OTP values
  // const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  // Mutation
  const [otp, { isLoading, data, isSuccess, isError, error }] =
    useOtpMutation();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (emailToken) {
      otp({
        otp: data.otp,
        emailToken,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      // toast("Change password successfully!", { type: "success" });
      dispatch(setOtpToken(data.token));
      navigate("/auth/reset-password");
    }
  }, [isSuccess]);

  // Error message
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isError) {
      if (error && "data" in error && "message" in (error.data as any)) {
        setErrorMessage(
          uppercaseFirstCharacter((error.data as ErrorData).message)
        );
      } else {
        setErrorMessage("Something went wrong, please try again!");
      }
    }
  }, [isError]);

  return (
    <div className="flex flex-row flex-wrap w-full">
      <div className="flex flex-row flex-wrap items-center w-full z-20">
        <div className="text-5xl text-primary-500 ml-16 p-6">
          <span className="text-4xl font-black">F</span>
          <span className="text-3xl font-extrabold">in</span>
          <span className="text-4xl font-black">P</span>
          <span className="text-3xl font-extrabold">lanning</span>
        </div>

        <div className="ml-auto flex flex-row flex-wrap items-center pr-10 z-20">
          <div className="ml-1.5">
            <LanguageChanger />
          </div>
          <ThemeChanger />
          <DarkmodeChanger />
        </div>
      </div>

      <BubbleBackground />

      <div className="flex flex-row flex-wrap w-full mt-16">
        <div className="flex-1">
          <motion.div className="flex justify-center items-center dark:brightness-50">
            <motion.img
              initial={AnimationStage.HIDDEN}
              animate={AnimationStage.VISIBLE}
              variants={imageAnimation}
              src="/images/otp.svg"
              alt=""
              className="h-[440px]"
            />
          </motion.div>
        </div>

        <div className="flex-1 z-10 flex justify-center items-center">
          <motion.div
            className="w-[560px] flex flex-col items-center"
            initial={AnimationStage.HIDDEN}
            animate={AnimationStage.VISIBLE}
            variants={staggerChildrenAnimation}
          >
            <motion.div
              variants={childrenAnimation}
              className="mb-8 font-bold text-center text-3xl text-primary-500"
            >
              {t("otpConfirm")}
            </motion.div>

            <div className="relative w-full">
              <AnimatePresence>
                {!isLoading && isError && (
                  <div className="absolute w-full">
                    <div className="flex flex-row flex-wrap items-center p-3 gap-3 bg-red-400/30 dark:bg-red-800/30 rounded-lg w-full">
                      <FaCircleExclamation className="text-red-500 dark:text-red-600" />
                      <p className="text-sm text-red-600 dark:text-red-500 font-semibold">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>

              <motion.div
                initial={AnimationStage.HIDDEN}
                animate={
                  isError ? AnimationStage.VISIBLE : AnimationStage.HIDDEN
                }
                variants={heightPlaceholderAnimation}
              />
            </div>

            <motion.div variants={childrenAnimation}>
              <Controller
                name="otp"
                control={control}
                render={({ field }) => (
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </motion.div>
            <InputValidationMessage
              show={true}
              validateFn={() => OtpSchema.parse(watch("otp"))}
              className="mt-2 pl-0"
            />

            <motion.div className="mt-5 w-full" variants={childrenAnimation}>
              <Button
                disabled={!isValid}
                containerClassName="w-full"
                className="font-bold"
                onClick={() => {
                  handleSubmit(onSubmit)();
                }}
              >
                {!isLoading && <>{t("confirm")}</>}
                {isLoading && (
                  <CgSpinner className="m-auto text-lg animate-spin" />
                )}
              </Button>
            </motion.div>

            <motion.div
              className="w-full flex justify-end"
              variants={childrenAnimation}
            >
              <a
                href="#!"
                className="mt-4 text-bold underline block text-primary-500 transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
              >
                {t("resendOTP")}
              </a>
            </motion.div>
          </motion.div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
