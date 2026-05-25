import { levelConfig } from "./config"
import { Text } from "troika-three-text"


/**
 * creates, configures, and returns a troika-three-text text node
 * @param {Object} options - configuration options
 * @param {string} options.text - the text content to display
 * @param {number} options.fontSize - size of the font
 * @param {number} options.color - hex color value
 * @param {string} options.font - path to font file
 * @param {number} options.x - x position
 * @param {number} options.y - y position
 * @param {number} options.z - z position
 * @returns {Text} configured troika Text instance
 */
export const createTextNode = (options = {}) => {
    const t = new Text()
    t.font = options.font ?? levelConfig.UI_FONTS_DICT.uiFont1
    t.fontSize = options.fontSize ?? 0.1
    t.color = options.color ?? 0xffffff
    t.text = options.text ?? ''
    t.anchorX = options.anchorX ?? 'left'
    t.anchorY = options.anchorY ?? 'middle'
    t.position.set(
        options.x ?? 0,
        options.y ?? 0,
        options.z ?? 0
    )
    t.sync()
    return t
}