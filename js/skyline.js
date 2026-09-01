import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const NAVY = 0x071227;
const WARM = [0xc9a36a, 0xd6b67b, 0xe0c38b, 0xc4a06a];
const COOL = [0x7696bd, 0x8ca8ca, 0x6e8eb3];
const FACADES = [0x09152a, 0x0b1830, 0x101c34, 0x0c1730, 0x081428, 0x0e1b36, 0x0a152c];

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260901);
const randRange = (a, b) => a + rand() * (b - a);
const pick = (arr) => arr[(rand() * arr.length) | 0];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

const canvas = document.getElementById('skyline-canvas');
const footer = document.getElementById('site-footer');
const stage = document.getElementById('skyline-stage');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.setClearColor(NAVY, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(NAVY);
scene.fog = new THREE.FogExp2(NAVY, 0.013);

const camera = new THREE.PerspectiveCamera(26, 2, 0.1, 120);
const camHome = new THREE.Vector3(0, 6.35, 29.5);
camera.position.copy(camHome);
const lookTarget = new THREE.Vector3(0.4, 2.55, -3.2);
camera.lookAt(lookTarget);

const city = new THREE.Group();
scene.add(city);
