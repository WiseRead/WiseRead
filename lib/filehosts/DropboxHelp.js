import { Dropbox } from 'dropbox'

const DROPBOX_HOST = 'www.dropbox.com'
const DROPBOX_DIRECT_LINK_HOST = 'dl.dropboxusercontent.com'

/**
 * @typedef {Object} DropboxFileInfo
 * @property {string=} originalFolderLink
 * @property {string} id
 * @property {string} name
 * @property {string} relPath
 */

const DropboxHelp = {
  /**
   * @param {string} link - Dropbox sharing link
   * @return {string}
   */
  getFileNameFromLink (link) {
    try {
      const url = new URL(link)
      if (url.pathname && url.host.includes('dropbox')) {
        const dPathname = decodeURI(url.pathname)
        const lastIndexOfSlash = dPathname.lastIndexOf('/')
        const filename = dPathname.substring(lastIndexOfSlash + 1)
        return filename
      }
    }
    catch (err) {}
    return ''
  },

  /**
   * @param {string} link
   * @return {string}
   */
  convertShareLinkToDirectLink (link) {
    try {
      const url = new URL(link)
      url.host = DROPBOX_DIRECT_LINK_HOST
      return url.href
    }
    catch (error) {
      return link
    }
  },

  /**
   * @param {string} link
   * @return {boolean}
   */
  isDropboxHost (link) {
    try {
      const url = new URL(link)
      return url.host === DROPBOX_HOST || url.host === DROPBOX_DIRECT_LINK_HOST
    }
    catch (error) {
      return false
    }
  },

  /**
   * @param {string} folderLink
   * @param {string} accessToken
   * @param {((filename: string) => boolean)=} fileFilterFunc
   * @return {Promise<DropboxFileInfo[]>}
   */
  async getFilesInfoFromDropboxFolder (
    folderLink,
    accessToken,
    fileFilterFunc = (filename) => true
  ) {
    /** @type {DropboxFileInfo[]} */
    const filesInfo = []
    let cursor = ''

    const dbx = new Dropbox({ accessToken: accessToken })
    let response = await dbx.filesListFolder({ path: '', shared_link: { url: folderLink } })
    const allEntries = response.result.entries

    // Paginate through all files of big folder
    while (response.result.has_more) {
      cursor = response.result.cursor
      response = await dbx.filesListFolderContinue({ cursor })
      const entries = response.result.entries
      allEntries.push(...entries)
    }

    for (const entry of allEntries) {
      if (entry['.tag'] === 'file' && entry.is_downloadable) {
        // Filter by file name
        if (fileFilterFunc(entry.name)) {
          filesInfo.push({
            originalFolderLink: folderLink,
            id: entry.id,
            name: entry.name,
            relPath: `/${entry.name}`, // only support root files for now
          })
        }
      }
    }

    return filesInfo
  },

  /**
   * @param {DropboxFileInfo} fileInfo
   * @param {string} accessToken
   * @return {Promise<string>}
   */
  async getDownloadLinkFromSharedFile (fileInfo, accessToken) {
    const dbx = new Dropbox({ accessToken: accessToken })

    /**
     * Bad alternative (Only work for user's file):
     * return (await dbx.filesGetTemporaryLink({ path: fileInfo.id })).result.link
     *
     * Good alternative (But download blob instead of only returning the download link):
     * const response = await dbx.sharingGetSharedLinkFile({ url: fileInfo.originalFolderLink || '', path: fileInfo.relPath })
     * if (response.result['.tag'] === 'file') { return response.result.fileBlob }
     */
    const response = await dbx.sharingGetSharedLinkMetadata({
      url: fileInfo.originalFolderLink || '',
      path: fileInfo.relPath
    })

    if (response.result['.tag'] === 'file') {
      const sharedLinkUrl = response.result.url // like: 'https://www.dropbox.com/sh/example.zip?dl=0'
      const directLink = DropboxHelp.convertShareLinkToDirectLink(sharedLinkUrl)
      return directLink
    }

    throw new Error("Can't get download link from shared file")
  },
}

export default DropboxHelp
