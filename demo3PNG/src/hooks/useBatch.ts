import React, { useReducer } from "react";
import configs from "../configs";
import { Attributes } from "../types";
import { shuffle } from "../utils";

const BATCH_NUMBER = 50;

type Action = NextBatchAction | SelectedAction;

type NextBatchAction = {
  type: "onNextBatch";
};

type SelectedAction = {
  type: "onSelected";
  payload: number;
};

type BatchState = {
  entities: Array<Attributes>;
  selected: Array<Boolean>;
};

const generateNewBatch = (): BatchState => {
  const entities = new Array(BATCH_NUMBER).fill(0).map(() => {
    return shuffle();
  });
  const selected = new Array(BATCH_NUMBER).fill(true);

  return {
    entities,
    selected,
  };
};

const initialState: BatchState = generateNewBatch();

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case "onSelected":
      const newSelected = state.selected.slice(0);
      newSelected[action.payload] = !newSelected[action.payload];
      return { ...state, selected: newSelected };
    case "onNextBatch":
      return generateNewBatch();
    default:
      return state;
  }
};

const useBatch = () => {
  const [batchState, dispatch] = useReducer(reducer, initialState);
  const { entities, selected } = batchState;
  return {
    entities,
    selected,
    onNextBatch: () =>
      dispatch({
        type: "onNextBatch",
      }),
    onSelected: (payload: number) => {
      dispatch({
        type: "onSelected",
        payload,
      });
    },
  };
};

export default useBatch;
