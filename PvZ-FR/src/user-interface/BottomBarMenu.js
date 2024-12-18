import UserInterfaceElement from "./UserInterfaceElement.js";
import { context, images, CANVAS_WIDTH, CANVAS_HEIGHT, input, stateStack } from "../globals.js"
import ImageName from "../enums/ImageName.js"
import { roundedRectangle } from "../../lib/Drawing.js"
import Sprite from "../../lib/Sprite.js"
import Vector from "../../lib/Vector.js"
import Level from "../objects/Level.js";
import Button from "./elements/Button.js"
import ImageButton from "./elements/ImageButton.js";
import ButtonType from "../enums/ButtonType.js";
import SnowPeashooter from "../objects/Peashooters/SnowPeashooter.js";
import GamePlantingState from "../states/GamePlantingState.js";
import PlantType from "../enums/PlantType.js";
import GoldPeashooter from "../objects/Peashooters/GoldPeashooter.js"
import BuyButton from "./elements/BuyButton.js";
import GatlingPeashooter from "../objects/Peashooters/GatlingPeashooter.js";
import SplitPeashooter from "../objects/Peashooters/SplitPeashooter.js";
import Peashooter from "../objects/Peashooters/Peashooter.js";


export default class BottomBarMenu extends UserInterfaceElement {
	/**
	 * A UI element that is a Selection on a Panel.
	 * More complicated Menus may be collections
	 * of Panels and Selections that form a greater whole.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {array} items Elements are objects that each
	 * have a string `text` and function `onSelect` property.
	 */
	constructor(x, y, width, height, level) {
		super(x, y, width, height);

		this.level = level
		this.player = this.level.player

		this.sprites = Sprite.generateSpritesFromSpriteSheet(ImageName.Buttons, 24, Button.BUTTON_WIDTH, Button.BUTTON_HEIGHT)

		let bx = 28
		let bb = 2
		let by = Level.BOTTOM_BAR_START_HEIGHT + 20

		this.buttons = []
		this.buttons.push(new BuyButton(bb + bx * 1, by, ButtonType.Walnut, () => { stateStack.push(new GamePlantingState(PlantType.Walnut, this.level)) }, this))
		this.buttons.push(new BuyButton(bb + bx * 2, by, ButtonType.PotatoMine, () => { stateStack.push(new GamePlantingState(PlantType.PotatoMine, this.level)) }, this))
		this.buttons.push(new BuyButton(bb + bx * 3, by, ButtonType.CherryBomb, () => { stateStack.push(new GamePlantingState(PlantType.CherryBomb, this.level)) }, this))
		this.buttons.push(new BuyButton(bb + bx * 4, by, ButtonType.Spikeweed, () => { stateStack.push(new GamePlantingState(PlantType.Spikeweed, this.level)) }, this))
		let bx2 = 220
		this.buttons.push(new BuyButton(bx + bx2, by, ButtonType.Pea, () => { this.player.weapon = new Peashooter(this.player) }, this))
		this.buttons.push(new BuyButton(bx * 2 + bx2, by, ButtonType.GoldPea, () => { this.player.weapon = new GoldPeashooter(this.player) }, this))
		this.buttons.push(new BuyButton(bx * 3 + bx2, by, ButtonType.SnowPea, () => { this.player.weapon = new SnowPeashooter(this.player) }, this))
		this.buttons.push(new BuyButton(bx * 4 + bx2, by, ButtonType.SplitPea, () => { this.player.weapon = new SplitPeashooter(this.player) }, this))
		this.buttons.push(new BuyButton(bx * 5 + bx2, by, ButtonType.GatlingPea, () => { this.player.weapon = new GatlingPeashooter(this.player) }, this))
	}

	update() {
		this.buttons.forEach(button => button.update())
	}

	render(buttonsAreDisabled) {
		context.save()
		context.fillStyle = 'rgb( 251, 218, 178 )';
		roundedRectangle(
			context,
			0,
			CANVAS_HEIGHT - 48,
			CANVAS_WIDTH,
			50,
			0,
			true,
			false
		);
		context.restore()

		images.render(ImageName.UIBorder, 0, CANVAS_HEIGHT - Level.BOTTOM_BAR_HEIGHT, CANVAS_WIDTH, Level.BOTTOM_BAR_HEIGHT)
		images.render(ImageName.MailBox, -5, CANVAS_HEIGHT - Level.BOTTOM_BAR_HEIGHT - 40, 80, 50)
		images.render(ImageName.WoodBoard, CANVAS_WIDTH - 49, CANVAS_HEIGHT - Level.BOTTOM_BAR_HEIGHT - 20, 50, 30)

		context.save();
		context.font = `12px SamDanEvil`;
		context.fillStyle = 'rgb(0,0,0)';
		context.textBaseline = 'middle';
		context.textAlign = 'center';

		context.save()
		// context.translate(-30, Level.BOTTOM_BAR_START_HEIGHT + 15)
		//context.rotate(-Math.PI / 2)
		context.transform(1, 0.15, 0.05, 1, 0, 0)
		context.font = `20px SamDanEvil`;
		context.fillText("Shop", 10, CANVAS_HEIGHT - Level.BOTTOM_BAR_HEIGHT - 14, 80, 50)
		context.restore()

		context.font = `10px SamDanEvil`;
		context.fillText("Plants", CANVAS_WIDTH / 2 -117, Level.BOTTOM_BAR_START_HEIGHT + 17)

		context.font = `20px SamDanEvil`;
		context.fillText("Wave: " + this.level.wave, CANVAS_WIDTH / 2, Level.BOTTOM_BAR_START_HEIGHT + 21)
		context.font = `13px SamDanEvil`;
		context.fillText("Zombies Left: " + this.level.getZombiesRemaining(), CANVAS_WIDTH / 2, Level.BOTTOM_BAR_START_HEIGHT + 40)

		context.font = `10px SamDanEvil`;
		context.fillText("Weapons", CANVAS_WIDTH / 2 + 117, Level.BOTTOM_BAR_START_HEIGHT + 17)

		context.font = `25px SamDanEvil`;
		context.textAlign = 'right';
		context.textBaseline = 'top';
		context.fillText("$" + this.player.accountBalance, CANVAS_WIDTH - 3, Level.BOTTOM_BAR_START_HEIGHT - 15)
		context.fillText("$" + this.player.accountBalance, CANVAS_WIDTH - 4, Level.BOTTOM_BAR_START_HEIGHT - 16)
		context.fillStyle = 'rgb(0,175,0)';
		context.fillText("$" + this.player.accountBalance, CANVAS_WIDTH - 5, Level.BOTTOM_BAR_START_HEIGHT - 17)

		context.restore();

		this.buttons.forEach(button => button.render(buttonsAreDisabled))
	}
}
