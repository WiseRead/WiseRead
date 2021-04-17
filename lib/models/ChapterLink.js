import _ from 'lodash'

/**
 * @typedef {Object} ChapterLinkArgs
 * @property {string} name
 * @property {string} link
 */

export class ChapterLink {
  /**
   * @param {ChapterLinkArgs} args
   */
  constructor (args) {
    /** @type {string} */
    this.id = _.uniqueId()

    /** @type {string} */
    this.name = args.name

    /** @type {string} */
    this.link = args.link
  }

  trim () {
    return new ChapterLink({ name: this.name.trim(), link: this.link.trim() })
  }
}
