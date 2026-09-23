import { walnutPixels } from './walnut-grain';

/**
 * Generates the desk's walnut maps off the main thread.
 *
 * On the main thread this was a single ~80ms task at scene mount (several
 * times that on a throttled phone), landing right when the page is trying to
 * become interactive.
 */

interface Scope {
  onmessage: ((e: MessageEvent<{ width: number; height: number }>) => void) | null;
  postMessage(message: unknown, transfer: Transferable[]): void;
}
const scope = self as unknown as Scope;

scope.onmessage = (e) => {
  const pixels = walnutPixels(e.data.width, e.data.height);
  // Transfer, don't copy: the buffers are 2MB each.
  scope.postMessage(pixels, [pixels.color.buffer, pixels.roughness.buffer]);
};
