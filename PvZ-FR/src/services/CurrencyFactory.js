import CurrencyType from "../enums/CurrencyType.js";
import Diamond from "../objects/Currency/Diamond.js";
import GoldCoin from "../objects/Currency/GoldCoin.js";
import SilverCoin from "../objects/Currency/SilverCoin.js";

/**
 * Encapsulates all definitions for instantiating new enemies.
 */
export default class CurrencyFactory {
	/**
	 * @param {string} type A string using the EnemyType enum.
	 * @param {array} sprites The sprites to be used for the enemy.
	 * @returns An instance of an enemy specified by EnemyType.
	 */
	static createInstance(type, dimensions, position, level) {
		switch (type) {
			case CurrencyType.Diamond:
				return new Diamond(dimensions, position, level)
			case CurrencyType.GoldCoin:
				return new GoldCoin(dimensions, position, level)
			case CurrencyType.SilverCoin:
				return new SilverCoin(dimensions, position, level)
		}
	}
}