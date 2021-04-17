import { FileBlob } from '../models'
import _ from 'lodash'

export class Download {
  constructor () {
    // A CORS proxy. 'cors.bridged.cc' replaces 'https://cors-anywhere.herokuapp.com/'.
    // See cors-anywhere issue: https://github.com/Rob--W/cors-anywhere/issues/301
    // See https://medium.com/bridgedxyz/cors-anywhere-for-everyone-free-reliable-cors-proxy-service-73507192714e
    this.PROXY_URL = 'https://cors.bridged.cc/'
  }

  /**
   * @param {string} directLink
   * @param {DownloadOptions=} options
   * @return {Promise<FileBlob?>}
   */
  async download (directLink, options = new DownloadOptions()) {
    try {
      const file = await this._download(directLink, options)

      if (options.abortController.signal.aborted) {
        options.onAnyEnd(DownloadStatusEnum.ABORTED)
      }
      else if (!file) {
        options.onAnyEnd(DownloadStatusEnum.FAILED)
      }
      else {
        options.onAnyEnd(DownloadStatusEnum.FINISHED)
      }

      return file
    }
    catch (err) {
      options.onAnyEnd(DownloadStatusEnum.FAILED)
      throw err
    }
  }

  /**
   * @param {string} directLink
   * @param {DownloadOptions} options
   * @return {Promise<FileBlob?>}
   */
  async _download (directLink, options) {
    try {
      // Init progress
      options.progressCallback(0, 100)

      const downloadLink = (options.forceProxy) ? this.PROXY_URL + directLink : directLink

      // Start the fetch and obtain a reader
      const response = await fetch(downloadLink, { signal: options.abortController.signal })
      if (!response.ok) { throw new DownloadError(`HTTP Error: Status ${response.status}. Can't fetch ${directLink}`) }
      const reader = response.body?.getReader()
      if (!reader) { throw new DownloadError(`Can't fetch ${directLink}`) }

      // Get total length
      let isGuessedLength = true
      let totalLength = options.guessedTotalLength
      const headerContentLengthStr = response.headers.get('Content-Length')
      const headerContentLength = _.toNumber(headerContentLengthStr)

      if (headerContentLength > 0) {
        totalLength = headerContentLength
        isGuessedLength = false
      }

      // Get filename
      let filename = ''
      const headerContentDispositionStr = response.headers.get('content-disposition')
      if (headerContentDispositionStr) {
        filename = this.getFileNameFromContentDisposition(headerContentDispositionStr)
      }
      if (!filename) {
        filename = options.getDefaultFileNameCallback(directLink)
      }

      options.updateFileInfoCallback(filename)

      // Read the data
      let receivedLength = 0 // received that many bytes at the moment
      const chunks = [] // array of received binary chunks (comprises the body)

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        if (!value) {
          // (Should never happen)
          continue
        }

        chunks.push(value)
        receivedLength += value.length

        if (isGuessedLength) {
          // If the guessed length was wrong, increase it
          if (receivedLength >= totalLength) {
            totalLength = receivedLength * 2
          }

          // If the guessed length is close, increase it slightly
          if (receivedLength >= totalLength * 0.6) {
            totalLength += value.length
          }
        }

        options.progressCallback(receivedLength, totalLength)
      }

      if (options.abortController.signal.aborted) {
        // If download aborted
        // See https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request
        return null
      }

      const blob = new Blob(chunks)
      const fileBlob = new FileBlob({ data: blob, name: filename })

      options.progressCallback(receivedLength, receivedLength)
      return fileBlob
    }
    catch (err) {
      // If access has been blocked by CORS policy, try again with proxy.
      // See https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
      // (There is no way to check if it failed because CORS policy or because other type of fetch error, so we just try.
      //  See https://stackoverflow.com/questions/19325314/how-to-detect-cross-origin-cors-error-vs-other-types-of-errors-for-xmlhttpreq)
      if (err.message === 'Failed to fetch' && options.tryWithProxyIfFailed && !options.forceProxy) {
        options.forceProxy = true
        return await this.download(directLink, options)
      }
      // Any other error
      else {
        if (err instanceof DownloadError) {
          throw err
        }
        else {
          throw new DownloadError(err)
        }
      }
    }
  }

  /**
   * Get file name from content-disposition header
   * content-disposition example: "attachment;filename="file name.txt";filename*=UTF-8''file%20name.txt"
   * @param {string} contentDisposition
   */
  getFileNameFromContentDisposition (contentDisposition) {
    if (!contentDisposition) { return '' }

    let indexOfStart = contentDisposition.indexOf('="')
    if (indexOfStart < 0) { return '' }
    indexOfStart += '="'.length

    let indexOfEnd = null
    for (let ind = indexOfStart + 1; ind < contentDisposition.length; ind++) {
      if (contentDisposition[ind] === '"') {
        indexOfEnd = ind
        break
      }
    }

    if (indexOfEnd) {
      return contentDisposition.substring(indexOfStart, indexOfEnd)
    }
    else {
      return contentDisposition.substring(indexOfStart)
    }
  }
}

/**
 * @typedef {Object} DownloadOptionsArgs
 *
 * @property {((filename: string) => void)=} updateFileInfoCallback
 * @property {((receivedLength: number, totalLength: number) => void)=} progressCallback
 * @property {((link: string) => string)=} getDefaultFileNameCallback
 * @property {((cause: DownloadStatusEnum) => void)=} onAnyEnd
 * @property {AbortController=} abortController
 * @property {number=} guessedTotalLength
 * @property {boolean=} tryWithProxyIfFailed
 * @property {boolean=} forceProxy
 */

export class DownloadOptions {
  /**
   * @param {DownloadOptionsArgs=} args
   */
  constructor (args) {
    /**  @type {(filename: string) => void} */
    this.updateFileInfoCallback = args?.updateFileInfoCallback ?? ((filename) => {})

    /**  @type {(receivedLength: number, totalLength: number) => void} */
    this.progressCallback = args?.progressCallback ?? ((receivedLength, totalLength) => {})

    /**  @type {(link: string) => string} */
    this.getDefaultFileNameCallback = args?.getDefaultFileNameCallback ?? ((link) => 'file')

    /**  @type {(cause: DownloadStatusEnum) => void} */
    this.onAnyEnd = args?.onAnyEnd ?? ((cause) => {})

    /**  @type {AbortController} */
    this.abortController = args?.abortController ?? new AbortController()

    /**  @type {number} */
    this.guessedTotalLength = (args?.guessedTotalLength && args?.guessedTotalLength > 0) ? args?.guessedTotalLength : 12000000

    /**  @type {boolean} */
    this.tryWithProxyIfFailed = _.defaultTo(args?.tryWithProxyIfFailed, true)

    /**  @type {boolean} */
    this.forceProxy = _.defaultTo(args?.forceProxy, false)
  }
}

export class DownloadError extends Error {}

/**
 * @readonly @enum {string}
 */
export const DownloadStatusEnum = {
  DOWNLOADING: 'DOWNLOADING',
  FINISHED: 'FINISHED',
  ABORTED: 'ABORTED',
  FAILED: 'FAILED',
}
