import { Attributes } from "../types";

export type Action = {
  type: 'update';
  payload: Partial<Attributes>;
} | {
  type: 'shuffle',
};

export const initialState: Attributes = {
  skin: "default",
  accessory: "earphones",
  eye: "cry",
  eyebrow: "angry",
  mouth: "default",
  clothe: "blazer",
  hair: "hairbun",
  eyeglass: "none",
};

export function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}