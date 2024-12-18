import Vector from "../../lib/Vector.js"
import Direction from "../enums/Direction.js"
import WeaponType from "../enums/WeaponType.js"

export default class Weapon {
    constructor(player) {
        this.player = player
        this.level = player.level

        this.position = new Vector(0, 0)
        if (this.player.facing === Direction.Right) {
            this.position.x = this.player.position.x + 20
            this.position.y = this.player.position.y + 15
        }
        else {
            this.position.x = this.player.position.x + 10
            this.position.y = this.player.position.y + 15
        }

        this.dimensions = new Vector()
        this.stateMachine = null
        this.currentAnimation = null;
		this.sprites = [];
        this.bullets = []
        this.bulletSpawned = false
        this.damage = 20
        this.type = null

        this.isShooting = false
    }

    update(dt) {
        this.stateMachine.update(dt);
        this.currentAnimation.update(dt);
        if (this.player.facing === Direction.Right) {
            this.position.x = this.player.position.x + 20
            this.position.y = this.player.position.y + 15
        }
        else {
            this.position.x = this.player.position.x + 10
            this.position.y = this.player.position.y + 15
        }

        //this.bullets.forEach(bullet => bullet.update(dt))
    }

    render(offset = { x: 0, y: 0 }) {
        const x = this.position.x + offset.x;
        const y = this.position.y + offset.y;
        
        this.stateMachine.render();
        this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
        if (this.bulletSpawned) {
            this.bullets.forEach(bullet => bullet.render())
        }
    }

    changeState(state, params) {
		this.stateMachine.change(state, params);
	}
}