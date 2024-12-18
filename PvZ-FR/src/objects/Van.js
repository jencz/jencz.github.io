import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from "../globals.js";
import GameObject from "./GameObject.js";

export default class Van extends GameObject {
    static VAN_WIDTH = 92
    static VAN_HEIGHT = 59
    static CRATER_WIDTH = 102
    static CRATER_HEIGHT = 73

    constructor(dimensions, position) {
        super(dimensions, position)

        this.health = 100
        this.isSolid = true
        this.hasDied = false

        this.vanSprites = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Van),
            Van.VAN_WIDTH,
            Van.VAN_HEIGHT
        )

        this.craterSprite = Sprite.generateSpritesFromSpriteSheet(
            images.get(ImageName.Crater),
            Van.CRATER_WIDTH,
            Van.CRATER_HEIGHT)

        this.hitbox.set(this.position.x + 15, this.position.y + 10, 70, 40)

        this.topLeft = new Vector(this.hitbox.position.x, this.hitbox.position.y)
        this.bottomLeft = new Vector(this.hitbox.position.x, this.hitbox.position.y + this.hitbox.dimensions.y)
        this.topRight = new Vector(this.hitbox.position.x + this.hitbox.dimensions.x, this.hitbox.position.y)
        this.bottomRight = new Vector(this.hitbox.position.x + this.hitbox.dimensions.x, this.hitbox.position.y + this.hitbox.dimensions.y)

        this.sprites = this.vanSprites
    }

    update(dt) {
        if (this.health <= 0 && !this.hasDied) {
            this.hasDied = true
        }
    }

    getLeftSidePositions() {
        let positions = []

        const x = this.topLeft.x
        const startY = this.topLeft.y
        const endY = this.bottomLeft.y

        for (let y = startY; y <= endY; y++) {
            positions.push(new Vector(x, y))
        }

        const randomIndex = Math.floor(Math.random() * positions.length)
        return positions[randomIndex]
    }

    getRightSidePositions() {
        let positions = []

        const x = this.topRight.x
        const startY = this.topRight.y
        const endY = this.bottomRight.y

        for (let y = startY; y <= endY; y++) {
            positions.push(new Vector(x, y))
        }

        const randomIndex = Math.floor(Math.random() * positions.length)
        return positions[randomIndex]
    }
}