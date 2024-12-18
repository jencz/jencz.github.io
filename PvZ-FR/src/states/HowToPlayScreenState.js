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

export default class HowToPlayScreenState extends State {
    constructor() {
        super();

        this.exitButton = new CloseButton(CANVAS_WIDTH - 27, 3, ButtonType.Close, this, () => {
            stateStack.pop()
            stateStack.top().enter()
        })
    }

    enter() {

    }

    exit() {

    }

    update(dt) {
        this.exitButton.update(dt)
    }

    render() {
        // @ts-ignore
        images.render(ImageName.HowToPlayBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        this.displayInstructions();

        this.exitButton.render()
    }

    displayInstructions() {
        context.save();
        context.fillStyle = 'rgb(0,0,0)';
        context.font = '20px SamDanEvil';

        context.fillText("W,A,S,D for movement.", 40, 40);
        context.fillText("Mouse controls for UI.", 40, 70);
        context.fillText("Gold Peashooter drops more coins.", 40, 100);
        context.fillText("Snow Peashooter freezes enemies for 2 secs.", 45, 130);
        context.fillText("Split Peashooter shoots both directions.", 50, 160);
        context.fillText("Gatling Peashooter is fully automatic.", 60, 190);
        context.restore();
    }
}
