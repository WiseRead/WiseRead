import { DownloadStatusEnum } from '~/lib/utils/Download'

import _ from 'lodash'

/**
 * @typedef {Object} ChapterInfoArgs
 * @property {string=} chapterName
 * @property {boolean=} isExtractingNow
 * @property {number=} downloadPercent
 * @property {DownloadStatusEnum=} downloadStatus
 * @property {boolean=} isLoadingError
 * @property {(() => void)=} downloadToDeviceFunc
 */

export class ChapterInfo {
  /**
   * @param {ChapterInfoArgs} args
   */
  constructor (args) {
    /** @type {string} */
    this.chapterName = args.chapterName ?? 'Chapter ?'

    /** @type {boolean} */
    this.isExtractingNow = _.defaultTo(args.isExtractingNow, false)

    /** @type {number?} */
    this.downloadPercent = _.defaultTo(args.downloadPercent, null)

    /** @type {DownloadStatusEnum?} */
    this.downloadStatus = _.defaultTo(args.downloadStatus, null)

    /** @type {boolean} */
    this.isLoadingError = _.defaultTo(args.isLoadingError, false)

    /** @type {(() => void)?} */
    this.downloadToDeviceFunc = _.defaultTo(args.downloadToDeviceFunc, null)
  }

  /**
   * @return {ChapterInfo}
   */
  clone () {
    return new ChapterInfo({
      chapterName: this.chapterName,
      isExtractingNow: this.isExtractingNow,
      downloadPercent: this.downloadPercent ?? undefined,
      downloadStatus: this.downloadStatus ?? undefined,
      isLoadingError: this.isLoadingError,
      downloadToDeviceFunc: this.downloadToDeviceFunc ?? undefined,
    })
  }

  /**
   * @param {string} chapterName
   * @return {ChapterInfo}
   */
  updateChapterName (chapterName) {
    this.chapterName = chapterName
    return this
  }

  /**
   * @param {boolean} isExtractingNow
   * @return {ChapterInfo}
   */
  updateIsExtractingNow (isExtractingNow) {
    this.isExtractingNow = isExtractingNow
    return this
  }

  /**
   * @param {number?} downloadPercent
   * @return {ChapterInfo}
   */
  updateDownloadPercent (downloadPercent) {
    this.downloadPercent = downloadPercent
    return this
  }

  /**
   * @param {DownloadStatusEnum?} downloadStatus
   * @return {ChapterInfo}
   */
  updateDownloadStatus (downloadStatus) {
    this.downloadStatus = downloadStatus
    return this
  }

  /**
   * @param {boolean} isLoadingError
   * @return {ChapterInfo}
   */
  updateIsLoadingError (isLoadingError) {
    this.isLoadingError = isLoadingError
    return this
  }

  /**
   * @param {(() => void)?} downloadToDeviceFunc
   * @return {ChapterInfo}
   */
  updateDownloadToDeviceFunc (downloadToDeviceFunc) {
    this.downloadToDeviceFunc = downloadToDeviceFunc
    return this
  }

  /**
   * @param {ChapterInfo} chapterInfo
   * @return {ChapterInfo}
   */
  updateAll (chapterInfo) {
    if (this.chapterName !== chapterInfo.chapterName) { this.chapterName = chapterInfo.chapterName }
    if (this.isExtractingNow !== chapterInfo.isExtractingNow) { this.isExtractingNow = chapterInfo.isExtractingNow }
    if (this.downloadPercent !== chapterInfo.downloadPercent) { this.downloadPercent = chapterInfo.downloadPercent }
    if (this.downloadStatus !== chapterInfo.downloadStatus) { this.downloadStatus = chapterInfo.downloadStatus }
    if (this.isLoadingError !== chapterInfo.isLoadingError) { this.isLoadingError = chapterInfo.isLoadingError }
    if (this.downloadToDeviceFunc !== chapterInfo.downloadToDeviceFunc) { this.downloadToDeviceFunc = chapterInfo.downloadToDeviceFunc }
    return this
  }
}
