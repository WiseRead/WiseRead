/**
 * @typedef {Object} FileBlobArgs
 * @property {Blob} data
 * @property {string} name
 */

export class FileBlob {
  /**
   * @param {FileBlobArgs} args
   */
  constructor (args) {
    /** @type {Blob} */
    this.data = args.data

    /** @type {string} */
    this.name = args.name
  }
}
