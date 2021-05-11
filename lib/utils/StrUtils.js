import _ from 'lodash'

/**
 * @readonly @enum {string}
 */
export const UnicodeEnum = {
  LTR_MARK: '\u{200E}'
}

// See https://stackoverflow.com/a/11059122
const lastNumberMatcher = /[0-9]+(?!.*[0-9])/

export const StrUtils = {
  /**
   * Get last number found in string.
   * Return `undefined` if not found.
   * @param {string} str
   * @return {string | undefined}
   */
  getLastNumber (str) {
    return str.match(lastNumberMatcher)?.[0]
  },

  /**
   * See https://stackoverflow.com/a/11059122
   * @param {string} str
   * @return {string}
   */
  incrementLastNumber (str) {
    return str.replace(lastNumberMatcher, function (match) {
      const strNewNum = `${parseInt(match, 10) + 1}`
      return _.padStart(strNewNum, match.length, '0') // if match is '001' return '002', no '2'
    })
  },

  /**
   * See https://stackoverflow.com/a/28813213
   * @param {string} str
   * @return {boolean}
   */
  hasNumber (str) {
    return /\d/.test(str)
  },

  /**
   * @param {string} str
   * @return {string}
   */
  addLtrToString (str) {
    return `${UnicodeEnum.LTR_MARK}${str}`
  },

  /**
   * See https://stackoverflow.com/a/43467144
   * @param {string} str
   * @return {boolean}
   */
  isValidHttpUrl (str) {
    try {
      const url = new URL(str)
      return url.protocol === 'http:' || url.protocol === 'https:'
    }
    catch (err) {
      return false
    }
  },
}
