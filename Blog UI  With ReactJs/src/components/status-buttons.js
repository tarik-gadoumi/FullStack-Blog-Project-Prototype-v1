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
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAsync } from "../utils/hooks";
import { CircleButton, Spinner } from "./lib";
import {
  clientCreateReadingOrFinishedPosts,
  clientGetUserAllPosts,
  clientRemoveUserTargetedPost,
  clientUpdateUserTargetedPost,
} from "../utils/api-client";

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
  const queryClient = useQueryClient();

  const { data: listItems } = useQuery({
    queryKey: "list-items",
    queryFn: () =>
      clientGetUserAllPosts({ token: props.user.token }).then(
        (data) => data.data.data
      ),
  });
  const { mutate: Create } = useMutation(
    () =>
      clientCreateReadingOrFinishedPosts({
        user: props.user,
        postId: props.postId,
        post: props.post,
      }),
      {
        onSettled: () => {
          queryClient.invalidateQueries("list-items");
          queryClient.invalidateQueries("Reading-items");
          queryClient.invalidateQueries("Finished-items");
        }
      },
  );
  const { mutate: Update } = useMutation(
    ({ finishDate }) =>
      clientUpdateUserTargetedPost({
        token: props.user.token,
        postId: props.postId,
        data: { finishDate },
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries("list-items");
        queryClient.invalidateQueries("Reading-items");
        queryClient.invalidateQueries("Finished-items");
      },
    }
  );
  const { mutate: Delete } = useMutation(
    () =>
      clientRemoveUserTargetedPost({
        token: props.user.token,
        postId: props.postId,
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries("list-items");
        queryClient.invalidateQueries("Reading-items");
        queryClient.invalidateQueries("Finished-items");
      },
    }
  );

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
