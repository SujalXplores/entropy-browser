import type Matter from "matter-js";

export interface LetterBody extends Matter.Body {
  letter: string;
  createdAt: number;
  opacity: number;
  fontSize: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface MousePosition {
  x: number;
  y: number;
}
