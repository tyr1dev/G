import type { ParsedCircleStyleProps } from '@antv/g-lite';

export function generatePath(
  context: CanvasRenderingContext2D,
  parsedStyle: ParsedCircleStyleProps,
) {
  const { r } = parsedStyle;
  context.arc(r, r, r, 0, Math.PI * 2, false);
}
