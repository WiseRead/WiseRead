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
}

export default DomUtils
