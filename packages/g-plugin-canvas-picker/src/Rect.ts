import type {
  DisplayObject,
  ParsedRectStyleProps,
  Point,
  RectStyleProps,
} from '@antv/g-lite';
import { GlobalRuntime } from '@antv/g-lite';
import { isFillOrStrokeAffected } from '@antv/g-lite';
import { clamp } from '@antv/util';
import { inArc, inBox, inLine, inRect } from './utils/math';

export function isPointInPath(
  displayObject: DisplayObject<RectStyleProps>,
  position: Point,
  isClipPath: boolean,
  isPointInPath: (
    runtime: GlobalRuntime,
    displayObject: DisplayObject<RectStyleProps>,
    position: Point,
  ) => boolean,
  runtime: GlobalRuntime,
): boolean {
  const {
    radius,
    fill,
    stroke,
    lineWidth,
    increasedLineWidthForHitTesting,
    width,
    height,
    pointerEvents,
  } = displayObject.parsedStyle as ParsedRectStyleProps;

  const [hasFill, hasStroke] = isFillOrStrokeAffected(
    pointerEvents,
    fill,
    stroke,
  );

  const hasRadius = radius && radius.some((r) => r !== 0);

  const lineWidthForHitTesting =
    (lineWidth || 0) + (increasedLineWidthForHitTesting || 0);

  // 无圆角时的策略
  if (!hasRadius) {
    const halfWidth = lineWidthForHitTesting / 2;
    // 同时填充和带有边框
    if ((hasFill && hasStroke) || isClipPath) {
      return inBox(
        0 - halfWidth,
        0 - halfWidth,
        width + halfWidth,
        height + halfWidth,
        position.x,
        position.y,
      );
    }
    // 仅填充
    if (hasFill) {
      return inBox(0, 0, width, height, position.x, position.y);
    }
    if (hasStroke) {
      return inRect(
        0,
        0,
        width,
        height,
        lineWidthForHitTesting,
        position.x,
        position.y,
      );
    }
  } else {
    let isHit = false;
    if (hasStroke || isClipPath) {
      isHit = inRectWithRadius(
        0,
        0,
        width,
        height,
        radius.map((r) =>
          clamp(r, 0, Math.min(Math.abs(width) / 2, Math.abs(height) / 2)),
        ) as [number, number, number, number],
        lineWidthForHitTesting,
        position.x,
        position.y,
      );
    }
    // 仅填充时带有圆角的矩形直接通过图形拾取
    // 以后可以改成纯数学的近似拾取，将圆弧切割成多边形
    if (!isHit && (hasFill || isClipPath)) {
      isHit = isPointInPath(runtime, displayObject, position);
    }
    return isHit;
  }

  return false;
}

function inRectWithRadius(
  minX: number,
  minY: number,
  width: number,
  height: number,
  radiusArray: [number, number, number, number],
  lineWidth: number,
  x: number,
  y: number,
) {
  const [tlr, trr, brr, blr] = radiusArray;
  return (
    inLine(minX + tlr, minY, minX + width - trr, minY, lineWidth, x, y) ||
    inLine(
      minX + width,
      minY + trr,
      minX + width,
      minY + height - brr,
      lineWidth,
      x,
      y,
    ) ||
    inLine(
      minX + width - brr,
      minY + height,
      minX + blr,
      minY + height,
      lineWidth,
      x,
      y,
    ) ||
    inLine(minX, minY + height - blr, minX, minY + tlr, lineWidth, x, y) ||
    inArc(
      minX + width - trr,
      minY + trr,
      trr,
      1.5 * Math.PI,
      2 * Math.PI,
      lineWidth,
      x,
      y,
    ) ||
    inArc(
      minX + width - brr,
      minY + height - brr,
      brr,
      0,
      0.5 * Math.PI,
      lineWidth,
      x,
      y,
    ) ||
    inArc(
      minX + blr,
      minY + height - blr,
      blr,
      0.5 * Math.PI,
      Math.PI,
      lineWidth,
      x,
      y,
    ) ||
    inArc(minX + tlr, minY + tlr, tlr, Math.PI, 1.5 * Math.PI, lineWidth, x, y)
  );
}
