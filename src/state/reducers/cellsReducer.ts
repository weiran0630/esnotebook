import produce from "immer";

import { ActionType } from "../actionTypes";
import { Action } from "../actions";
import { Cell } from "../cellProps";

interface CellsState {
  loading: boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell;
  };
}

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};
/**
 * * function generate random id for cells
 */
const randomId = () => {
  return Math.random().toString(36).substring(2, 5);
};

/** using immer lib to work with immutable state in a more convenient way*/
const cellsReducer = produce(
  (state: CellsState = initialState, action: Action): CellsState => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        state.data[action.payload.id].content = action.payload.content;
        return state;

      case ActionType.DELETE_CELL:
        delete state.data[action.payload.id];
        state.order = state.order.filter((id) => id !== action.payload.id);
        return state;

      case ActionType.INSERT_CELL_AFTER:
        /** create new cell */
        const cell: Cell = {
          content: "",
          type: action.payload.cellType,
          id: randomId(),
        };
        state.data[cell.id] = cell;
        /** push new cell to the start of array if couldn't find action.payload.id */
        const foundIndex = state.order.findIndex(
          (id) => id === action.payload.id
        );
        if (foundIndex < 0) {
          state.order.unshift(cell.id);
        } else state.order.splice(foundIndex + 1, 0, cell.id); // otherwise insert after index
        return state;

      case ActionType.MOVE_CELL:
        const { direction } = action.payload;
        /** Returns the index of the first element in the array where predicate is true */
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          /** boundary check */
          return state;
        }
        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        return state;

      default:
        return state;
    }
  },
  initialState
);

export default cellsReducer;
