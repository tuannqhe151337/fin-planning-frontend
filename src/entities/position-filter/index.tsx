import { AsyncPaginate } from "react-select-async-paginate";
import type { LoadOptions } from "react-select-async-paginate";
import { useRef, useState } from "react";
import { useLazyGetListPositionQuery } from "../../providers/store/api/positionApi";

interface PositionOption {
  value: number;
  label: string;
}

const pageSize = 10;

const DefaultOption: PositionOption = {
  value: 0,
  label: "All position",
};

interface Props {
  onChange?: (option: PositionOption | null) => any;
  defaultOption?: PositionOption;
}

export const PositionFilter: React.FC<Props> = ({
  onChange,
  defaultOption = DefaultOption,
}) => {
  // Fetch initial data
  const [page, setPage] = useState<number>(1);
  const [getListPositionQuery, { isFetching }] = useLazyGetListPositionQuery();

  // Convert data to option
  const loadOptions: LoadOptions<PositionOption, any, any> = async (query) => {
    // Fetch data
    const data = await getListPositionQuery({
      page,
      pageSize,
      query,
    }).unwrap();

    // Load options
    const hasMore = page < data.pagination.numPages;

    const loadOptions = {
      options: data?.data
        .map(({ id, name }) => ({
          value: id,
          label: name,
        }))
        .filter(({ value }) => value !== defaultOption.value),
      hasMore,
    };

    if (page === 1 && query === "") {
      loadOptions.options.unshift(defaultOption);
    }

    // Update page
    if (hasMore) {
      setPage((page) => page + 1);
    }

    return loadOptions;
  };

  // Select state
  const [selectedOption, setSelectedOption] = useState<PositionOption | null>(
    defaultOption
  );

  return (
    <div>
      <AsyncPaginate
        classNamePrefix="custom-select"
        className="w-[200px] cursor-pointer"
        value={selectedOption}
        isLoading={isFetching}
        onChange={(value) => {
          if (value) {
            setSelectedOption(value);
            onChange && onChange(value);
          }
        }}
        options={[defaultOption]}
        loadOptions={loadOptions}
      />
    </div>
  );
};
