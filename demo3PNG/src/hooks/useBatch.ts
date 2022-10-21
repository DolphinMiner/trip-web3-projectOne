import { useReducer } from "react";
import { DEFAULT_TOTAL } from "../constants";
import { Attributes } from "../types";
import { batchShuffleWithSupply, shuffle } from "../utils";

type State = Array<Attributes>;
type Action =
  | {
      type: "update";
      payload: {
        index: number;
        entity: Attributes;
      };
    }
  | {
      type: "shuffle";
      payload: {
        total: number;
      };
    };

const generateState = (total: number = DEFAULT_TOTAL): State => {
  return batchShuffleWithSupply(total);
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "update":
      return state.map((entity, index) => {
        if (index === action.payload.index) {
          return {
            ...entity,
            ...action.payload.entity,
          };
        }
        return entity;
      });
    case "shuffle":
      return generateState(action.payload.total);
    default:
      return state;
  }
};

const useBatch = (total: number = DEFAULT_TOTAL) => {
  const initialState = generateState(total);
  const [entities, dispatch] = useReducer(reducer, initialState);

  return {
    entities,
    updateEntity: (index: number, entity: Attributes) => {
      dispatch({
        type: "update",
        payload: {
          index,
          entity,
        },
      });
    },
    shuffleEntities: (total: number = DEFAULT_TOTAL) => {
      dispatch({
        type: "shuffle",
        payload: {
          total,
        },
      });
    },
  };
};

export default useBatch;
