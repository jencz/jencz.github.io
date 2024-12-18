import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, musicPlayer } from "../globals.js";
import { timer } from "../globals.js";
import { input } from "../globals.js";
import Input from "../../lib/Input.js";
import TitleScreenState from "./TitleScreenState.js";
import { sounds } from "../globals.js";
import { stateStack } from "../globals.js";
import PlayState from "./PlayState.js";
import HighScoreManager from "../services/HighScoreManager.js";
import Easing from "../../lib/Easing.js";
import SoundName from "../enums/SoundName.js";

export default class GameOverState extends State {
	constructor(username, wave) {
		super();

		this.menuOptions = ["PLAY", "AGAIN", "MAIN", "MENU"]

		this.currentMenuOption = 0;

		this.transitionAlpha = 0;

		this.inTransition = false;

		HighScoreManager.addHighScore(username, wave)
	}

	enter() {
		this.transitionAlpha = 0;
		this.inTransition = false;
	}

	update(dt) {
		timer.update(dt);

		if (this.inTransition) {
			return;
		}

		if (
			input.isKeyPressed(Input.KEYS.A) ||
			input.isKeyPressed(Input.KEYS.D)
		) {
			sounds.play(SoundName.BlipSelect);
			this.currentMenuOption = this.currentMenuOption === 0 ? 1 : 0;
		}

		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			this.startTransition();
		}
	}

	render() {
		this.renderDarkOverlay()
		this.buildMenu()
		this.drawTransitionOverlay()
	}

	async startTransition() {
		//sounds.stop(SoundName.TitleScreen)
		if (this.currentMenuOption === 0) {

			
			await timer.tween(this, { transitionAlpha: 1 }, 2, Easing.linear, ()=> {
				musicPlayer.SwitchSongDay();
			});
			stateStack.pop()
			stateStack.pop()
			stateStack.push(new PlayState());
			stateStack.top().enter()
		} else {
			await timer.tweenAsync(this, { transitionAlpha: 1 }, 2);
			stateStack.pop()
			stateStack.pop()
			stateStack.top().enter()
		}

		this.inTransition = true;
	}

	drawTransitionOverlay() {
		context.fillStyle = `rgb(255, 255, 255, ${this.transitionAlpha})`;
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	drawTitleText() {
		context.save();
		context.fillStyle = 'red'
		context.font = `25px SamDanEvil`;
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText("GAME OVER!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 6)
		context.restore();
	}

	buildMenu() {
		this.drawTitleText()

		const positions = [
			{ x: CANVAS_WIDTH / 5 + 5, y: CANVAS_HEIGHT / 3 }, // Position for "PLAY"
			{ x: CANVAS_WIDTH / 5, y: CANVAS_HEIGHT / 2 - 10 }, // Position for "AGAIN"
			{ x: CANVAS_WIDTH - 125, y: CANVAS_HEIGHT / 3 }, // Position for "MAIN"
			{ x: CANVAS_WIDTH - 125, y: CANVAS_HEIGHT / 2 - 10 }, // Position for "MENU"
		];

		this.drawOptions(this.menuOptions[0], positions[0].x, positions[0].y, 0);
		this.drawOptions(this.menuOptions[1], positions[1].x, positions[1].y, 0);
		this.drawOptions(this.menuOptions[2], positions[2].x, positions[2].y, 1);
		this.drawOptions(this.menuOptions[3], positions[3].x, positions[3].y, 1);
	}

	drawOptions(text, x, y, index) {
		context.save();
		context.font = '25px SamDanEvil';

		if (this.currentMenuOption === index) {		
			context.fillStyle = 'rgb(255, 255, 255)';
		} else {
			context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		}

		context.fillText(text, x, y);
		context.restore();
	}

	renderDarkOverlay() {
		context.save()
		context.fillStyle = 'rgb(0, 0, 0, 0.80)';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.restore()
	}
}
