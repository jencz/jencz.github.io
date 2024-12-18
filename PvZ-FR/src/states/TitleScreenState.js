import State from "../../lib/State.js";
import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH, context, images, input, musicPlayer, sounds, stateMachine, stateStack, timer } from "../globals.js";
import { roundedRectangle } from '../../lib/Drawing.js';
import Input from "../../lib/Input.js";
import SoundName, { MusicName } from "../enums/SoundName.js";
import StateName from "../enums/StateName.js";
import Images from "../../lib/Images.js";
import ImageName from "../enums/ImageName.js";
import Fonts from "../../lib/Fonts.js";
import PlayState from "./PlayState.js";
import LeaderboardScreenState from "./LeaderboardScreenState.js";
import Easing from "../../lib/Easing.js";
import HowToPlayScreenState from "./HowToPlayScreenState.js";

export default class TitleScreenState extends State {
	constructor(username) {
		super();

		this.username = username

		this.menuOptions = ['Start', 'How To Play', 'Scores'];

		this.currentMenuOption = 0;

		this.transitionAlpha = 0;

		this.inTransition = false;
	}

	enter(parameters) {
		musicPlayer.SwitchSong(MusicName.Title)
		this.transitionAlpha = 0;
		this.inTransition = false;
		canvas.focus();
	}


	update(dt) {
		timer.update(dt);

		if (this.inTransition) {
			return;
		}

		if (input.isKeyPressed(Input.KEYS.W) || input.isKeyPressed(Input.KEYS.ARROW_UP)) {
			sounds.play(SoundName.BlipSelect);
			this.currentMenuOption = (this.currentMenuOption - 1 + this.menuOptions.length) % this.menuOptions.length;
		} else if (input.isKeyPressed(Input.KEYS.S ) || input.isKeyPressed(Input.KEYS.ARROW_DOWN)) {
			sounds.play(SoundName.BlipSelect);
			this.currentMenuOption = (this.currentMenuOption + 1) % this.menuOptions.length;
		}

		if (input.isKeyPressed(Input.KEYS.ENTER)) {
			this.startTransition();
		}
	}


	render() {
		// @ts-ignore
		images.render(ImageName.TitleScreenBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
		this.drawCredits()
		this.drawTitleText();
		this.drawMenu();
		this.drawTransitionOverlay();
	}

	async startTransition() {
		if (this.currentMenuOption === 0) {
			timer.tween(this, { transitionAlpha: 1 }, 2, Easing.linear, () => {
				musicPlayer.SwitchSongDay()
				stateStack.push(new PlayState(this.username));
			});
		} else if (this.currentMenuOption === 2) {
			await timer.tweenAsync(this, { transitionAlpha: 1 }, 2);

			stateStack.push(new LeaderboardScreenState());
		}
		else {
			await timer.tweenAsync(this, { transitionAlpha: 1 }, 2);
			stateStack.push(new HowToPlayScreenState())
		}

		this.inTransition = true;
	}

	drawCredits() {
		context.save();
		context.font = `12px SamDanEvil`;
		context.fillStyle = 'rgb(0,0,0)';
		context.textBaseline = 'middle';
		context.textAlign = 'center';

		context.fillText("Credits:", 27, 157)
		context.fillText("Noah Jencz", 30, 169)
		context.fillText("Sam Ritchie", 30, 181)
		context.restore();
	}

	drawDarkBackground() {
		context.fillStyle = 'rgb(0, 0, 0, 0.5)';
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	drawTransitionOverlay() {
		context.fillStyle = `rgb(255, 255, 255, ${this.transitionAlpha})`;
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	drawTitleText() {
		context.save();
		context.font = `40px SamDanEvil`;
		context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.transform(1, 0.1, 0.2, 1, 0, 0)
		this.drawTextShadow("{ PvZ-FR }", CANVAS_WIDTH / 2 + 75, CANVAS_HEIGHT / 2 - 80)
		context.fillText("{ PvZ-FR }", CANVAS_WIDTH / 2 + 75, CANVAS_HEIGHT / 2 - 80)
		context.restore();
	}

	drawMenu() {
		const positions = [
			{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 20 }, // Position for "Start"
			{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 60 }, // Position for "How to play"
			{ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 + 100 } // Position for "Scores"
		];

		this.drawMenuOption(this.menuOptions[0], positions[0].x + 10, positions[0].y - 5, 0);
		this.drawMenuOption(this.menuOptions[1], positions[1].x - 20, positions[1].y - 18, 1);
		this.drawMenuOption(this.menuOptions[2], positions[2].x - 10, positions[2].y - 31, 2);
	}

	drawMenuOption(text, x, y, index) {
		context.save();
		context.font = '20px SamDanEvil';

		context.transform(0.9, 0.15, 0.2, 1, 0, 0)
		this.drawTextShadow(text, x + 51, y - 66);
		if (this.currentMenuOption === index) {
			context.fillStyle = 'white';
		} else {
			context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		}

		context.fillText(text, x + 50, y - 65);
		context.restore();
	}

	drawTextShadow(text, x, y) {
		context.save();

		context.fillStyle = 'rgb(34, 32, 52, 1)';
		context.fillText(text, x + 2, y + 1);
		context.fillText(text, x + 1, y + 1);
		context.fillText(text, x + 0, y + 1);
		context.fillText(text, x + 1, y + 2);

		context.restore();
	}
}
