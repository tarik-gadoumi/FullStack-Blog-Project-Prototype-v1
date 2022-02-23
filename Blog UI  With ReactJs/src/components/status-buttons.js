/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import {
  FaCheckCircle,
  FaPlusCircle,
  FaMinusCircle,
  FaBook,
  FaTimesCircle,
} from "react-icons/fa";
import "@reach/tooltip/styles.css";
import Tooltip from "@reach/tooltip";
import { useQuery } from "react-query";
import { useAsync } from "../utils/hooks";
import { CircleButton, Spinner } from "./lib";
import { clientGetUserAllPosts } from "../utils/api-client";
import { useCRUDhooks } from "../utils/PostHooks";
function TooltipButton({ label, highlight, onClick, icon, ...rest }) {
  const { isLoading, isError, error, run } = useAsync();

  function handleClick() {
    run(onClick());
  }

  return (
    <Tooltip label={isError ? error.message : label}>
      <CircleButton
        css={{
          backgroundColor: "white",
          ":hover,:focus": {
            color: isLoading ? "lightgrey" : isError ? "red" : highlight,
          },
        }}
        disabled={isLoading}
        onClick={handleClick}
        aria-label={isError ? error.message : label}
        {...rest}
      >
        {isLoading ? <Spinner /> : isError ? <FaTimesCircle /> : icon}
      </CircleButton>
    </Tooltip>
  );
}
function StatusButtons(props) {
  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      clientGetUserAllPosts({ token: props.user.token }).then(
        (data) => data.data.data
      ),
  });
  const { useMutationForCreate, useMutationForUpdate, useMutationForDelete } =
    useCRUDhooks({
      user: props.user,
      postId: props.postId,
      post: props.post,
    });
  const { mutate: Create } = useMutationForCreate();
  const { mutate: Update } = useMutationForUpdate();
  const { mutate: Delete } = useMutationForDelete();

  const listItem =
    listItems?.find((v) => v.post_id === parseInt(props.postId)) ?? null;

  return (
    <React.Fragment>
      {listItem ? (
        Boolean(listItem.finishDate) ? (
          <TooltipButton
            label="Unmark as read"
            css={{ background: "gold" }}
            highlight={"yellow"}
            onClick={async () => Update({ finishDate: null })}
            icon={<FaBook />}
          />
        ) : (
          <TooltipButton
            label="Mark as read"
            css={{ background: "lightgreen" }}
            highlight={"green"}
            onClick={async () => Update({ finishDate: Date.now() })}
            icon={<FaCheckCircle />}
          />
        )
      ) : null}
      {listItem ? (
        <TooltipButton
          label="Remove from list"
          css={{ background: "orangered" }}
          highlight={"white"}
          onClick={async () => Delete()}
          icon={<FaMinusCircle />}
        />
      ) : (
        <TooltipButton
          label="Add to list"
          highlight={"indigo"}
          onClick={async () => Create()}
          icon={<FaPlusCircle />}
        />
      )}
    </React.Fragment>
  );
}

export { StatusButtons };
