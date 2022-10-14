import { Attributes } from "../types";
import { attributes } from "../configs";

export type Action = {
  type: "update";
  payload: Attributes;
};

export const initialState: Attributes = Object.keys(attributes).reduce(
  (acc, key) => {
    return {
      ...acc,
      [key]: Object.keys(attributes[key])[0],
    };
  },
  {} as Record<string, string>
);

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case "update":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
