import { useEffect, useState } from "react";
import Select from "react-select";
import {
  Status,
  useGetListStatusTermQuery,
} from "../../providers/store/api/statusApi";

interface Option {
  value: number;
  label: string;
}

const defaultOption: Option = {
  value: 0,
  label: "All Status",
};

const convertStatusToOptions = (roles: Status[]) => {
  return roles.map(({ statusId: id, name }) => ({ label: name, value: id }));
};

interface Props {
  onChange?: (option: Option | null | undefined) => any;
}

export const StatusTermFilter: React.FC<Props> = ({ onChange }) => {
  // Fetch initial data
  const { data } = useGetListStatusTermQuery();

  // Select state
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    defaultOption
  );

  useEffect(() => {
    onChange && onChange(selectedOption);
  }, [selectedOption]);

  return (
    <div>
      <Select
        classNamePrefix="custom-select"
        className="w-[200px] cursor-pointer"
        isSearchable
        value={selectedOption}
        onChange={(value) => setSelectedOption(value)}
        options={[defaultOption, ...convertStatusToOptions(data?.data || [])]}
      />
    </div>
  );
};
