import Fonts from '../lib/Fonts.js';
import Images from '../lib/Images.js';
import Sounds from '../lib/Sounds.js';
import StateMachine from '../lib/StateMachine.js';
import Timer from '../lib/Timer.js';
import Input from '../lib/Input.js';
import Debug from '../lib/Debug.js';
import StateStack from '../lib/StateStack.js';
import MusicPlayer from './services/MusicPlayer.js';

export const canvas = document.createElement('canvas');
export const context =
	canvas.getContext('2d') || new CanvasRenderingContext2D();

// Replace these values according to how big you want your canvas.
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 240;
export const MAX_HIGH_SCORES = 5;

const resizeCanvas = () => {
	const scaleX = window.innerWidth / CANVAS_WIDTH;
	const scaleY = window.innerHeight / CANVAS_HEIGHT;
	const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

	canvas.style.width = `${CANVAS_WIDTH * scale}px`;
	canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
};

// Listen for canvas resize events
window.addEventListener('resize', resizeCanvas);

resizeCanvas(); // Call once to scale initially

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateMachine = new StateMachine();
export const stateStack = new StateStack();
export const timer = new Timer();
export const input = new Input(canvas);
export const sounds = new Sounds();
export const debug = new Debug();
export const musicPlayer = new MusicPlayer(sounds);

export const MUSIC_ENABLED = true;

// If true, render all hitboxes.
export const DEBUG = false;