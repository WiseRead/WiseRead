import _ from 'lodash'
import { FileBlob } from '~/lib/models'
import { unzip } from 'unzipit'
import * as libarchive from 'libarchive.js/main.js'
const JSZip = require('jszip')

export class Archive {
  /**
   * @param {Blob} blobFile
   */
  constructor (blobFile) {
    this.blobFile = blobFile
    this.zip = new JSZip()
  }

  /**
   * @return {Promise<FileBlob[]>}
   */
  async extract () {
    const extractFunctions = [
      this.extractByJSZip,
      this.extractByUnzipit,
      this.extractByLibarchive,
    ].map((f) => _.bind(f, this))
    let lastError = new ArchiveError(ArchiveErrorTypeEnum.LOADING_FAILURE)

    for (const extractFunc of extractFunctions) {
      try {
        const zipEntriesList = await extractFunc()
        if (zipEntriesList && zipEntriesList.length > 0) {
          return zipEntriesList
        }
      }
      catch (err) {
        lastError = err
      }
    }

    throw lastError
  }

  /**
   * @return {Promise<FileBlob[]>}
   */
  async extractByJSZip () {
    try {
      // Load zip
      const zipContent = await this.zip.loadAsync(this.blobFile)

      /** @type {FileBlob[]} */
      const zipEntriesList = []
      const promisesArr = []

      // Load each file in the zip
      zipContent.forEach(function (relativePath, zipEntry) {
        const asyncBlob = zipContent.files[relativePath].async('blob')
        promisesArr.push(asyncBlob)
        asyncBlob.then(function (data) {
          zipEntriesList.push(new FileBlob({ data: data, name: relativePath }))
        })
      })

      // Wait for all files
      try {
        await Promise.all(promisesArr)
      }
      catch (err) {
        throw new ArchiveError(ArchiveErrorTypeEnum.EXTRACTION_FAILURE)
      }

      return zipEntriesList
    }
    catch {
      throw new ArchiveError(ArchiveErrorTypeEnum.LOADING_FAILURE)
    }
  }

  /**
   * See https://github.com/greggman/unzipit
   * @return {Promise<FileBlob[]>}
   */
  async extractByUnzipit () {
    try {
      /** @type {FileBlob[]} */
      const zipEntriesList = []

      const { entries } = await unzip(this.blobFile)

      for (const [name, entry] of Object.entries(entries)) {
        const blob = await entry.blob()
        zipEntriesList.push(new FileBlob({ name: name, data: blob }))
      }

      return zipEntriesList
    }
    catch {
      throw new ArchiveError(ArchiveErrorTypeEnum.LOADING_FAILURE)
    }
  }

  /**
   * NOTE: public 'dep/libarchive.js/worker-bundle.js' is required
   * See https://github.com/nika-begiashvili/libarchivejs
   * @return {Promise<FileBlob[]>}
   */
  async extractByLibarchive () {
    const workerUrl = 'dep/libarchive.js/worker-bundle.js'

    try {
      /** @type {FileBlob[]} */
      const zipEntriesList = []

      libarchive.Archive.init({
        workerUrl: workerUrl
      })

      const archive = await libarchive.Archive.open(this.blobFile)
      const filesArray = await archive.getFilesArray()

      for (const f of filesArray) {
        const extractedFile = await f.file.extract()
        zipEntriesList.push(new FileBlob({ name: extractedFile.name, data: extractedFile }))
      }

      return zipEntriesList
    }
    catch {
      throw new ArchiveError(ArchiveErrorTypeEnum.LOADING_FAILURE)
    }
  }
}

export class ArchiveError extends Error {
  /**
   * @param {ArchiveErrorTypeEnum} type
   */
  constructor (type) {
    super()
    this.archiveErrorType = type
  }
}

/**
 * @readonly @enum {string}
 */
export const ArchiveErrorTypeEnum = {
  LOADING_FAILURE: 'LOADING_FAILURE',
  EXTRACTION_FAILURE: 'EXTRACTION_FAILURE',
}
