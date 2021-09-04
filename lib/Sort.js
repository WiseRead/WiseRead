import { ImageBlob } from '~/lib/models'

// GitHub: https://github.com/litejs/natural-compare-lite
const naturalCompare = require('natural-compare-lite')

const Sort = {
  /**
   * @param {ImageBlob[]?} images
   */
  sortChapterImages (images) {
    // NOTE: We may need to ignore case
    Sort.sortArray(images, (f) => f.name)
  },

  /**
   * @param {File[]?} files
   */
  sortFiles (files) {
    Sort.sortArray(files, (f) => f.name, true)
  },

  /**
   * @param {Array.<T>?} items
   * @param {function(T) : string} toValueFunc
   * @param {boolean=} ignoreCase
   *
   * @template T
   */
  sortArray (items, toValueFunc, ignoreCase = false) {
    let finalToValueFunc = toValueFunc

    if (ignoreCase) {
      finalToValueFunc = (value) => toValueFunc(value).toLowerCase()
    }

    items?.sort((a, b) => naturalCompare(
      finalToValueFunc(a),
      finalToValueFunc(b)
    ))
  }
}

export default Sort
