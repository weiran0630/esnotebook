export type CellTypes = "code" | "markdown";
export type CellMoveDirection = "up" | "down";

export interface Cell {
  id: string;
  type: CellTypes;
  content: string;
}
