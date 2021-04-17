import { FileBlob } from '~/lib/models'
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
