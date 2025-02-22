import { Canvas, CanvasEvent, Circle, Group, Text } from '@antv/g';
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

/**
 * ported from https://github.com/wellyshen/use-web-animations/tree/master/src/animations
 */
const transformOrigin = 'center bottom';
const effects = [
  () => ({
    name: 'backInDown',
    keyframes: [
      { transform: 'translateY(-1200px) scale(0.7)', opacity: 0.7, offset: 0 },
      { transform: 'translateY(0px) scale(0.7)', opacity: 0.7, offset: 0.8 },
      { transform: 'translateY(0px)', opacity: 1, offset: 1 },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'fadeIn',
    keyframes: [{ opacity: 0 }, { opacity: 1 }],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'fadeInBottomLeft',
    keyframes: [
      { transform: 'translate3d(-100%, 100%, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'fadeInBottomRight',
    keyframes: [
      { transform: 'translate3d(100%, 100%, 0)', opacity: 0 },
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'fadeOutTopRight',
    keyframes: [
      { transform: 'translate3d(0, 0, 0)', opacity: 1 },
      { transform: 'translate3d(100%, -100%, 0)', opacity: 0 },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => {
    const easing1 = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    const easing2 = 'cubic-bezier(0.755, 0.05, 0.855, 0.06)';
    const frame1 = {
      transform: 'translate3d(0, 0, 0) scaleY(1)',
      easing: easing1,
      transformOrigin,
    };
    const frame2 = {
      transform: 'translate3d(0, -30px, 0) scaleY(1.1)',
      easing: easing2,
      transformOrigin,
    };
    return {
      name: 'bounce',
      keyframes: [
        { ...frame1, offset: 0 },
        { ...frame1, offset: 0.2 },
        { ...frame2, offset: 0.4 },
        { ...frame2, offset: 0.43 },
        { ...frame1, offset: 0.53 },
        {
          transform: 'translate3d(0, -15px, 0) scaleY(1.05)',
          easing: easing2,
          transformOrigin,
          offset: 0.7,
        },
        {
          transform: 'translate3d(0, 0, 0) scaleY(0.95)',
          easing: easing1,
          transformOrigin,
          offset: 0.8,
        },
        {
          transform: 'translate3d(0, -4px, 0) scaleY(1.02)',
          transformOrigin,
          offset: 0.9,
        },
        { ...frame1, offset: 1 },
      ],
      animationOptions: { duration: 1000, fill: 'both' },
    };
  },
  () => {
    const easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)';
    return {
      name: 'bounceIn',
      keyframes: [
        { transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0, easing, offset: 0 },
        { transform: 'scale3d(1.1, 1.1, 1.1)', easing, offset: 0.2 },
        { transform: 'scale3d(0.9, 0.9, 0.9)', easing, offset: 0.4 },
        {
          transform: 'scale3d(1.03, 1.03, 1.03)',
          opacity: 1,
          easing,
          offset: 0.6,
        },
        { transform: 'scale3d(0.97, 0.97, 0.97)', easing, offset: 0.8 },
        { transform: 'scale3d(1, 1, 1)', opacity: 1, easing, offset: 1 },
      ],
      animationOptions: { duration: 750, fill: 'both' },
    };
  },
  () => {
    const frame = { transform: 'scale3d(1.1, 1.1, 1.1)', opacity: 1 };
    return {
      name: 'bounceOut',
      keyframes: [
        { transform: 'none', opacity: 1, offset: 0 },
        { transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.2 },
        { ...frame, offset: 0.5 },
        { ...frame, offset: 0.55 },
        { transform: 'scale3d(0.3, 0.3, 0.3)', opacity: 0, offset: 1 },
      ],
      animationOptions: { duration: 750, fill: 'both' },
    };
  },
  () => {
    const frame1 = { opacity: 1 };
    const frame2 = { opacity: 0 };
    return {
      name: 'flash',
      keyframes: [
        { ...frame1, offset: 0 },
        { ...frame2, offset: 0.25 },
        { ...frame1, offset: 0.5 },
        { ...frame2, offset: 0.75 },
        { ...frame1, offset: 1 },
      ],
      animationOptions: { duration: 1000, fill: 'both' },
    };
  },
  () => ({
    name: 'headShake',
    keyframes: [
      { transform: 'translateX(0)', offset: 0 },
      { transform: 'translateX(-6px) rotateY(-9deg)', offset: 0.065 },
      { transform: 'translateX(5px) rotateY(7deg)', offset: 0.185 },
      { transform: 'translateX(-3px) rotateY(-5deg)', offset: 0.315 },
      { transform: 'translateX(2px) rotateY(3deg)', offset: 0.435 },
      { transform: 'translateX(0)', offset: 0.5 },
      { transform: 'none', offset: 1 },
    ],
    animationOptions: { duration: 1000, fill: 'both', easing: 'ease-in-out' },
  }),
  () => {
    const frame1 = { transform: 'scale(1)' };
    const frame2 = { transform: 'scale(1.3)' };
    return {
      name: 'heartBeat',
      keyframes: [
        { ...frame1, offset: 0 },
        { ...frame2, offset: 0.14 },
        { ...frame1, offset: 0.28 },
        { ...frame2, offset: 0.42 },
        { ...frame1, offset: 0.7 },
        { transform: 'none', offset: 1 },
      ],
      animationOptions: { duration: 1300, fill: 'both', easing: 'ease-in-out' },
    };
  },
  () => ({
    name: 'swing',
    keyframes: [
      { transform: 'rotateZ(0deg)', transformOrigin, offset: 0 },
      { transform: 'rotateZ(15deg)', transformOrigin, offset: 0.2 },
      { transform: 'rotateZ(-10deg)', transformOrigin, offset: 0.4 },
      { transform: 'rotateZ(5deg)', transformOrigin, offset: 0.6 },
      { transform: 'rotateZ(-5deg)', transformOrigin, offset: 0.8 },
      { transform: 'rotateZ(0deg)', transformOrigin, offset: 1 },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'skewX',
    keyframes: [
      { transform: 'skewX(0deg)', transformOrigin, offset: 0 },
      { transform: 'skewX(30deg)', transformOrigin, offset: 0.25 },
      { transform: 'skewX(-30deg)', transformOrigin, offset: 0.75 },
      { transform: 'skewX(0deg)', transformOrigin, offset: 1 },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'skewY',
    keyframes: [
      { transform: 'skewY(0deg)', transformOrigin, offset: 0 },
      { transform: 'skewY(30deg)', transformOrigin, offset: 0.25 },
      { transform: 'skewY(-30deg)', transformOrigin, offset: 0.75 },
      { transform: 'skewY(0deg)', transformOrigin, offset: 1 },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'flipX',
    keyframes: [
      { transform: 'scaleX(1)', transformOrigin },
      { transform: 'scaleX(-1)', transformOrigin },
      { transform: 'scaleX(1)', transformOrigin },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'flipY',
    keyframes: [
      { transform: 'scaleY(1)', transformOrigin: 'center' },
      { transform: 'scaleY(-1)', transformOrigin: 'center' },
      { transform: 'scaleY(1)', transformOrigin: 'center' },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
  () => ({
    name: 'matrix interpolation',
    keyframes: [
      { transform: 'skewY(30deg)', transformOrigin: 'center' },
      { transform: 'matrix(0.2,0,0,0.2,-50,0)', transformOrigin: 'center' },
    ],
    animationOptions: { duration: 1000, fill: 'both' },
  }),
];

canvas.addEventListener(CanvasEvent.READY, () => {
  effects.forEach((f, i) => {
    const { name, keyframes, animationOptions } = f();
    const row = Math.floor(i / 4);
    const group = new Group();
    const circle = new Circle({
      style: {
        r: 50,
        fill: '#1890FF',
        stroke: '#F04864',
        lineWidth: 4,
      },
    });
    const text = new Text({
      style: {
        text: name,
        fontSize: 10,
        fill: '#000',
        textAlign: 'center',
        textBaseline: 'middle',
      },
    });
    circle.appendChild(text);
    group.appendChild(circle);
    canvas.appendChild(group);

    group.setPosition(50 + 150 * (i % 4), 50 + 120 * row);

    circle.animate(keyframes, {
      ...animationOptions,
      iterations: Infinity,
    });
  });
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
