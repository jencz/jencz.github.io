import State from "../../lib/State.js";
import { CANVAS_WIDTH } from "../globals.js";
import { CANVAS_HEIGHT } from "../globals.js";
import { context } from "../globals.js";
import { stateStack } from "../globals.js";
import TitleScreenState from "./TitleScreenState.js";
import { images } from "../globals.js";
import ImageName from "../enums/ImageName.js";

export default class EnterUsernameState extends State {
    constructor() {
        super();

        this.inputBox = document.createElement('input');
        this.inputBox.type = 'text';
        this.inputBox.style.position = 'absolute';
        this.inputBox.style.width = '12em';
        this.inputBox.style.height = '2em';
        this.inputBox.style.left = '50%';
        this.inputBox.style.top = '45%';
        this.inputBox.style.transform = 'translate(-50%, -50%)'
        this.inputBox.style.fontSize = '3em';
        this.inputBox.style.padding = '8px';

        document.body.appendChild(this.inputBox)

        this.handleInput = this.handleInput.bind(this)
        this.inputBox.addEventListener('keydown', this.handleInput)
    }

    enter() {
        this.inputBox.style.display = 'block'
        this.inputBox.focus()
    }

    exit() {
        this.inputBox.style.display = 'none';
        this.inputBox.removeEventListener('keydown', this.handleInput)
        document.body.removeChild(this.inputBox)
    }

    handleInput(event) {
        if (event.key === 'Enter') {
            const username = this.inputBox.value.trim()
            if (username) {

                stateStack.pop()
                stateStack.push(new TitleScreenState(username))
            }
        }
    }

    render() {
        images.render(ImageName.TitleScreenBg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        images.render(ImageName.EnterUsername, CANVAS_WIDTH / 6, 0, 257, 193)
        context.font = '20px SamDanEvil';
        context.fillStyle = 'white';
        context.fillText('Enter your username:', CANVAS_WIDTH / 3 - 10, CANVAS_HEIGHT / 3 + 10);
    }
}
