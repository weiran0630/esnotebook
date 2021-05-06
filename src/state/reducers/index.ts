import { combineReducers } from "redux";
import cellsReducer from "./cellsReducer";
import bundleReducer from "./bundleReducer";

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundleReducer,
});

export default reducers;

// Infer the `RootState` types from the reducers itself
export type RootState = ReturnType<typeof reducers>;
