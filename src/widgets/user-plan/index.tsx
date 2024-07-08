import { FaPlusCircle } from "react-icons/fa";
import { IconButton } from "../../shared/icon-button";
import { Pagination } from "../../shared/pagination";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import clsx from "clsx";
import { TableCell } from "./ui/table-cell";
import { TableCellUsername } from "./ui/table-cell-username";
import { TableCellIcon } from "./ui/table-cell-icon";
import { useNavigate } from "react-router-dom";
import { ActiveConfirmModal } from "../user-active-confirm-modal";
import { UserDeactiveConfirmModal } from "../user-deactive-confirm-modal";
import { UserPreview } from "../../providers/store/api/usersApi";

enum AnimationStage {
  HIDDEN = "hidden",
  VISIBLE = "visible",
}

const animation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
    y: 10,
    transition: {
      delay: 0.4,
    },
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4,
    },
  },
};

const rowAnimation: Variants = {
  [AnimationStage.HIDDEN]: {
    opacity: 0,
  },
  [AnimationStage.VISIBLE]: {
    opacity: 1,
  },
};

export interface Row extends UserPreview {
  isFetching?: boolean;
}

interface Props {
  isFetching?: boolean;
  users?: Row[];
  page?: number | undefined | null;
  totalPage?: number;
  isDataEmpty?: boolean;
  onDeactivate?: (user: UserPreview) => any;
  onPageChange?: (page: number | undefined | null) => any;
  onPrevious?: () => any;
  onNext?: () => any;
}

export const TableUserManagement: React.FC<Props> = ({
  users,
  isFetching,
  page,
  totalPage,
  isDataEmpty,
  onDeactivate,
  onPageChange,
  onPrevious,
  onNext,
}) => {
  // Navigation
  const navigate = useNavigate();
  const [hoverRowIndex, setHoverRowIndex] = useState<number>();

  // Deactivate and activate user's id state
  const [chosenUser, setChosenUser] = useState<UserPreview>();

  // UI
  const [activeModal, setActiveModal] = useState<boolean>(false);
  const [deactiveModal, setDeactiveModal] = useState<boolean>(false);

  const handleCloseActiveModal = () => {
    setActiveModal(false);
  };

  const handleCloseDeactiveModal = () => {
    setDeactiveModal(false);
  };

  return (
    <div>
      <div className="shadow rounded-lg">
        <table className="text-center text-sm font-light mt-6 min-w-full overflow-hidden rounded">
          <thead className="bg-primary-100 dark:bg-primary-950/50 font-medium dark:border-neutral-500 dark:bg-neutral-600">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-4 w-[220px] font-extrabold text-primary-500/80 dark:text-primary-600/80 text-left"
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-4 w-[160px] font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                Deparment
              </th>
              <th
                scope="col"
                className="px-6 py-4 font-extrabold text-primary-500/80 dark:text-primary-600/80"
              >
                Position
              </th>
              <th scope="col">
                <IconButton
                  className="px-3"
                  tooltip="Add new user"
                  onClick={() => {
                    navigate(`/user-management/create`);
                  }}
                >
                  <FaPlusCircle className="text-[21px] text-primary-500/60 hover:text-primary-500/80 my-0.5" />
                </IconButton>
              </th>
            </tr>
          </thead>
          <tbody className="min-h-[250px]">
            {users &&
              users.map((user, index) => (
                <motion.tr
                  key={index}
                  variants={rowAnimation}
                  initial={AnimationStage.HIDDEN}
                  animate={AnimationStage.VISIBLE}
                  exit={AnimationStage.HIDDEN}
                  className={clsx({
                    "group border-b-2 border-neutral-100 dark:border-neutral-800 duration-200":
                      true,
                    "cursor-pointer": !isFetching,
                    "text-primary-500 hover:text-primary-600 dark:text-primary-600 dark:hover:text-primary-400":
                      !user.deactivate,
                    "text-primary-500/70 hover:text-primary-500 dark:text-primary-800 dark:hover:text-primary-600":
                      user.deactivate,
                    "bg-white dark:bg-neutral-800/50": index % 2 === 0,
                    "hover:bg-primary-50/50 dark:hover:bg-neutral-800/70":
                      index % 2 === 0 && !isFetching,
                    "bg-primary-50 dark:bg-neutral-800/80 dark:hover:bg-neutral-800":
                      index % 2 === 1,
                    "hover:bg-primary-100 dark:hover:bg-neutral-800":
                      index % 2 === 1 && !isFetching,
                  })}
                  onMouseEnter={() => {
                    setHoverRowIndex(index);
                  }}
                  onMouseLeave={() => {
                    setHoverRowIndex(undefined);
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`detail/${user.userId}`);
                  }}
                >
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[30px]"
                  >
                    {user.userId}
                  </TableCell>
                  <TableCellUsername
                    isFetching={isFetching}
                    skeletonClassName="w-[200px]"
                    deactivated={user.deactivate}
                  >
                    {user.username}
                  </TableCellUsername>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[100px]"
                  >
                    {user.role.name}
                  </TableCell>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[150px]"
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[150px]"
                  >
                    {user.department.name}
                  </TableCell>
                  <TableCell
                    isFetching={isFetching}
                    skeletonClassName="w-[150px]"
                  >
                    {user.position.name}
                  </TableCell>
                  <TableCellIcon
                    isFetching={isFetching}
                    index={index}
                    hoverRowIndex={hoverRowIndex}
                    deactivated={user.deactivate}
                    onIconClick={() => {
                      if (user.deactivate) {
                        setActiveModal(true);
                      } else {
                        setDeactiveModal(true);
                      }
                      setChosenUser(user);
                    }}
                  ></TableCellIcon>
                </motion.tr>
              ))}
          </tbody>
        </table>

        {isDataEmpty && (
          <div className="flex flex-row flex-wrap items-center justify-center w-full min-h-[250px] text-lg font-semibold text-neutral-400 italic">
            No data found.
          </div>
        )}
      </div>

      {!isDataEmpty && (
        <motion.div
          initial={AnimationStage.HIDDEN}
          animate={AnimationStage.VISIBLE}
          variants={animation}
        >
          <Pagination
            className="mt-6"
            page={page}
            totalPage={totalPage || 1}
            onNext={onNext}
            onPageChange={onPageChange}
            onPrevious={onPrevious}
          />
        </motion.div>
      )}

      <ActiveConfirmModal show={activeModal} onClose={handleCloseActiveModal} />
      <UserDeactiveConfirmModal
        user={chosenUser}
        show={deactiveModal}
        onClose={handleCloseDeactiveModal}
        onDeactivate={onDeactivate}
      />
    </div>
  );
};
