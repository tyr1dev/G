import { Canvas, CanvasEvent, Circle } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Renderer as CanvaskitRenderer } from '@antv/g-canvaskit';
import { Renderer as SVGRenderer } from '@antv/g-svg';
import { Renderer as WebGLRenderer } from '@antv/g-webgl';
import { Renderer as WebGPURenderer } from '@antv/g-webgpu';
import * as lil from 'lil-gui';
import Stats from 'stats.js';

// create a renderer
const canvasRenderer = new CanvasRenderer();
const webglRenderer = new WebGLRenderer();
const svgRenderer = new SVGRenderer();
const canvaskitRenderer = new CanvaskitRenderer({
  wasmDir: '/',
  fonts: [
    {
      name: 'sans-serif',
      url: 'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/file/A*064aSK2LUPEAAAAAAAAAAAAADmJ7AQ/NotoSansCJKsc-VF.ttf',
    },
  ],
});
const webgpuRenderer = new WebGPURenderer();

// create a canvas
const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 500,
  renderer: canvasRenderer,
});

const circle = new Circle({
  style: {
    cx: 200,
    cy: 200,
    r: 60,
    fill: '#1890FF',
    stroke: '#F04864',
    lineWidth: 4,
    shadowColor: 'black',
    shadowBlur: 30,
  },
});

canvas.addEventListener(CanvasEvent.READY, () => {
  canvas.appendChild(circle);

  (async () => {
    const moveRight = circle.animate(
      [
        {
          transform: 'translate(0)',
        },
        {
          transform: 'translate(100px)',
        },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        fill: 'both',
      },
    );
    await moveRight.finished;

    const moveDown = circle.animate(
      [
        {
          transform: 'translate(100px)',
        },
        {
          transform: 'translate(100px, 100px)',
        },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        fill: 'both',
      },
    );
    await moveDown.finished;

    const moveLeft = circle.animate(
      [
        {
          transform: 'translate(100px, 100px)',
        },
        {
          transform: 'translate(0, 100px)',
        },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        fill: 'both',
      },
    );
    await moveLeft.finished;

    const moveUp = circle.animate(
      [
        {
          transform: 'translate(0, 100px)',
        },
        {
          transform: 'translate(0, 0)',
        },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)',
        fill: 'both',
      },
    );
    await moveUp.finished;
  })();
});

// stats
const stats = new Stats();
stats.showPanel(0);
const $stats = stats.dom;
$stats.style.position = 'absolute';
$stats.style.left = '0px';
$stats.style.top = '0px';
const $wrapper = document.getElementById('container');
$wrapper.appendChild($stats);
canvas.addEventListener(CanvasEvent.AFTER_RENDER, () => {
  if (stats) {
    stats.update();
  }
});

// GUI
const gui = new lil.GUI({ autoPlace: false });
$wrapper.appendChild(gui.domElement);
const rendererFolder = gui.addFolder('renderer');
const rendererConfig = {
  renderer: 'canvas',
};
rendererFolder
  .add(rendererConfig, 'renderer', [
    'canvas',
    'svg',
    'webgl',
    'webgpu',
    'canvaskit',
  ])
  .onChange((rendererName) => {
    let renderer;
    if (rendererName === 'canvas') {
      renderer = canvasRenderer;
    } else if (rendererName === 'svg') {
      renderer = svgRenderer;
    } else if (rendererName === 'webgl') {
      renderer = webglRenderer;
    } else if (rendererName === 'webgpu') {
      renderer = webgpuRenderer;
    } else if (rendererName === 'canvaskit') {
      renderer = canvaskitRenderer;
    }
    canvas.setRenderer(renderer);
  });
rendererFolder.open();
