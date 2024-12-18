import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { input } from "../../../globals.js";
import Level from "../../../objects/Level.js";
import Animation from "../../../../lib/Animation.js";

export default class PlayerWalkingState extends State {
	/**
	 * In this state, the player can move around using the
	 * directional keys. From here, the player goes back to it's idle
	 * state when none of the movement keys are being pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;

		this.animation_right = new Animation([0, 1, 2, 3], 0.05)
		this.animation_left = new Animation([5, 6, 7, 8], 0.05)
	}

	enter() {
		if (this.player.facing === Direction.Right) {
			this.player.currentAnimation = this.animation_right
		}
		if (this.player.facing === Direction.Left) {
			this.player.currentAnimation = this.animation_left
		}

	}

	update(dt) {
		if (this.player.facing === Direction.Right) {
			this.player.currentAnimation = this.animation_right
		}
		if (this.player.facing === Direction.Left) {
			this.player.currentAnimation = this.animation_left
		}


		this.handleMovement(dt);
	}

	handleMovement(dt) {
		if (
			!input.isKeyHeld(Input.KEYS.W) &&
			!input.isKeyHeld(Input.KEYS.A) &&
			!input.isKeyHeld(Input.KEYS.S) &&
			!input.isKeyHeld(Input.KEYS.D)
		) {
			this.player.changeState(PlayerStateName.Idle);
		}

		if (input.isKeyHeld(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			// this.player.facing doesn't change
			this.player.position.y += this.player.speedV * dt;

			if (
				this.player.position.y + this.player.dimensions.y >=
				Level.BOTTOM_EDGE
			) {
				this.player.position.y =
					Level.BOTTOM_EDGE - this.player.dimensions.y;
			}
		} else if (input.isKeyHeld(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			// this.player.facing doesn't change
			this.player.position.y -= this.player.speedV * dt;

			if (
				this.player.position.y <=
				Level.TOP_EDGE - this.player.dimensions.y
			) {
				this.player.position.y =
					Level.TOP_EDGE - this.player.dimensions.y;
			}
		} 

		if (input.isKeyHeld(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			this.player.facing = Direction.Right;
			this.player.position.x += this.player.speed * dt;

			if (
				this.player.position.x + this.player.dimensions.x >=
				Level.RIGHT_EDGE
			) {
				this.player.position.x =
					Level.RIGHT_EDGE - this.player.dimensions.x;
			}
		} else if (input.isKeyHeld(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			this.player.facing = Direction.Left;
			this.player.position.x -= this.player.speed * dt;

			if (this.player.position.x <= Level.LEFT_EDGE) {
				this.player.position.x = Level.LEFT_EDGE;
			}
		}
	}
}