import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Zombie from "../../../entities/Zombies/Zombie.js"
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { input } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Animation from "../../../../lib/Animation.js"
import EnemyStateName from "../../../enums/EnemyStateName.js";

export default class EnemyWalkingState extends State {
	/**
	 * In this state, the player can move around using the
	 * directional keys. From here, the player can go idle
	 * if no keys are being pressed. The player can also swing
	 * their sword if they press the spacebar.
	 *
	 * @param {Zombie} enemy
	 */
	constructor(enemy, frames) {
		super();

		this.enemy = enemy;

		this.animation = new Animation(frames, 0.22)
		// this.targetPosition = null
	}

	enter() {
		this.enemy.sprites = this.enemy.walkingSprites
		this.enemy.currentAnimation = this.animation
	}

	update(dt) {
        this.move(dt)

		if (this.enemy.health == this.enemy.health * 0.5 && !this.enemy.changedToHitSprites) {
			this.enemy.sprites = this.enemy.hitWalkingSprites
			this.enemy.changedToHitSprites = true
		}
	}

    move(dt) {
		if (this.enemy.spawnDirection === Direction.Left) {
			const targetPosition = this.enemy.level.van.getLeftSidePositions()
			

			const directionX = targetPosition.x - this.enemy.position.x
			const directionY = targetPosition.y - (this.enemy.position.y + this.enemy.dimensions.y)

			const magnitude = Math.sqrt(directionX * directionX + directionY * directionY)

			const velocityX = (directionX / magnitude) * this.enemy.speed * dt
			const velocityY = (directionY / magnitude) * this.enemy.speed * dt

			this.enemy.position.x += velocityX
			this.enemy.position.y += velocityY
		}
		else if (this.enemy.spawnDirection === Direction.Right){
			const targetPosition = this.enemy.level.van.getRightSidePositions()

			const directionX = targetPosition.x - (this.enemy.position.x + this.enemy.dimensions.x)
			const directionY = targetPosition.y - (this.enemy.position.y + this.enemy.dimensions.y)

			const magnitude = Math.sqrt(directionX * directionX + directionY * directionY)

			const velocityX = (directionX / magnitude) * this.enemy.speed * dt
			const velocityY = (directionY / magnitude) * this.enemy.speed * dt

			this.enemy.position.x += velocityX
			this.enemy.position.y += velocityY
		}    
    }
}