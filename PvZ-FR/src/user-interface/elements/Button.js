import UserInterfaceElement from '../UserInterfaceElement.js';
import { roundedRectangle } from '../../../lib/Drawing.js';
import { context, sounds } from '../../globals.js';
import Color from '../../enums/Color.js';
import { input } from '../../globals.js';
import SoundName from '../../enums/SoundName.js';

export default class Button extends UserInterfaceElement {
    static BORDER_WIDTH = 5;

    
    
    /**
     * A UI element that is clickable.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {object} options
     */
    constructor(x, y, width, height, callback, displayText = "") {
        super(x, y, width, height);

        this.borderColour = Color.Blue;
        this.panelColour = Color.White;

        this.displayText = displayText;

        this.callback = callback;

        this.isEnabled = true;

        this.mouseIsHoveringOver = false;

        this.mouseWasHovering = false;
    }

    update() {
        if (!this.mouseIsHoveringOver && this.mouseIsHovering())
        {
            sounds.play(SoundName.Click)
        }
        
        this.mouseIsHoveringOver = this.mouseIsHovering()

        if (this.mouseIsHoveringOver && input.isMouseButtonPressed(0))
        {
            this.callback()
        }
    }

    render(disabled) {
        context.save();
        this.renderBackground();
        this.renderForeground();
        context.restore();

        context.save();
        if(this.mouseIsHoveringOver && !disabled)
        {
            context.strokeStyle = 'white';
		    context.lineWidth = 4;

		    roundedRectangle(
			    context,
			    this.position.x - 3,
			    this.position.y - 3,
			    this.dimensions.x + (3 * 2),
			    this.dimensions.y + (3 * 2),
		    );
        }
        context.restore();

        context.save();
		context.font = `12px Joystix`;
		context.fillStyle = 'rgb(0,0,0)';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
        context.fillText(this.displayText, this.position.x + (this.dimensions.x / 2), this.position.y + (this.dimensions.y / 2))
        context.restore();
    }

    renderBackground() {
        context.fillStyle = this.borderColour;
        roundedRectangle(
            context,
            this.position.x,
            this.position.y,
            this.dimensions.x,
            this.dimensions.y,
            Button.BORDER_WIDTH,
            false,
            true
        );
    }

    renderForeground() {
        context.fillStyle = this.panelColour;
        roundedRectangle(
            context,
            this.position.x + Button.BORDER_WIDTH / 2,
            this.position.y + Button.BORDER_WIDTH / 2,
            this.dimensions.x - Button.BORDER_WIDTH,
            this.dimensions.y - Button.BORDER_WIDTH,
            Button.BORDER_WIDTH,
            true,
            false
        );
    }

    toggle() {
        this.isEnabled = !this.isEnabled
    }

    mouseIsHovering() {
        let mousePos = input.getMousePosition()
        if (
            Math.floor(mousePos.x) >= this.position.x &&
            Math.floor(mousePos.x) <= this.position.x + this.dimensions.x &&
            Math.floor(mousePos.y) >= this.position.y &&
            Math.floor(mousePos.y) <= this.position.y + this.dimensions.y
        ) {
            return true
        }
        else {
            return false
        }
    }
}
