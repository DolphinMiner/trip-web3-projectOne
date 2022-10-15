import React, { useReducer } from "react";
import configs from "../configs";
import { Attributes } from "../types";

type Action = {
  type: "update";
  payload: Attributes;
};

const initialState = Object.keys(configs.attributes).reduce((acc, attr) => {
  return {
    ...acc,
    [attr]: Object.keys(configs.attributes[attr])[0],
  };
}, {} as Attributes);

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case "update":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
const useAvatar = () => {
  const [attributes, dispatch] = useReducer(reducer, initialState);
  return {
    attributes,
    setAttributes: (payload: Attributes) =>
      dispatch({
        type: "update",
        payload,
      }),
  };
};

export default useAvatar;
