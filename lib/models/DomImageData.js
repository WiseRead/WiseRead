/**
 * @typedef {Object} DomImageDataArgs
 * @property {string} name
 * @property {number} height
 * @property {number} topDistance
 */

export class DomImageData {
  /**
   * @param {DomImageDataArgs} args
   */
  constructor (args) {
    /** @type {string} */
    this.name = args.name

    /** @type {number} */
    this.height = args.height

    /** @type {number} */
    this.topDistance = args.topDistance
  }
}
