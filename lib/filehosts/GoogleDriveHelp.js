const GOOGLE_DRIVE_HOST = 'drive.google.com'

const GoogleDriveHelp = {
  /**
   * See https://www.wonderplugin.com/online-tools/google-drive-direct-link-generator/
   *
   * @param {string} link - Google Drive sharing link (or direct link)
   * @param {string=} googleDriveApiKey - If the file size is smaller than 100MB,
   *  the Google Drive API key is optional.
   *  If the file size is larger than 100MB, instead of downloading the file,
   *  Google will display a "too large for Google to scan for virus" warning.
   *  To bypass the warning, you need a Google Drive API key.
   *
   * @return {string}
   */
  convertShareLinkToDirectLink (link, googleDriveApiKey) {
    try {
      const sharingUrl = link.trim()

      if (!sharingUrl) {
        throw new Error('Empty link')
      }

      let googleId = ''
      let regexp = /https:\/\/drive\.google\.com\/file\/d\/(.*?)\/(edit|view)\?usp=sharing/
      let match = sharingUrl.match(regexp)

      if (match && match.length >= 2) {
        googleId = match[1]
      }
      else {
        regexp = /https:\/\/drive\.google\.com\/open\?id=(.*?)$/
        match = sharingUrl.match(regexp)

        if (match && match.length >= 2) {
          googleId = match[1]
        }
      }

      if (!googleId) {
        throw new Error('Not a valid Google Drive sharing link')
      }

      const cleanGoogleDriveApiKey = googleDriveApiKey?.trim()
      let directLink = ''

      if (cleanGoogleDriveApiKey) {
        directLink = `https://www.googleapis.com/drive/v3/files/${googleId}?alt=media&key=${cleanGoogleDriveApiKey}`
      }
      else {
        directLink = `https://drive.google.com/uc?export=download&id=${googleId}`
      }

      return directLink
    }
    catch (error) {
      return link
    }
  },

  /**
   * @param {string} link
   * @return {boolean}
   */
  isGoogleDriveHost (link) {
    try {
      const url = new URL(link)
      return url.host === GOOGLE_DRIVE_HOST
    }
    catch (error) {
      return false
    }
  },
}

export default GoogleDriveHelp
