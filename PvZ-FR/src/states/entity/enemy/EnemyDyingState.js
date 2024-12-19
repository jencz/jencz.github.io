import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Zombie from "../../../entities/Zombies/Zombie.js"
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { input, sounds } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Animation from "../../../../lib/Animation.js"
import Hitbox from "../../../../lib/Hitbox.js";
import SoundName from "../../../enums/SoundName.js";

export default class EnemyDyingState extends State {
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

		this.animation = new Animation(frames, 0.2, 1)

		this.soundHasPlayed = false;
	}

	enter(dropCurrency = true) {
		if (dropCurrency) {
			this.enemy.dropCurrency()
		}

		console.log('has entered dying')

		this.enemy.isDying = true
		this.enemy.speed = 0
		this.enemy.isInvincible = true
		this.enemy.sprites = this.enemy.dyingSprites;
		this.enemy.currentAnimation = this.animation;
	}

	update(dt) {
		if (this.enemy.currentAnimation.isHalfwayDone() && !this.soundHasPlayed)
		{
			sounds.play(SoundName.ZombieFalling)
			this.soundHasPlayed = true;
		}

		if (this.enemy.currentAnimation.isDone()) {
			this.enemy.hasDied = true
		}
	}
}