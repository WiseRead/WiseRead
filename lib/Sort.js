import { ImageBlob } from '~/lib/models'

// GitHub: https://github.com/litejs/natural-compare-lite
const naturalCompare = require('natural-compare-lite')

const Sort = {
  /**
   * @param {ImageBlob[]?} images
   */
  sortChapterImages (images) {
    // NOTE: We may need to use name.toLowerCase()
    images?.sort((a, b) => naturalCompare(a.name, b.name))
  },

  /**
   * @param {File[]?} files
   */
  sortFiles (files) {
    files?.sort((a, b) => naturalCompare(a.name.toLowerCase(), b.name.toLowerCase()))
  }

}

export default Sort
