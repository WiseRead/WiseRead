const FileName = {
  /**
   * @param {string} fileName
   * @return {boolean}
   */
  isArchiveName (fileName) {
    const lCase = fileName.toLowerCase()
    return (lCase.endsWith('.zip') || lCase.endsWith('.cbz'))
  },

  /**
   * @param {string} fileName
   * @return {boolean}
   */
  isImageName (fileName) {
    return Boolean(fileName.match(/.(jpg|jpeg|png|gif)$/i))
  },

  /**
   * @param {string[]} filesNames
   * @return {boolean}
   */
  areAllArchives (filesNames) {
    return filesNames.every((f) => this.isArchiveName(f))
  },

  /**
   * @param {string[]} filesNames
   * @return {boolean}
   */
  areSomeArchives (filesNames) {
    return filesNames.some((f) => this.isArchiveName(f))
  },
}

export default FileName
