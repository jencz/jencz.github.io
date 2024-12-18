import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, musicPlayer } from "../globals.js";
import { timer } from "../globals.js";
import { input } from "../globals.js";
import Input from "../../lib/Input.js";
import TitleScreenState from "./TitleScreenState.js";
import { sounds } from "../globals.js";
import { stateStack } from "../globals.js";
import PlayState from "./PlayState.js";
import SoundName from "../enums/SoundName.js";

export default class PauseState extends State {
    constructor() {
        super();

        this.menuOptions = ["RESUME", "MAIN MENU"]

        this.currentMenuOption = 0;

        this.transitionAlpha = 0;

        this.inTransition = false;
    }

    enter() {
        this.transitionAlpha = 0;
        this.inTransition = false;
        musicPlayer.pause();
    }

    update(dt) {
        timer.update(dt);

        if (this.inTransition) {
            return;
        }

        if (
            input.isKeyPressed(Input.KEYS.W) ||
            input.isKeyPressed(Input.KEYS.S) ||
            input.isKeyPressed(Input.KEYS.ARROW_UP) ||
            input.isKeyPressed(Input.KEYS.ARROW_DOWN)
        ) {
            sounds.play(SoundName.BlipSelect)
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
        if (this.currentMenuOption === 0) {

            // resume
            stateStack.pop(); 
            stateStack.top().enter()
            musicPlayer.unpause()
        } else {
            // main menu
            await timer.tweenAsync(this, { transitionAlpha: 1 }, 2);
            stateStack.pop(); 
            stateStack.pop(); 
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
        context.fillText("GAME PAUSED", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 5)
        context.restore();
    }

    buildMenu() {
        this.drawTitleText()

        const positions = [
            { x: CANVAS_WIDTH / 2 - 35, y: CANVAS_HEIGHT / 2.5 }, // Position for "RESUME"
            { x: CANVAS_WIDTH / 2 - 50, y: CANVAS_HEIGHT / 1.8 }, // Position for "MAIN MENU"
        ];

        this.drawOptions(this.menuOptions[0], positions[0].x, positions[0].y, 0);
        this.drawOptions(this.menuOptions[1], positions[1].x, positions[1].y, 1);
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
        context.fillStyle = 'rgb(0, 0, 0, 0.60)';
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        context.restore()
    }
}
