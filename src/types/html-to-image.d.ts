declare module 'html-to-image' {
  export function toPng(element: HTMLElement, options?: any): Promise<string>;
  export function toJpeg(element: HTMLElement, options?: any): Promise<string>;
  export function toSvg(element: HTMLElement, options?: any): Promise<string>;
} 