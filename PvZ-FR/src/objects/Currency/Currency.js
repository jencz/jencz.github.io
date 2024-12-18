import Sprite from "../../../lib/Sprite.js";
import ImageName from "../../enums/ImageName.js";
import { CANVAS_WIDTH, CANVAS_HEIGHT, DEBUG, images, input, timer, sounds, musicPlayer } from "../../globals.js";
import GameObject from "../GameObject.js";
import { context } from "../../globals.js";
import Hitbox from "../../../lib/Hitbox.js";
import Level from "../Level.js";
import Easing from "../../../lib/Easing.js";
import SoundName from "../../enums/SoundName.js";

export default class Currency extends GameObject {
    static WIDTH = 21
    static HEIGHT = 22

    constructor(dimensions, position, level) {
        super(dimensions, position)

        this.level = level
        this.worth = 10

        this.currencySprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Currency),
            Currency.WIDTH,
            Currency.HEIGHT
        )

        this.currentAnimation = null

        this.sprites = this.currencySprites

        this.isConsumable = true

        this.wasConsumed = false;

        this.mouseIsHoveringOver = false;
    }

    render(offset = { x: 0, y: 0 }) {
        let x = this.position.x + offset.x;
        let y = this.position.y + offset.y;

        let scale = { x: 0.8, y: 0.8 }

        if (this.mouseIsHoveringOver)
        {
            scale = { x: 1, y: 1 }
            x-=2
            y-=2
        }

        this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y), scale);

        if (DEBUG) {
            this.hitbox.render(context);
        }
    }

    update(dt) {
        this.currentAnimation.update(dt)

        this.mouseIsHoveringOver = this.mouseIsHovering()

        if (this.mouseIsHoveringOver && input.isMouseButtonPressed(0)) {
            this.onConsume(this.level.player);
        }
    }

    onConsume(consumer) {
        if (!this.wasConsumed) {
            musicPlayer.playRandomCoin()
            timer.tween(this.position, { x: CANVAS_WIDTH - 20, y: Level.BOTTOM_BAR_START_HEIGHT - 10 }, 0.75, Easing.easeOutQuad, () => {
                consumer.accountBalance += this.worth
                this.remove()
                this.wasConsumed = true
            })
        }
        this.wasConsumed = true
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