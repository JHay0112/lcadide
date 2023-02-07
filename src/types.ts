/**
 * Custom types
 * 
 * CSS colour types based on an answer to
 * https://stackoverflow.com/questions/42584228/how-can-i-define-a-type-for-a-css-color-in-typescript
 */

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

/**
 * Describes a CSS valid color
 */
export type Color = RGB | RGBA | HEX;

/**
 * Tuple describing a 2d cartesian position
 */
export type Position = [x: number, y: number];

/**
 * Enum describing the orientation of a component.
 */
export enum Orientation {
    VERTICAL = 0,
    HORIZONTAL = 1
}