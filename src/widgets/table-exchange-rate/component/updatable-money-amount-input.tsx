import React, { useEffect, useState } from "react";
import {
  AFFIX,
  useUpdateExchangeRateMutation,
} from "../../../providers/store/api/exchangeRateApi";
import { NumericFormat } from "react-number-format";
import { TEInput } from "tw-elements-react";
import { toast } from "react-toastify";

interface Props {
  exchangeId: number;
  initialValue?: number;
  symbol?: string;
  affix?: AFFIX;
}

export const UpdatableMoneyAmountInput: React.FC<Props> = ({
  exchangeId,
  initialValue,
  symbol,
  affix,
}) => {
  // Value input state
  const [value, setValue] = useState<number | null | undefined>(initialValue);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Update
  const [updateExchangeRate, { isSuccess }] = useUpdateExchangeRateMutation();

  useEffect(() => {
    if (isSuccess) {
      toast("Update successfully!", { type: "success" });
      setIsDirty(false);
    }
  }, [isSuccess]);

  return (
    <NumericFormat
      className="!text-neutral-500/80"
      customInput={TEInput}
      value={value}
      allowNegative={false}
      prefix={affix === AFFIX.PREFIX ? symbol : undefined}
      suffix={affix === AFFIX.SUFFIX ? symbol : undefined}
      thousandSeparator=","
      decimalSeparator="."
      onValueChange={({ floatValue }) => {
        setValue(floatValue);
        setIsDirty(true);
      }}
      onBlur={() => {
        isDirty && updateExchangeRate({ exchangeId, amount: value || 0 });
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          isDirty && updateExchangeRate({ exchangeId, amount: value || 0 });
        }
      }}
    />
  );
};