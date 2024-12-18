import Currency from "./Currency.js";
import Animation from "../../../lib/Animation.js";

export default class SilverCoin extends Currency {
    constructor(dimensions, position, level) {
        super(dimensions, position, level)

        this.hitbox.set(this.position.x + 3, this.position.y + 1, Currency.WIDTH * 0.8 - 6, Currency.HEIGHT * 0.8 - 8)
        this.currentAnimation = new Animation([8, 9, 10, 9], 0.15)
        this.worth = 5
    }
}