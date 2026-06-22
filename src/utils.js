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
    t.name = options.name ?? 'nameless_text_obj'
    t.renderOrder = options.renderOrder ?? levelConfig.RENDER_ORDER.UI
    if(options.layers)t.layers.set(options.layers)
    t.sync()
    return t
}


/**returns the ponts around a circle. used for generating the song select screen 
@param {number} circleCenterX - the x of the center of the circle ya dingus!
@param {number} circleCenterY - aaaand the y
@param {number} circleRadius - and its radius
@param {number} numberOfPoints - finally, the number of vertices 
*/
export const createCircleMath = (circleCenterX, circleCenterY, circleRadius, numberOfPoints, angleOffset) => {
    //basically the distance between two vertices (distance around the circle)
    const angleStep = Math.PI * 2 / numberOfPoints 
    //this is what  will be returned
    const arrayOfPoints = []
    
    for(let i = 0; i < numberOfPoints; i++){
        
        const angle = i * angleStep + angleOffset
        const coordsObj = {x: null, y: null, z: null}
        //get x and y for the points
        // coordsObj.x = Math.cos(angle) * circleRadius + circleCenterX
        // coordsObj.y = Math.sin(angle) * circleRadius + circleCenterY
        coordsObj.x = Math.cos(angle) * circleRadius + circleCenterX
        coordsObj.y = Math.sin(angle) * circleRadius + circleCenterY
        coordsObj.z = Math.sin(angle) * circleRadius
        arrayOfPoints.push(coordsObj)
    }

    return arrayOfPoints
}