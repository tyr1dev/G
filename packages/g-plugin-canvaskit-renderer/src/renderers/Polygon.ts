import type {
  CanvasContext,
  ParsedPolygonStyleProps,
  ContextService,
  DisplayObject,
} from '@antv/g-lite';
import { isDisplayObject } from '@antv/g-lite';
import type {
  CanvasKitContext,
  RendererContribution,
  RendererContributionContext,
} from '../interfaces';

/**
 * @see https://fiddle.skia.org/c/@Path_addPoly
 */
export class PolygonRenderer implements RendererContribution {
  constructor(private context: CanvasContext) {}

  render(object: DisplayObject, context: RendererContributionContext) {
    const { CanvasKit } = (
      this.context.contextService as ContextService<CanvasKitContext>
    ).getContext();
    const {
      canvas,
      fillPaint,
      strokePaint,
      shadowFillPaint,
      shadowStrokePaint,
    } = context;

    const {
      shadowOffsetX,
      shadowOffsetY,
      points: { points },
      defX,
      defY,
      markerStart,
      markerEnd,
      markerStartOffset,
      markerEndOffset,
    } = object.parsedStyle as ParsedPolygonStyleProps;

    const length = points.length;
    let startOffsetX = 0;
    let startOffsetY = 0;
    let endOffsetX = 0;
    let endOffsetY = 0;

    let rad = 0;
    let x: number;
    let y: number;

    if (markerStart && isDisplayObject(markerStart) && markerStartOffset) {
      x = points[1][0] - points[0][0];
      y = points[1][1] - points[0][1];
      rad = Math.atan2(y, x);
      startOffsetX = Math.cos(rad) * (markerStartOffset || 0);
      startOffsetY = Math.sin(rad) * (markerStartOffset || 0);
    }

    if (markerEnd && isDisplayObject(markerEnd) && markerEndOffset) {
      x = points[length - 2][0] - points[length - 1][0];
      y = points[length - 2][1] - points[length - 1][1];
      rad = Math.atan2(y, x);
      endOffsetX = Math.cos(rad) * (markerEndOffset || 0);
      endOffsetY = Math.sin(rad) * (markerEndOffset || 0);
    }

    const formattedPoints = points
      .map(([x, y], i) => {
        let offsetX = 0;
        let offsetY = 0;
        if (i === 0) {
          offsetX = startOffsetX;
          offsetY = startOffsetY;
        } else if (i === length - 1) {
          offsetX = endOffsetX;
          offsetY = endOffsetY;
        }
        return [x - defX + offsetX, y - defY + offsetY];
      })
      .reduce<number[]>((prev, cur) => prev.concat(cur), []);

    if (shadowFillPaint || shadowStrokePaint) {
      const path = new CanvasKit.Path();
      path.addPoly(
        formattedPoints.map(
          (x, i) =>
            x +
            (i % 2 === 0 ? (shadowOffsetX || 0) / 2 : (shadowOffsetY || 0) / 2),
        ),
        true,
      );
      canvas.drawPath(path, fillPaint ? shadowFillPaint : shadowStrokePaint);
    }

    const path = new CanvasKit.Path();
    path.addPoly(formattedPoints, true);

    if (fillPaint) {
      canvas.drawPath(path, fillPaint);
    }
    if (strokePaint) {
      canvas.drawPath(path, strokePaint);
    }
  }
}
