import Vector from "../../lib/Vector.js"
import Hitbox from "../../lib/Hitbox.js"
import Direction from "../enums/Direction.js";
import Debug from "../../lib/Debug.js";
import { debug, context, DEBUG } from "../globals.js";
import EnemyStateName from "../enums/EnemyStateName.js";

export default class GameEntity {
	/**
	 * The base class to be extended by all entities in the game.
	 *
	 * @param {object} entityDefinition
	 */
	constructor(entityDefinition = {}) {
		this.position = entityDefinition.position ?? new Vector();
		this.dimensions = entityDefinition.dimensions ?? new Vector();
		this.speed = entityDefinition.speed ?? 1;
		this.totalHealth = entityDefinition.health ?? 1;
		this.damage = entityDefinition.damage ?? 1;
		this.hitboxOffsets = entityDefinition.hitboxOffsets ?? new Hitbox();
		this.damageHitboxOffsets = entityDefinition.hitboxOffsets ?? new Hitbox();

		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
		);
		this.damageHitbox = new Hitbox(
			this.position.x + this.damageHitboxOffsets.position.x,
			this.position.y + this.damageHitboxOffsets.position.y,
			this.dimensions.x + this.damageHitboxOffsets.dimensions.x,
			this.dimensions.y + this.damageHitboxOffsets.dimensions.y,
		);

		this.health = this.totalHealth;
		this.stateMachine = null;
		this.currentAnimation = null;
		this.sprites = [];
		this.direction = Direction.Left;
		// this.isDead = false;
		this.cleanUp = false;
		this.renderPriority = 0;
		this.level = null
		this.hasDied = false
		this.isInvincible = false
		this.isDying = false
		this.speed = 10;
		this.gotTargetPosition = false
		this.isFrozen = false

		this.timer = 0
	}

	update(dt) {
		if (this.isFrozen) {
			this.timer += dt
			if (this.timer >= 2 && this.health > 0) {
				this.speed = 10
				this.changeState(EnemyStateName.Walking)
				this.timer = 0
				this.isFrozen = false
			}			
		}

		this.stateMachine.update(dt);
		this.currentAnimation.update(dt);
		if (!this.isDying) {
			this.hitbox.set(
				this.position.x + this.hitboxOffsets.position.x,
				this.position.y + this.hitboxOffsets.position.y,
				this.dimensions.x + this.hitboxOffsets.dimensions.x,
				this.dimensions.y + this.hitboxOffsets.dimensions.y,
			);
			this.damageHitbox.set(
				this.position.x + this.damageHitboxOffsets.position.x,
				this.position.y + this.damageHitboxOffsets.position.y,
				this.dimensions.x + this.damageHitboxOffsets.dimensions.x,
				this.dimensions.y + this.damageHitboxOffsets.dimensions.y,
			);
		}
		else {
			this.hitbox.set(0, 0, 0, 0)
			this.damageHitbox.set(0, 0, 0, 0)
		}


		if (this.hasDied) {
			this.remove()
		}
	}

	render(offset = { x: 0, y: 0 }) {
		const x = this.position.x + offset.x;
		const y = this.position.y + offset.y;

		this.stateMachine.render();
		this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(x), Math.floor(y));
		
		if (DEBUG) {
			this.damageHitbox.render(context)
			this.hitbox.render(context)
		}
	}

	/**
	 * @param {Hitbox} hitbox
	 * @returns Whether this hitbox collided with another using AABB collision detection.
	 */
	didCollideWithEntity(hitbox) {
		return this.hitbox.didCollide(hitbox);
	}

	changeState(state, params) {
		this.stateMachine.change(state, params);
	}

	takeDamage(damage) {
		this.health -= damage
	}

	remove() {
		let index = this.level.enemies.indexOf(this)
		if (index > -1) {
			this.level.enemies.splice(index, 1)
		}
	}
}