import { Archive } from '~/lib/utils/Archive'
import { Download, DownloadOptions, DownloadStatusEnum, DownloadError } from '~/lib/utils/Download'
import Sort from '~/lib/Sort'
import DomUtils from '~/lib/utils/DomUtils'
import DropboxHelp from '~/lib/filehosts/DropboxHelp'
import {
  FileBlob,
  ImageBlob,
  Chapter,
  ChapterInfo,
  ChapterLink,
} from '~/lib/models'

import _ from 'lodash'

const helpers = {
  /**
   * @param {FileBlob[]} extractedFiles
   * @param {ChapterInfo} chapterInfo
   * @return {Chapter}
   */
  extractedFilesToChapter (extractedFiles, chapterInfo) {
    const images = extractedFiles.filter((b) => b.data.size !== 0).map((f) => new ImageBlob(f))
    Sort.sortChapterImages(images)
    return new Chapter({ chapterInfo: chapterInfo, images: images })
  }
}

/**
 * @readonly @enum {string}
 */
export const ChapterStreamStatus = {
  NOT_STARTED: 'NOT_STARTED',
  STARTED: 'STARTED',
  FINISHED: 'FINISHED',
  FAILED: 'FAILED',
  ABORTED: 'ABORTED',
}

/**
 * @typedef {Object} CSLoadingLiveDataArgs
 * @property {(newChapter: Chapter) => void} updateChapterFunc
 * @property {() => number} getChapterIndex
 */

export class CSLoadingLiveData {
  /**
   * Chapter Stream Loading Live Data
   * @param {CSLoadingLiveDataArgs} args
   */
  constructor (args) {
    /** @type {(newChapter: Chapter) => void} */
    this.updateChapter = args.updateChapterFunc

    /** @type {() => number} */
    this.getChapterIndex = args.getChapterIndex
  }
}

/**
 * @typedef {Object} ChapterStreamArgs
 *
 * @property {ChapterInfo} initialChapterInfo
 * @property {(thisStream: ChapterStream) => Promise<void>} loadChapterFunc
 * @property {(() => void)=} abortFunc
 */

export class ChapterStream {
  /**
   * @param {ChapterStreamArgs} args
   */
  constructor (args) {
    /** @type {ChapterInfo} */
    this.initialChapterInfo = args.initialChapterInfo

    /** @type {Chapter} */
    this.streamedChapter = new Chapter({ chapterInfo: _.cloneDeep(args.initialChapterInfo), images: null })

    /** @type {(thisStream: ChapterStream) => Promise<void>} */
    this.loadChapterFunc = args.loadChapterFunc

    /** @type {() => void} */
    this.abortFunc = args.abortFunc ?? (() => {})

    /** @type {CSLoadingLiveData?} */
    this.loadingLiveData = null

    /** @type {Promise} */
    this.loadingPromise = new Promise((resolve, reject) => {})

    /** @type {Error?} */
    this.lastError = null

    /** @type {ChapterStreamStatus} */
    this.status = ChapterStreamStatus.NOT_STARTED
  }

  /**
   * @param {CSLoadingLiveData} loadingLiveData
   * @return {Promise<Chapter>}
   */
  async load (loadingLiveData) {
    this.loadingLiveData = loadingLiveData

    if (this.status === ChapterStreamStatus.NOT_STARTED ||
        this.status === ChapterStreamStatus.ABORTED ||
        this.status === ChapterStreamStatus.FAILED) {
      this.status = ChapterStreamStatus.STARTED
      this.updateStreamedChapterInfo(this.streamedChapter.chapterInfo
        .updateIsExtractingNow(false)
        .updateDownloadPercent(null)
        .updateDownloadStatus(null)
        .updateIsLoadingError(false))

      try {
        this.loadingPromise = this.loadChapterFunc(this)
        await this.loadingPromise
        if (this.status !== ChapterStreamStatus.ABORTED) {
          this.status = ChapterStreamStatus.FINISHED
        }
      }
      catch (err) {
        this.status = ChapterStreamStatus.FAILED
        this.lastError = err
        this.streamedChapter.chapterInfo.updateIsLoadingError(true)
        throw err
      }
      finally {
        this.streamedChapter.chapterInfo
          .updateIsExtractingNow(false)
          .updateDownloadPercent(null)
          .updateDownloadStatus(null)
        this.updateStreamedChapter(this.streamedChapter)
      }
    }
    else if (this.status === ChapterStreamStatus.STARTED) {
      this.updateStreamedChapter(this.streamedChapter)
      await this.loadingPromise
    }
    else if (this.status === ChapterStreamStatus.FINISHED) {
      this.updateStreamedChapter(this.streamedChapter)
    }
    // Instead we reload
    // else if (this.status === ChapterStreamStatus.FAILED) {
    //   if (this.lastError) {
    //     throw this.lastError
    //   }
    // }

    return this.streamedChapter
  }

  /**
   * @param {Chapter} newChapter
   * @return {Chapter}
   */
  updateStreamedChapter (newChapter) {
    this.streamedChapter.updateAll(newChapter)
    if (this.streamedChapter.images) {
      // If images are ready, stop all kind of loading (It should be unnecessary)
      this.streamedChapter.chapterInfo
        .updateIsExtractingNow(false)
        .updateDownloadPercent(null)
        .updateDownloadStatus(null)
    }
    if (this.status !== ChapterStreamStatus.ABORTED || !this.streamedChapter.images) {
      this.loadingLiveData?.updateChapter(this.streamedChapter.clone())
    }

    return this.streamedChapter
  }

  /**
   * @param {ChapterInfo} newChapterInfo
   * @return {Chapter}
   */
  updateStreamedChapterInfo (newChapterInfo) {
    return this.updateStreamedChapter(new Chapter({ chapterInfo: newChapterInfo, images: this.streamedChapter.images }))
  }

  /**
   * Abort if in progress
   * @return {void}
   */
  abort () {
    if (this.status === ChapterStreamStatus.STARTED) {
      // eslint-disable-next-line no-console
      console.log(`Abort at index ${this.loadingLiveData?.getChapterIndex()}`)

      this.abortFunc()
      this.status = ChapterStreamStatus.ABORTED
    }
  }

  /**
   * Free memory
   * @return {void}
   */
  free () {
    this.abort()

    // Delete old chapter and streamedChapter
    this.updateStreamedChapter(new Chapter({ chapterInfo: this.initialChapterInfo, images: null }))
    this.status = ChapterStreamStatus.NOT_STARTED
  }
}

/**
 * Abstract ComicSource class.
 * It represents source that can load chapters
 */
export class ComicSource {
  constructor () {
    if (this.constructor === ComicSource) {
      throw new Error("Abstract classes can't be instantiated.")
    }

    /** @type {ChapterStream[]} */
    this._chaptersStreams = []

    /** @type {boolean} */
    this._isLoaded = false

    /** @type {NuxtContext?} */
    this.nuxtContext = null
  }

  /**
   * @abstract
   * @param {*=} args
   * @return {Promise<ChapterStream[]>}
   */
  async loadChaptersStreamsAsync (args) {
    throw new Error('loadChaptersStreamsAsync not implemented')
  }

  /**
   * Check whether the ComicSource is loaded.
   * ComicSource is loaded by loadChaptersStreamsAsync or by getStreamsAsync.
   * @return {boolean}
   */
  isLoaded () {
    return this._isLoaded
  }

  /**
   * Get streams. load if not loaded.
   * @return {Promise<ChapterStream[]>}
   */
  async getStreamsAsync () {
    if (!this._isLoaded) {
      await this.loadChaptersStreamsAsync()
    }

    return this._chaptersStreams
  }

  /**
   * @param {number} index
   * @return {ChapterStream}
   */
  getChapterStreamAtIndex (index) {
    return this._chaptersStreams[index]
  }

  /**
   * @return {void}
   */
  freeComicSource (index) {
    this._chaptersStreams.forEach((c) => c.free())
  }

  /**
   * Abort all streams under given index (include index)
   * @return {void}
   */
  abortStreamsUnderIndex (lastIndexToAbort) {
    if (lastIndexToAbort < 0 || lastIndexToAbort >= this._chaptersStreams.length) {
      return
    }

    for (let i = 0; i <= lastIndexToAbort; i++) {
      this._chaptersStreams[i].abort()
    }
  }

  /**
   * Abort all streams above given index (include index)
   * @return {void}
   */
  abortStreamsAboveIndex (firstIndexToAbort) {
    if (firstIndexToAbort < 0 || firstIndexToAbort >= this._chaptersStreams.length) {
      return
    }

    for (let i = firstIndexToAbort; i < this._chaptersStreams.length; i++) {
      this._chaptersStreams[i].abort()
    }
  }

  /**
   * Free all streams under given index (include index)
   * @return {void}
   */
  freeStreamsUnderIndex (lastIndexToFree) {
    if (lastIndexToFree < 0 || lastIndexToFree >= this._chaptersStreams.length) {
      return
    }

    for (let i = 0; i <= lastIndexToFree; i++) {
      this._chaptersStreams[i].free()
    }
  }

  /**
   * Free all streams above given index (include index)
   * @return {void}
   */
  freeStreamsAboveIndex (firstIndexToFree) {
    if (firstIndexToFree < 0 || firstIndexToFree >= this._chaptersStreams.length) {
      return
    }

    for (let i = firstIndexToFree; i < this._chaptersStreams.length; i++) {
      this._chaptersStreams[i].free()
    }
  }

  /**
   * Get sum of sizes of all streams
   * @return {number}
   */
  getLoadedSize () {
    return this._chaptersStreams?.reduce(
      (accumulator, currentValue) => accumulator + currentValue.streamedChapter.getSize(), 0) ?? 0
  }
}

export class ComicSource_ImagesBlobs extends ComicSource {
  /**
   * @param {{
   * imagesBlobs: ImageBlob[],
   * }} param0
   */
  constructor ({ imagesBlobs }) {
    super()

    /** @type {ImageBlob[]} */
    this.imagesBlobs = imagesBlobs
  }

  /**
   * @abstract
   * @param {*=} args
   * @return {Promise<ChapterStream[]>}
   */
  async loadChaptersStreamsAsync (args) {
    this._chaptersStreams = []

    // If missing imagesBlobs
    if (this.imagesBlobs?.length < 1) {
      return this._chaptersStreams
    }

    // Use first image name for chapter name
    const chapterInfo = new ChapterInfo({ chapterName: this.imagesBlobs[0].name })

    const firstAndOnlyChapter = new ChapterStream({
      initialChapterInfo: chapterInfo,
      loadChapterFunc: async (thisStream) => {
        const chapter = new Chapter({ chapterInfo: chapterInfo, images: this.imagesBlobs })
        thisStream.updateStreamedChapter(chapter)
      }
    })

    this._chaptersStreams = [firstAndOnlyChapter]
    this._isLoaded = true
    return this._chaptersStreams
  }
}

export class ComicSource_ArchivesBlobs extends ComicSource {
  /**
   * @param {{
   * blobs: Blob[],
   * }} param0
   */
  constructor ({ blobs }) {
    super()

    /** @type {Blob[]} */
    this.blobs = blobs
  }

  /**
   * @abstract
   * @param {*=} args
   * @return {Promise<ChapterStream[]>}
   */
  async loadChaptersStreamsAsync (args) {
    this._chaptersStreams = []

    // If missing blobs
    if (!this.blobs) {
      return this._chaptersStreams
    }

    this._chaptersStreams = this.blobs.map((b, index) =>
      this.archiveToChapterStream(b, index))

    this._isLoaded = true
    return this._chaptersStreams
  }

  /**
   * @abstract
   * @param {Blob} archiveBlob
   * @param {number} index
   * @return {ChapterStream}
   */
  archiveToChapterStream (archiveBlob, index) {
    // @ts-ignore
    const chapterInfo = new ChapterInfo({ chapterName: archiveBlob.name })

    const stream = new ChapterStream({
      initialChapterInfo: chapterInfo,
      loadChapterFunc: async (thisStream) => {
        thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
          .updateIsExtractingNow(true))

        try {
          const filesBlobs = await new Archive(archiveBlob).extract()
          const chapter = helpers.extractedFilesToChapter(filesBlobs, thisStream.streamedChapter.chapterInfo)
          chapter.chapterInfo.updateIsExtractingNow(false)
          thisStream.updateStreamedChapter(chapter)
        }
        catch (err) {
          thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
            .updateIsExtractingNow(false))
          throw err
        }
      }
      // TODO: Find a way to implement abortFunc of archive
    })

    return stream
  }
}

export class ComicSource_DirectLinks extends ComicSource {
  /**
   * @param {{
   * chapterLinks: ChapterLink[],
   * tryUseFileName: boolean
   * }} param0
   */
  constructor ({ chapterLinks, tryUseFileName }) {
    super()

    /** @type {ChapterLink[]} */
    this.chapterLinks = _.clone(chapterLinks)

    /** @type {boolean} */
    this.tryUseFileName = tryUseFileName
  }

  /**
   * @abstract
   * @param {*=} args
   * @return {Promise<ChapterStream[]>}
   */
  async loadChaptersStreamsAsync (args) {
    this._chaptersStreams = []

    for (const [index, chapterLink] of this.chapterLinks.entries()) {
      const stream = this.linkToChapterStream(chapterLink.link, chapterLink.name, index)
      this._chaptersStreams.push(stream)
    }

    this._isLoaded = true
    return this._chaptersStreams
  }

  /**
   * @param {string} directLink
   * @param {string} chapterName
   * @param {number} index
   * @return {ChapterStream}
   */
  linkToChapterStream (directLink, chapterName, index) {
    const downloadToDeviceFunc = () => {
      DomUtils.downloadLinkToDevice(directLink)
    }

    const chapterInfo = new ChapterInfo({ chapterName, downloadToDeviceFunc })
    const abortControllerWrapper = { abortController: new AbortController() }
    const DEFAULT_FILENAME = '_FILE_NAME_'

    const stream = new ChapterStream({
      initialChapterInfo: chapterInfo,
      loadChapterFunc: async (thisStream) => {
        abortControllerWrapper.abortController = new AbortController()

        const updateFileInfoCallback = (filename) => {
          // Here we can update more chapter info during the download.

          if (this.tryUseFileName && filename !== DEFAULT_FILENAME) {
            thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
              .updateChapterName(filename))
          }
        }

        const progressCallback = (receivedLength, totalLength) => {
          const percent = (totalLength > 0 && receivedLength >= 0)
            ? Math.floor((receivedLength / totalLength) * 100)
            : 0

          thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
            .updateDownloadPercent(percent))
        }

        const getDefaultFileNameCallback = (link) => {
          if (DropboxHelp.isDropboxHost(link)) {
            const dropboxFilename = DropboxHelp.getFileNameFromLink(link)
            if (dropboxFilename) {
              return dropboxFilename
            }
          }

          return DEFAULT_FILENAME
        }

        /**
         * @param {DownloadStatusEnum} endCause
         */
        const onAnyEnd = (endCause) => {
          thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
            .updateDownloadStatus(endCause))
        }

        const downloadOptions = new DownloadOptions({
          updateFileInfoCallback,
          progressCallback,
          getDefaultFileNameCallback,
          onAnyEnd,
          abortController: abortControllerWrapper.abortController
        })

        thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
          .updateDownloadStatus(DownloadStatusEnum.DOWNLOADING)
          .updateDownloadPercent(0))

        let downloadedFile = null

        try {
          downloadedFile = await new Download().download(directLink, downloadOptions)

          // If download aborted or if failed without exception
          if (!downloadedFile) {
            throw new DownloadError('Empty file downloaded')
          }
        }
        catch (err) {
          if (err.message.includes('AbortError')) {
            return
          }
          else {
            throw err
          }
        }
        finally {
          thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
            .updateDownloadPercent(null)
            // .updateDownloadStatus(DownloadStatusEnum.FINISHED) // No need. updated from onAnyEnd func
          )
        }

        thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
          .updateIsExtractingNow(true))

        try {
          const extractedFiles = await new Archive(downloadedFile.data).extract()
          const chapter = helpers.extractedFilesToChapter(extractedFiles, thisStream.streamedChapter.chapterInfo)
          chapter.chapterInfo.updateIsExtractingNow(false)
          thisStream.updateStreamedChapter(chapter)
        }
        catch (err) {
          thisStream.updateStreamedChapterInfo(thisStream.streamedChapter.chapterInfo
            .updateIsExtractingNow(false))
          throw err
        }
      },

      abortFunc: () => {
        // Abort the fetch
        abortControllerWrapper.abortController.abort()

        // TODO: Find a way to abort archive
      }
    })

    return stream
  }
}

export class ComicSource_DropboxFolder extends ComicSource_DirectLinks {
  /**
   * @param {{
   * folderLink: String,
   * accessToken: String,
   * }} param0
   */
  constructor ({ folderLink, accessToken }) {
    super({ chapterLinks: [], tryUseFileName: false })

    /** @type {String} */
    this.folderLink = folderLink

    /** @type {String} */
    this.accessToken = accessToken
  }

  /**
   * @abstract
   * @param {*=} args
   * @return {Promise<ChapterStream[]>}
   */
  async loadChaptersStreamsAsync (args) {
    this.chapterLinks = []

    const fileLinks = await DropboxHelp.getFileLinksFromDropboxFolder(
      this.folderLink, this.accessToken)

    Sort.sortArray(fileLinks, (cl) => cl.fileName)

    for (const fileLink of fileLinks) {
      this.chapterLinks.push(new ChapterLink({ link: fileLink.link, name: fileLink.fileName }))
    }

    return await super.loadChaptersStreamsAsync()
  }
}
