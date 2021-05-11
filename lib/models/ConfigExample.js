import { ConfigpathType } from '~/lib/Configpath'
import { WiseReadLink } from '~/lib/WiseReadLink'

/**
 * @typedef {Object} ConfigExampleArgs
 * @property {string} name
 * @property {string} configFile
 * @property {string} configpathValue
 * @property {ConfigpathType} configpathType
 * @property {string} gitIoToRaw
 */

export class ConfigExample {
  /**
   * @param {ConfigExampleArgs} args
   */
  constructor (args) {
    this.name = args.name
    this.configFile = args.configFile
    this.configpathValue = args.configpathValue
    this.configpathType = args.configpathType
    this.gitIoToRaw = args.gitIoToRaw
  }

  /**
   * @returns {string}
   */
  toWRLink () {
    const configpath = `${this.configpathType}:${this.configpathValue}`
    return new WiseReadLink({ configpath }).toLink([])
  }

  /**
   * @returns {string}
   */
  toCubariLink () {
    return `https://cubari.moe/read/gist/${this.gitIoToRaw}`
  }
}
