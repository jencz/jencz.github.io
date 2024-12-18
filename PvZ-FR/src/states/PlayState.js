import State from "../../lib/State.js";
import Player from "../entities/Player.js";
import ImageName from "../enums/ImageName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, input, musicPlayer, timer } from "../globals.js";
import Level from "../objects/Level.js";
import Van from "../objects/Van.js";
import { debug } from "../globals.js";
import Vector from "../../lib/Vector.js";

export default class PlayState extends State {
	constructor(username) {
		super();
		this.username = username

		this.level = new Level(username);

		this.prevMousePos = input.getMousePosition();
	}

	enter() {}

	update(dt) {
		this.level.update(dt);

		let mousePos = input.getMousePosition()
		if (mousePos.x !== this.prevMousePos.x && mousePos.y !== this.prevMousePos.y)
		{
			//console.log(mousePos)
		}

		this.prevMousePos = mousePos

		debug.update()
	}

	render() {
		this.level.render();
	}
}
