import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Zombie from "../../../entities/Zombies/Zombie.js"
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { input, sounds, timer } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Animation from "../../../../lib/Animation.js"
import EnemyStateName from "../../../enums/EnemyStateName.js";
import SoundName from "../../../enums/SoundName.js";

export default class EnemyEatingState extends State {
	constructor(enemy, frames) {
		super();

		this.enemy = enemy;

		this.animation = new Animation(frames, 0.2);

		this.damageTimer = 0;
		this.damageInterval = 2; 

		this.eatingTimer = 0;

		this.changed = false
	}

	enter() {
		this.enemy.speed = 0
		this.enemy.sprites = this.enemy.eatingSprites;
		this.enemy.currentAnimation = this.animation;

		this.damageTimer = 0;
	}

	update(dt) {
		if (this.enemy.changedToHitSprites && !this.changed) {
			this.enemy.sprites = this.enemy.hitEatingSprites
			this.changed = true
		}

		else if (this.enemy.isEatingVan) {
			this.damageVan(dt);
		}

		else if (this.enemy.health <= 0) {
			this.enemy.changeState(EnemyStateName.Dying)
		}	
	}

	async damageVan(dt) {
		this.damageTimer += dt;

		if (this.damageTimer >= this.damageInterval && !this.enemy.level.van.hasDied) {
			sounds.play(SoundName.ZombieEating)
			this.enemy.level.van.health -= this.enemy.damage
			await this.enemy.level.vanHealthBar.diminishAnimation(this.enemy.damage)
			this.damageTimer -= this.damageInterval; 
		}
	}
}
