import axios from "axios";
import { getToken } from "./auth-provider";
const client = async () => {
  let token = [];
  await getToken().then((response) => token.push(response));
  return await axios(process.env.REACT_APP_API_URL_MATCHSORTER, {
    headers: {
      Authorization: `Bearer ${token[0]}`,
    },
  });
};
const clientFilter = async (query) => {
  let token = [];
  await getToken().then((response) => token.push(response));
  axios.post(
    `${process.env.REACT_APP_API_URL_FILTREDLIST}`,
    `query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Basic ${token[0]}`,
      },
    }
  );
  return await axios(process.env.REACT_APP_API_URL_FILTREDLIST, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token[0]}`,
    },
  });
};
const clientGetUser = async ({ token } = {}) => {
  return await axios(process.env.REACT_APP_AUTH_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const clientGetPosts = async (endpoint, { token } = {}) => {
  return await axios(`${process.env.REACT_APP_LUMEN_API_V1}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const clientCreateReadingOrFinishedPosts = async ({ user, postId, post }) => {
  const data = {
    owner_id: user.id,
    post: JSON.stringify(post),
    post_id: postId,
    startDate: Date.now(),
    finishDate: null,
    notes: null,
  };
  return axios.post(process.env.REACT_APP_LUMEN_API_V1_CREATREADINGLIST, data, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${user.token}`,
    },
  });
};
const clientGetUserAllPosts = async ({ token }) => {
  return axios(process.env.REACT_APP_LUMEN_API_V1_GLOBALUSERLIST, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const clientRemoveUserTargetedPost = async ({ token, postId }) => {
  return axios.delete(
    `${process.env.REACT_APP_LUMEN_API_V1_GLOBALUSERLIST}/${postId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const clientUpdateUserTargetedPost = async ({ token, postId, data }) => {
  return axios.patch(
    `${process.env.REACT_APP_LUMEN_API_V1_GLOBALUSERLIST}/${postId}`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
const clientGetUserReadingPosts = async ({ token }) => {
  return axios(process.env.REACT_APP_LUMEN_API_V1_READINGLIST, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
const clientGetUserFinishedPosts = async ({ token }) => {
  return axios(process.env.REACT_APP_LUMEN_API_V1_FINISHEDLIST, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export {
  client,
  clientFilter,
  clientGetUser,
  clientGetPosts,
  clientCreateReadingOrFinishedPosts,
  clientGetUserAllPosts,
  clientRemoveUserTargetedPost,
  clientUpdateUserTargetedPost,
  clientGetUserReadingPosts,
  clientGetUserFinishedPosts,
};
