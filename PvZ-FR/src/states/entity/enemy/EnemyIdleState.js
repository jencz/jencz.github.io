import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Zombie from "../../../entities/Zombies/Zombie.js"
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { input } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Animation from "../../../../lib/Animation.js"
import Hitbox from "../../../../lib/Hitbox.js";
import EnemyStateName from "../../../enums/EnemyStateName.js";

export default class EnemyIdleState extends State {
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
        
		this.animation = new Animation(frames, 1)
        
	}

	enter() {
        this.enemy.sprites = this.enemy.idleSprites;
		this.enemy.currentAnimation = this.animation   	
	}

	update(dt) {}
}