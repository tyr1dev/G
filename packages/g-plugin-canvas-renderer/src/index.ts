import { RendererPlugin, SHAPE, world, globalContainer } from '@antv/g';
import { Module, Syringe } from 'mana-syringe';
import RBush from 'rbush';
import { DefaultRenderer, StyleRenderer, StyleRendererFactory } from './shapes/styles';
import { ImageRenderer } from './shapes/styles/Image';
import { GradientPool } from './shapes/GradientPool';
import { ImagePool } from './shapes/ImagePool';
import {
  PathGeneratorFactory,
  PathGenerator,
  CirclePath,
  EllipsePath,
  RectPath,
  LinePath,
  PolylinePath,
  PolygonPath,
  PathPath,
} from './shapes/paths';
import { TextRenderer } from './shapes/styles/Text';
import { CanvasRendererPlugin, RBushRoot } from './CanvasRendererPlugin';
import { LoadImagePlugin } from './LoadImagePlugin';
import { RBushNode } from './components/RBushNode';
import type { RBushNodeAABB } from './components/RBushNode';

export {
  PathGeneratorFactory,
  PathGenerator,
  StyleRenderer,
  RBushNode,
  RBushNodeAABB,
  RBushRoot,
  RBush,
};

world.registerComponent(RBushNode);

/**
 * register shape renderers
 */
globalContainer.register({
  token: { token: PathGenerator, named: SHAPE.Circle },
  useValue: CirclePath,
});
globalContainer.register({
  token: { token: PathGenerator, named: SHAPE.Ellipse },
  useValue: EllipsePath,
});
globalContainer.register({
  token: { token: PathGenerator, named: SHAPE.Rect },
  useValue: RectPath,
});
globalContainer.register({
  token: { token: PathGenerator, named: SHAPE.Line },
  useValue: LinePath,
});
globalContainer.register({
  token: { token: PathGenerator, named: SHAPE.Polyline },
  useValue: PolylinePath,
});
globalContainer.register({
  token: { token: PathGenerator, named: SHAPE.Polygon },
  useValue: PolygonPath,
});
globalContainer.register({
  token: { token: PathGenerator, named: SHAPE.Path },
  useValue: PathPath,
});

globalContainer.register({
  token: PathGeneratorFactory,
  useFactory: (ctx) => {
    return (tagName: SHAPE) => {
      if (ctx.container.isBoundNamed(PathGenerator, tagName)) {
        return ctx.container.getNamed(PathGenerator, tagName);
      }

      return null;
    };
  },
});

const containerModule = Module((register) => {
  register(ImagePool);
  register({ token: RBushRoot, useValue: new RBush<RBushNodeAABB>() });

  register(DefaultRenderer);
  register(ImageRenderer);
  register(TextRenderer);
  register({
    token: StyleRendererFactory,
    useFactory: (ctx) => (tagName: SHAPE) => {
      if (ctx.container.isBoundNamed(StyleRenderer, tagName)) {
        return ctx.container.getNamed(StyleRenderer, tagName);
      }

      return null;
    },
  });

  register(GradientPool);

  register(CanvasRendererPlugin);
  register(LoadImagePlugin);
});

export class Plugin implements RendererPlugin {
  init(container: Syringe.Container): void {
    container.load(containerModule);
  }
  destroy(container: Syringe.Container): void {
    // @ts-ignore
    // container.container.unload(containerModule);
    // // container.unload(containerModule);
    // container.remove(ImagePool);
    // container.remove(RBushRoot);
    // container.remove(DefaultRenderer);
    // container.remove(ImageRenderer);
    // container.remove(TextRenderer);
    // container.remove(StyleRendererFactory);
    // container.remove(GradientPool);
    // container.remove(CanvasRendererPlugin);
    // container.remove(LoadImagePlugin);
  }
}
