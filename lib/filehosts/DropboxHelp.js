const DROPBOX_HOST = 'www.dropbox.com'
const DROPBOX_DIRECT_LINK_HOST = 'dl.dropboxusercontent.com'

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
}

export default DropboxHelp
