import { Dropbox } from 'dropbox'

const DROPBOX_HOST = 'www.dropbox.com'
const DROPBOX_DIRECT_LINK_HOST = 'dl.dropboxusercontent.com'

/**
 * @typedef {Object} FileLink
 * @property {string} link
 * @property {string} fileName
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
   * @return {Promise<FileLink[]>}
   */
  async getFileLinksFromDropboxFolder (folderLink, accessToken) {
    const fileLinks = []

    const dbx = new Dropbox({ accessToken: accessToken })
    const response = await dbx.filesListFolder({ path: '', shared_link: { url: folderLink } })
    const entries = response.result.entries
    // TODO: handle big folder with dbx.filesListFolderContinue

    for (const entry of entries) {
      if (entry['.tag'] === 'file' && entry.is_downloadable) {
        const downloadLinkResponse = await dbx.filesGetTemporaryLink({ path: entry.id })
        const fileDownloadLink = downloadLinkResponse.result.link
        // TODO: filter by file extension
        fileLinks.push({ link: fileDownloadLink, fileName: entry.name })
      }
    }

    return fileLinks
  }
}

export default DropboxHelp
