import { ImageBlob, ChapterInfo } from '~/lib/models'
import _ from 'lodash'

/**
 * @typedef {Object} ChapterArgs
 * @property {ChapterInfo} chapterInfo
 * @property {ImageBlob[]?} images
 */

export class Chapter {
  /**
   * @param {ChapterArgs} args
   */
  constructor (args) {
    /** @type {ChapterInfo} */
    this.chapterInfo = args.chapterInfo

    /** @type {ImageBlob[]?} */
    this.images = _.defaultTo(args.images, null)
  }

  isPending () {
    return _.isNil(this.images)
  }

  /**
   * @return {Chapter}
   */
  clone () {
    return new Chapter({
      chapterInfo: this.chapterInfo.clone(),
      images: this.images?.map((i) => i) ?? null
    })
  }

  /**
   * @param {Chapter} chapter
   * @return {Chapter}
   */
  updateAll (chapter) {
    this.chapterInfo.updateAll(chapter.chapterInfo)

    if (!_.isEqual(this.images, chapter.images)) {
      this.images = chapter.images?.map((i) => i) ?? null
    }
    return this
  }

  /**
   * @return {number}
   */
  getSize () {
    return this.images?.reduce((accumulator, currentValue) => accumulator + currentValue.data.size, 0) ?? 0
  }
}
