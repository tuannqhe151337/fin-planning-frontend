import { AsyncPaginate } from "react-select-async-paginate";
import type { LoadOptions } from "react-select-async-paginate";
import { useState } from "react";
import { cn } from "../../shared/utils/cn";
import { useLazyGetListCostTypeQuery } from "../../providers/store/api/costTypeAPI";

interface CostTypeOption {
  value: number;
  label: string;
}

const pageSize = 10;

const DefaultOption: CostTypeOption = {
  value: 0,
  label: "All cost type",
};

interface Additional {
  page: number;
}

interface Props {
  className?: string;
  onChange?: (option: CostTypeOption | null) => any;
  defaultOption?: CostTypeOption;
}

export const CostTypeFilter: React.FC<Props> = ({
  className,
  onChange,
  defaultOption = DefaultOption,
}) => {
  // Fetch initial data
  const [getListCostTypeQuery, { isFetching }] = useLazyGetListCostTypeQuery();

  // Convert data to option
  const loadOptions: LoadOptions<CostTypeOption, any, Additional> = async (
    query,
    _,
    additional
  ) => {
    const page = additional?.page || 1;

    // Fetch data
    const data = await getListCostTypeQuery({
      page,
      pageSize,
      query,
    }).unwrap();

    // Load options
    const hasMore = page < data.pagination.numPages;

    const loadOptions = {
      options: data?.data
        .map(({ costTypeId, name }) => ({
          value: costTypeId,
          label: name,
        }))
        .filter(({ value }) => value !== defaultOption.value),
      hasMore,
    };

    // Default option
    if (page === 1 && query === "") {
      loadOptions.options.unshift(defaultOption);
    }

    return loadOptions;
  };

  // Select state
  const [selectedOption, setSelectedOption] = useState<CostTypeOption | null>(
    defaultOption
  );

  return (
    <div>
      <AsyncPaginate
        classNamePrefix="custom-select"
        className={cn("w-[200px] cursor-pointer", className)}
        value={selectedOption}
        isLoading={isFetching}
        onChange={(value) => {
          if (value) {
            setSelectedOption(value);
            onChange && onChange(value);
          }
        }}
        // options={[defaultOption]}
        loadOptions={loadOptions}
      />
    </div>
  );
};
