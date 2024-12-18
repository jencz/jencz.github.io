import UserInterfaceElement from '../UserInterfaceElement.js';
import { roundedRectangle } from '../../../lib/Drawing.js';
import { context, musicPlayer, stateStack } from '../../globals.js';
import Color from '../../enums/Color.js';
import { input } from '../../globals.js';
import ButtonType from '../../enums/ButtonType.js';
import Button from './Button.js';
import ImageName from '../../enums/ImageName.js';
import Sprite from '../../../lib/Sprite.js';
import { images } from '../../globals.js';
import ImageButton from './ImageButton.js';
import PauseState from '../../states/PauseState.js';

export default class CloseButton extends ImageButton {
    /**
     * The button that closes the Playstate.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @param {object} options
     */
    constructor(x, y, buttonType, menu, callback = () => {stateStack.push(new PauseState()); musicPlayer.pause()}) {
        super(x, y, buttonType, callback, menu);

        this.defaultSprite = this.enabledSprite
        this.hoverSprite = this.disabledSprite

        this.sprite = this.defaultSprite;
    }

    update(dt) {
        super.update(dt)
        
        if (this.mouseIsHoveringOver)
        {
            this.sprite = this.hoverSprite
        }
        else
        {
            this.sprite = this.defaultSprite
        }
    }

    render() {
        context.save();
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

        context.restore();
    }
}
