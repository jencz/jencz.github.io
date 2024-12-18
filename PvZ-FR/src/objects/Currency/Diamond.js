import Currency from "./Currency.js";
import Animation from "../../../lib/Animation.js";

export default class Diamond extends Currency {
    constructor(dimensions, position, level) {
        super(dimensions, position, level)

        this.hitbox.set(this.position.x, this.position.y, Currency.WIDTH * 0.8 - 1, Currency.HEIGHT * 0.8 - 4)
        this.currentAnimation = new Animation([0, 1, 2, 1], 0.20)
        this.worth = 20
    }
}