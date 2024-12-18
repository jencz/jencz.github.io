import UserInterfaceElement from '../UserInterfaceElement.js';
import { roundedRectangle } from '../../../lib/Drawing.js';
import { context } from '../../globals.js';
import Color from '../../enums/Color.js';
import { input } from '../../globals.js';
import ButtonType from '../../enums/ButtonType.js';
import Button from './Button.js';
import ImageName from '../../enums/ImageName.js';
import Sprite from '../../../lib/Sprite.js';
import { images } from '../../globals.js';

export default class ImageButton extends Button {
    static BUTTON_WIDTH = 24;
    static BUTTON_HEIGHT = 24;

    /**
     * A UI element that is clickable.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {object} options
     */
    constructor(x, y, buttonType = ButtonType.Pea, callback, menu) {
        super(x, y, ImageButton.BUTTON_WIDTH, ImageButton.BUTTON_HEIGHT, callback);

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Buttons),
            ImageButton.BUTTON_WIDTH,
            ImageButton.BUTTON_HEIGHT
        )

        this.buttonType = buttonType

        this.parentMenu = menu

        this.Frame1 = buttonType * 2
        this.Frame2 = (buttonType * 2) + 1

        this.enabledSprite = this.sprites[this.Frame1]
        this.disabledSprite = this.sprites[this.Frame2]

        this.sprite = this.enabledSprite
    }

    render(disabled) {
        context.save();
        if (this.isEnabled && !disabled) {
            if (this.mouseIsHoveringOver) {
                context.strokeStyle = 'white';
                context.lineWidth = 4;

                let posOffset = { x: 0, y: 0 }
                let dimOffset = { x: 0, y: 0 }

                if (this.buttonType !== ButtonType.Pause) {
                    posOffset = { x: 0, y: 3 }
                    dimOffset = { x: 0, y: -3 }
                }
                roundedRectangle(
                    context,
                    this.position.x + posOffset.x,
                    this.position.y + + posOffset.y,
                    ImageButton.BUTTON_WIDTH + dimOffset.x,
                    ImageButton.BUTTON_HEIGHT + dimOffset.y
                );
            }
            this.sprite.render(this.position.x, this.position.y)

        }
        else {
            this.disabledSprite.render(this.position.x, this.position.y)
        }
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
            true,
            false
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
        this.isVisible = !this.isVisible;
    }
}
