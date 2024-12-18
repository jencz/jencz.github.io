import Currency from "./Currency.js";
import Animation from "../../../lib/Animation.js";

export default class GoldCoin extends Currency {
    constructor(dimensions, position, level) {
        super(dimensions, position, level)

        this.hitbox.set(this.position.x + 1, this.position.y, Currency.WIDTH * 0.8 - 3, Currency.HEIGHT * 0.8 - 4)
        this.currentAnimation = new Animation([4, 5, 6, 5], 0.15)
        this.worth = 10
    }
}