import { useState } from "react";
import Select from "react-select";
import {
  ReportStatus,
  useGetListStatusReportQuery,
} from "../../providers/store/api/statusApi";

interface Option {
  value: number;
  label: string;
}

const DefaultOption: Option = {
  value: 0,
  label: "All Status",
};

const convertStatusToOptions = (
  status: ReportStatus[],
  excludeRoleId?: number
) => {
  return status
    .map(({ statusId, name }) => ({ label: name, value: statusId }))
    .filter(({ value }) => value !== excludeRoleId);
};

interface Props {
  defaultOption?: Option;
  onChange?: (option: Option | null | undefined) => any;
}

export const StatusReportFilter: React.FC<Props> = ({
  onChange,
  defaultOption = DefaultOption,
}) => {
  // Fetch initial data
  const { data } = useGetListStatusReportQuery();

  // Select state
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    defaultOption
  );

  return (
    <div>
      <Select
        classNamePrefix="custom-select"
        className="w-[200px] cursor-pointer"
        isSearchable
        value={selectedOption}
        onChange={(value) => {
          if (value) {
            setSelectedOption(value);
            onChange && onChange(value);
          }
        }}
        options={[
          defaultOption,
          ...convertStatusToOptions(data?.data || [], defaultOption.value),
        ]}
      />
    </div>
  );
};
