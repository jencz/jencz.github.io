import Sprite from "../../lib/Sprite.js"
import Vector from "../../lib/Vector.js"
import ImageName from "../enums/ImageName.js"
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from "../globals.js"
import { context, timer } from "../globals.js"
import Color from "../enums/Color.js"
import { roundedRectangle } from "../../lib/Drawing.js"
import Easing from "../../lib/Easing.js"

export default class HealthBar {
    static HEALTH_BAR_WIDTH = 260
    static HEALTH_BAR_HEIGHT = 25
    constructor(van) {
        this.van = van

        this.position = new Vector((CANVAS_WIDTH / 2) - (HealthBar.HEALTH_BAR_WIDTH / 2 - 65), CANVAS_HEIGHT / 2 - 117)

        this.sprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.HealthBar),
            HealthBar.HEALTH_BAR_WIDTH,
            HealthBar.HEALTH_BAR_HEIGHT
        )

        this.maxHealth = (HealthBar.HEALTH_BAR_WIDTH * 0.5) - 8
        this.barHeight = (HealthBar.HEALTH_BAR_HEIGHT * 0.5) - 8
    }

    render() {
        context.save()
        this.renderBackground()
        this.renderForeground()
        context.restore()
    }

    renderBackground() {
        this.sprites[0].render(this.position.x, this.position.y, { x: 0.5, y: 0.5 })
    }

    renderForeground() {
        context.fillStyle = Color.Crimson
        roundedRectangle(
            context,
            this.position.x + 4,
            this.position.y + 4,
            this.maxHealth,
            this.barHeight,
            1,
            true,
            false
        )
    }

    async diminishAnimation(damage) {
		timer.tweenAsync(
			this,
			{ maxHealth: this.maxHealth - damage * (this.maxHealth / this.van.health)},
			0.1,
			Easing.linear
		)
	}
}