/**
 * Custom types
 * 
 * CSS colour types based on an answer to
 * https://stackoverflow.com/questions/42584228/how-can-i-define-a-type-for-a-css-color-in-typescript
 */

export type RGB = `rgb(${number}, ${number}, ${number})`;
export type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
export type HEX = `#${string}`;
export type Color = RGB | RGBA | HEX;