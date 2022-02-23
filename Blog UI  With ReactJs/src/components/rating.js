/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { BsSuitHeartFill } from "react-icons/bs";
import { useCRUDhooks } from "../utils/PostHooks";

const visuallyHiddenCSS = {
  border: "0",
  clip: "rect(0 0 0 0)",
  height: "1px",
  margin: "-1px",
  overflow: "hidden",
  padding: "0",
  position: "absolute",
  width: "1px",
};

function Rating({ listItem, user, postId }) {
  const [isTabbing, setIsTabbing] = React.useState(false);

  const { useMutationForUpdate } = useCRUDhooks({ user, postId });
  const { mutate: Update } = useMutationForUpdate();

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Tab") {
        setIsTabbing(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown, { once: true });
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const rootClassName = `list-item-${listItem.id}`;
  const hearts = Array.from({ length: 5 }).map((x, i) => {
    const ratingId = `rating-${listItem.id}-${i}`;
    const ratingValue = i + 1;
    return (
      <React.Fragment key={i}>
        <input
          name={rootClassName}
          type="radio"
          id={ratingId}
          value={ratingValue}
          checked={ratingValue === listItem.rating}
          onChange={() => {
            Update({ rating: ratingValue });
          }}
          css={[
            visuallyHiddenCSS,
            {
              [`.${rootClassName} &:checked ~ label`]: { color: "lightgrey" },
              [`.${rootClassName} &:checked + label`]: { color: "red" },

              [`.${rootClassName} &:hover ~ label`]: {
                color: `${"lightgrey"} !important`,
              },
              [`.${rootClassName} &:hover + label`]: {
                color: `${"red"} !important`,
              },
              [`.${rootClassName} &:focus + label svg`]: {
                outline: isTabbing
                  ? ["1px solid lightgrey", "-webkit-focus-ring-color auto 5px"]
                  : "initial",
              },
            },
          ]}
        />
        <label
          htmlFor={ratingId}
          css={{
            cursor: "pointer",
            color: listItem.rating === 0 ? "lightgrey" : "red",
            margin: 0,
          }}
        >
          <span css={visuallyHiddenCSS}>
            {ratingValue} {ratingValue === 1 ? "heart" : "hearts"}
          </span>
          <BsSuitHeartFill css={{ width: "16px", margin: "0 2px" }} />
        </label>
      </React.Fragment>
    );
  });
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={rootClassName}
      css={{
        display: "inline-flex",
        alignItems: "center",
        [`&.${rootClassName}:hover input + label`]: {
          color: "red",
        },
      }}
    >
      <span css={{ display: "flex" }}>{hearts}</span>
    </div>
  );
}

export { Rating };
