const DomUtils = {
  /**
   * See https://stackoverflow.com/a/58734857
   * @param {string} textToCopy
   * @return {void}
   */
  copyTextToClipboard (textToCopy) {
    const el = document.createElement('textarea')
    el.value = textToCopy
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const s = document.getSelection()?.rangeCount
    const selected = (document.getSelection()?.rangeCount ?? 0) > 0 ? document.getSelection()?.getRangeAt(0) : false
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
      document.getSelection()?.removeAllRanges()
      document.getSelection()?.addRange(selected)
    }
  },

  openFullscreen () {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      elem.requestFullscreen()
    }
    else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen()
    }
    else if (elem.webkitRequestFullscreen) { /* Safari */
    // @ts-ignore
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }
    else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen()
    }
  },

  closeFullscreen () {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
    else if (document.mozExitFullScreen) {
      document.mozExitFullScreen()
    }
    else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen()
    }
    else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen()
    }

    if (document.cancelFullScreen) {
      document.cancelFullScreen()
    }
    else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    }
    else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    }
  },

  isFullscreen () {
    if (document.fullScreenElement && document.fullScreenElement !== null) {
      return true
    }
    if (document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen || document.msFullscreenElement) {
      return true
    }
    return false
  }
}

export default DomUtils
