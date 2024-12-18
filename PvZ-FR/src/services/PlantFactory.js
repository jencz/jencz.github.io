import PlantType from "../enums/PlantType.js";
import Plant from "../entities/Plants/Plant.js";
import Walnut from "../entities/Plants/Walnut.js";
import PotatoMine from "../entities/Plants/PotatoMine.js";
import Cherrybomb from "../entities/Plants/Cherrybomb.js";
import Spikeweed from "../entities/Plants/Spikeweed.js";

/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class PlantFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type, level) {
		switch (type) {
			case PlantType.Walnut:
				return new Walnut(level);
			case PlantType.PotatoMine:
				return new PotatoMine(level)
			case PlantType.CherryBomb:
				return new Cherrybomb(level)
			case PlantType.Spikeweed:
				return new Spikeweed(level)
		}
	}
}