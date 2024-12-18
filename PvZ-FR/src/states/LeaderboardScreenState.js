import State from "../../lib/State.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, images, input, sounds, stateMachine, stateStack, timer } from "../globals.js";
import { roundedRectangle } from '../../lib/Drawing.js';
import Input from "../../lib/Input.js";
import SoundName from "../enums/SoundName.js";
import StateName from "../enums/StateName.js";
import Images from "../../lib/Images.js";
import ImageName from "../enums/ImageName.js";
import Fonts from "../../lib/Fonts.js";
import PlayState from "./PlayState.js";
import HighScoreManager from "../services/HighScoreManager.js";
import Vector from "../../lib/Vector.js";
import CloseButton from "../user-interface/elements/CloseButton.js";
import ButtonType from "../enums/ButtonType.js";

export default class LeaderboardScreenState extends State {
    constructor() {
        super();

        this.highScores = HighScoreManager.loadHighScores()

        this.currentMenuOption = 0;

        this.transitionAlpha = 0;

        this.inTransition = false;

        this.exitButton = new CloseButton(CANVAS_WIDTH - 27, 3, ButtonType.Close, this, () => {
            stateStack.pop()
            stateStack.top().enter()
        })
    }

    enter() {
        this.highScores = HighScoreManager.loadHighScores()
        sounds.play(SoundName.TitleScreen)
        this.transitionAlpha = 0;
        this.inTransition = false;
    }

    exit() {

    }

    update(dt) {
        this.exitButton.update(dt)
    }

    render() {
        // @ts-ignore
        images.render(ImageName.LeaderboardBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this.displayNames();

        this.exitButton.render()
    }

    displayNames() {
        let startingPos = new Vector(CANVAS_WIDTH / 3 - 5, CANVAS_HEIGHT / 3)

        for (let i = 0; i < this.highScores.length; i++) {
            this.drawMenuOption(this.highScores[i].name + " - WAVE " + this.highScores[i].wave, startingPos.x, startingPos.y);
            startingPos.y += 20
        }
    }

    drawMenuOption(text, x, y) {

        context.save();
        context.font = '20px SamDanEvil';

        context.fillText(text, x, y);
        context.restore();
    }
}
