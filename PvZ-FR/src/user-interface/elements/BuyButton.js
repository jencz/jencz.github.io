import UserInterfaceElement from '../UserInterfaceElement.js';
import { roundedRectangle } from '../../../lib/Drawing.js';
import { context, sounds } from '../../globals.js';
import Color from '../../enums/Color.js';
import { input } from '../../globals.js';
import ButtonType from '../../enums/ButtonType.js';
import Button from './Button.js';
import ImageName from '../../enums/ImageName.js';
import Sprite from '../../../lib/Sprite.js';
import { images } from '../../globals.js';
import ImageButton from './ImageButton.js';
import SoundName from '../../enums/SoundName.js';

export default class BuyButton extends ImageButton {
    /**
     * A button used to buy things in the bottom bar menu.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {object} options
     */
    constructor(x, y, buttonType, callback, menu) {
        super(x, y, buttonType, callback, menu);

        this.price = 100

        switch (buttonType) {
            case ButtonType.Walnut:
                this.price = 50
                break;
            case ButtonType.Pea:
                this.price = 0
                break;
            case ButtonType.GoldPea:
                this.price = 30
                break;
            case ButtonType.SnowPea:
                this.price = 75
                break;
            case ButtonType.SplitPea:
                this.price = 150
                break;
            case ButtonType.GatlingPea:
                this.price = 200
                break;
            case ButtonType.Spikeweed:
                this.price = 100
                break;
            case ButtonType.CherryBomb:
                this.price = 250
                break;
            case ButtonType.PotatoMine:
                this.price = 75;
                break;
            default:
                this.price = 20
                break;
        }

        // To make testing faster, price is set to zero so buttons are never disabled
        this.price = 0
        this.checkEnable()
    }

    update(dt) {
        if (!this.mouseIsHoveringOver && this.mouseIsHovering()) {
            sounds.play(SoundName.Click)
        }

        this.mouseIsHoveringOver = this.mouseIsHovering()

        if (this.isEnabled) {
            if (this.mouseIsHoveringOver && input.isMouseButtonPressed(0)) {
                this.parentMenu.player.accountBalance -= this.price
                this.callback()
            }
        }
        this.checkEnable()
    }

    render(disabled) {
        super.render(disabled)
    }

    checkEnable() {
        if (this.isAffordable() && !this.isEnabled) {
            this.isEnabled = true;
        }
        else if (!this.isAffordable() && this.isEnabled) {
            this.isEnabled = false;
        }
    }

    isAffordable() {
        return this.parentMenu.player.accountBalance >= this.price
    }
}
