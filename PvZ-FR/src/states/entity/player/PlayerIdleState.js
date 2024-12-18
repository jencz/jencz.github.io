import Input from "../../../../lib/Input.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { context, input } from "../../../globals.js";
import Animation from "../../../../lib/Animation.js";

export default class PlayerIdleState extends State {
	/**
	 * In this state, the player is stationary unless
	 * a directional key or the spacebar is pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;

		this.animation_right = new Animation([0, 1, 2, 3], .5)
		this.animation_left = new Animation([5, 6, 7, 8], .5)
	}

	enter() {
		if (this.player.facing === Direction.Right)
		{
			this.player.currentAnimation = this.animation_right
		}
		else
		{
			this.player.currentAnimation = this.animation_left
		}
	}

	update() {
		this.checkForMovement()
	}

	checkForMovement() {
		if (input.isKeyPressed(Input.KEYS.S)) {
            input.keys.S = true
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.Walking);        
		} else if (input.isKeyPressed(Input.KEYS.D)) {
            input.keys.D = true
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.W)) {
            input.keys.W = true
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.A)) {
            input.keys.A = true
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Walking);
		}
	}
}