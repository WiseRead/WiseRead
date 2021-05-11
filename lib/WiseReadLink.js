import {
  ImagesModeEnum,
  ChapterLink,
} from '~/lib/models'

import _ from 'lodash'

export const WISEREAD_ORIGIN = 'https://wiseread.github.io'
export const CURR_ORIGIN = window?.location?.origin || WISEREAD_ORIGIN
export const MAX_CHAPTER_NAME_LEN = 31
export const MAX_CHAPTERS = 999999

/**
 * @readonly @enum {string}
 */
export const WRParamPosition = {
  ANY: 'any',
  LAST: 'last',
}

/**
 * @typedef {Object} WRParamArgs
 * @property {string} name
 * @property {any} default
 * @property {any[]=} validOptions
 * @property {((value: any) => boolean)=} validator
 * @property {WRParamPosition=} position
 * @property {((value: string, args: *) => any)=} toValue
 */

export class WRParam {
  /**
   * @param {WRParamArgs} args
   */
  constructor (args) {
    /** @type {string} */
    this.name = args.name

    /** @type {any} */
    this.default = args.default

    /** @type {any[]?} */
    this.validOptions = _.defaultTo(args.validOptions, null)

    /** @type {((value: any) => boolean)} */
    this.validator = (value) => true // Default validator always returns true

    if (args.validator) {
      this.validator = args.validator
    }
    else if (this.validOptions) {
      // If there is no validator, check if the value is one of the valid options
      this.validator = (value) => this.validOptions?.includes(value) ?? false
    }

    /** @type {WRParamPosition} */
    this.position = args.position ?? WRParamPosition.ANY

    /** @type {((value: string, args: *) => any)} */
    this.toValue = args.toValue || ((value, args) => value) // By default return the same param string
  }
}

const helpers = {
  /**
   * @param {string} value
   * @return {boolean}
   */
  strToBool (value) {
    return value.toLowerCase() === 'true'
  },

  /**
   * @param {string} value
   * @return {number}
   */
  strToNumber (value) {
    return _.toNumber(value)
  },

  /**
   * Split and remove empty strings
   * @param {string} value
   * @return {string[]}
   */
  strToStringsArray (value) {
    return value.split(',').filter((n) => n)
  },

  /**
   * @param {string} value
   * @return {number[]}
   */
  strToNumbersArray (value) {
    return helpers.strToStringsArray(value).map((n) => _.toNumber(n)).filter((n) => !_.isNil(n))
  },

  /**
   * String to numbers array - only bigger than 0
   * @param {string} value
   * @return {number[]}
   */
  strToNumbersArray_BT0 (value) {
    return helpers.strToNumbersArray(value).filter((n) => n > 0)
  },

  /**
   * @param {string} value
   * @param {*} args
   * @return {string[]}
   */
  downloadStrToLinks (value, args) {
    const encodedValue = encodeURI(value)

    if (!encodedValue) {
      return []
    }
    if ((!args?.dlengths) || (args?.dlengths?.length <= 1)) {
      return [encodedValue]
    }

    const links = []
    const SPLIT_LENGTH = ','.length

    let startIndex = 0
    for (let chapterIndex = 0; chapterIndex < args.dlengths.length; chapterIndex++) {
      const dlength = args.dlengths[chapterIndex]
      const link = encodedValue.substr(startIndex, dlength)
      links.push(link)
      startIndex += dlength + SPLIT_LENGTH
    }

    return links.filter((n) => n)
  },

  /**
   * @param {string?} value
   * @return {boolean}
   */
  isValidChapterName (value) {
    if (value === null) { return false }
    const length = value.trim().length
    // (Chapter name CAN be empty)
    return length <= MAX_CHAPTER_NAME_LEN
  },

  /**
   * @param {number} min
   * @param {number} max
   * @return {(value: number?) => boolean}
   */
  getIsBetweenFunc (min, max) {
    return (value) => {
      if (!_.isNumber(value)) { return false }
      return value >= min && value <= max
    }
  },

  /**
   * @param {string[]?} value
   * @return {boolean}
   */
  areValidChapterNames (value) {
    return value?.every((e) => helpers.isValidChapterName(e)) ?? false
  },

  /**
   * @param {string[]?} value
   * @return {boolean}
   */
  areNeverEmptyStrings (value) {
    return value?.every((e) => e.trim()) ?? false
  },

  /**
   * @param {number[]?} value
   * @return {boolean}
   */
  areBT0 (value) {
    return value?.every((e) => e > 0) ?? false
  },
}

export const WiseReadParams = {
  imode: new WRParam({
    name: 'imode',
    validOptions: Object.values(ImagesModeEnum),
    default: ImagesModeEnum.CONTINUOUS,
  }),
  ltr: new WRParam({
    name: 'ltr',
    validOptions: [true, false],
    default: true,
    toValue: helpers.strToBool,
  }),
  hideInput: new WRParam({
    name: 'hideInput',
    validOptions: [true, false],
    default: false,
    toValue: helpers.strToBool,
  }),
  preloading: new WRParam({
    name: 'preloading',
    validOptions: [0, 1, 2],
    default: 2,
    toValue: helpers.strToNumber,
  }),
  cstart: new WRParam({
    name: 'cstart',
    validator: helpers.getIsBetweenFunc(0, MAX_CHAPTERS),
    default: 0,
    toValue: helpers.strToNumber,
  }),
  chapterNames: new WRParam({
    name: 'chapterNames',
    validator: helpers.areValidChapterNames,
    default: [],
    toValue: helpers.strToStringsArray,
  }),
  dlengths: new WRParam({
    name: 'dlengths',
    validator: helpers.areBT0,
    default: [],
    toValue: helpers.strToNumbersArray_BT0,
  }),
  download: new WRParam({
    name: 'download',
    validator: helpers.areNeverEmptyStrings,
    default: [],
    position: WRParamPosition.LAST,
    toValue: helpers.downloadStrToLinks,
  }),
  configpath: new WRParam({
    name: 'configpath',
    default: '',
    position: WRParamPosition.LAST,
  }),
}

export class WiseReadLink {
  /** @type {ImagesModeEnum} */
  _imode = WiseReadParams.imode.default

  /** @type {boolean} */
  _ltr = WiseReadParams.ltr.default

  /** @type {boolean} */
  _hideInput = WiseReadParams.hideInput.default

  /** @type {number} */
  _preloading = WiseReadParams.preloading.default

  /** @type {number} */
  _cstart = WiseReadParams.cstart.default

  /** @type {string} */
  _configpath = WiseReadParams.configpath.default

  /** @type {ChapterLink[]} */
  _chapterLinks = []

  /**
   * @param {(Object|string)=} inLinkOrObject
   */
  constructor (inLinkOrObject) {
    if (_.isString(inLinkOrObject) || _.isNil(inLinkOrObject)) {
      const inLink = inLinkOrObject ?? ''
      this._imode = this.getParamValueOrDefault(inLink, WiseReadParams.imode)
      this._ltr = this.getParamValueOrDefault(inLink, WiseReadParams.ltr)
      this._hideInput = this.getParamValueOrDefault(inLink, WiseReadParams.hideInput)
      this._preloading = this.getParamValueOrDefault(inLink, WiseReadParams.preloading)
      this._cstart = this.getParamValueOrDefault(inLink, WiseReadParams.cstart)
      this._configpath = this.getParamValueOrDefault(inLink, WiseReadParams.configpath)
      this._chapterLinks = []

      /** @type {string[]} */
      const chapterNames = this.getParamValueOrDefault(inLink, WiseReadParams.chapterNames)

      /** @type {number[]} */
      const dlengths = this.getParamValueOrDefault(inLink, WiseReadParams.dlengths)

      /** @type {string[]} */
      const download = this.getParamValueOrDefault(inLink, WiseReadParams.download, { dlengths })

      if (download.length === chapterNames.length) {
        this._chapterLinks = download.map((d, index) => new ChapterLink({ link: d, name: chapterNames[index] }))
      }
      else {
        this._chapterLinks = download.map((d) => new ChapterLink({ link: d, name: '' }))
      }
    }
    else if (_.isObject(inLinkOrObject)) {
      for (const paramName in this) {
        const trimParamName = _.trimStart(paramName, '_')
        if (_.has(inLinkOrObject, trimParamName)) {
          // chapterLinks can be array of {name, link}, then we map it to ChapterLink objects
          if (trimParamName === 'chapterLinks') {
            // @ts-ignore
            this._chapterLinks = inLinkOrObject.chapterLinks.map((c) => new ChapterLink(c))
          }
          else {
            this[paramName] = inLinkOrObject[trimParamName]
          }
        }
      }
    }
  }

  /** @return {ImagesModeEnum} */
  get imode () { return this._imode }

  /** @return {boolean} */
  get ltr () { return this._ltr }

  /** @return {boolean} */
  get hideInput () { return this._hideInput }

  /** @return {number} */
  get preloading () { return this._preloading }

  /** @return {number?} */
  get cstart () {
    if (this._configpath) {
      return this._cstart
    }

    if (this.chapterLinks.length === 0) {
      return WiseReadParams.cstart.default
    }

    if (this._cstart < 0 || this._cstart >= this.chapterLinks.length) {
      return null
    }

    return this._cstart
  }

  /** @return {string} */
  get configpath () { return this._configpath }

  /** @return {ChapterLink[]} */
  get chapterLinks () { return this._chapterLinks.map((e) => e.trim()).filter((e) => e.link) }

  /** @return {string[]} */
  get chapterNames () {
    const names = this.chapterLinks.map((c) => c.name)

    // If no empty name return the names
    if (names.every((e) => e)) {
      return names
    }
    // Else ignore names
    else {
      return []
    }
  }

  /** @return {string[]} */
  get download () {
    return this.configpath
      ? []
      : this.chapterLinks.map((c) => c.link)
  }

  /** @return {number[]} */
  get dlengths () {
    // If ignore if empty or one
    if (this.download.length <= 1) {
      return []
    }

    return this.download.map((d) => d.length)
  }

  /**
   * @param {string} wrLink
   * @param {WRParam} wrParam
   * @param {any=} args
   * @return {any}
   */
  getParamValueOrDefault (wrLink, wrParam, args) {
    if (!wrParam) {
      throw new Error(`Param not exists (${wrParam})`)
    }

    try {
      const paramValueStr = this.getParamStr(wrLink, wrParam)

      if (paramValueStr) {
        const paramValue = wrParam.toValue(paramValueStr, args)

        if (wrParam.validator(paramValue)) {
          return paramValue
        }
      }
    }
    catch (err) {}

    return wrParam.default
  }

  /**
   * @param {string} wrLink
   * @param {WRParam} wrParam
   * @return {string?}
   */
  getParamStr (wrLink, wrParam) {
    let paramValueStr = null

    try {
      const url = new URL(wrLink)
      if (WRParamPosition.ANY) {
        paramValueStr = url.searchParams.get(wrParam.name)
      }
      else {
        // Get last param
        const fullParamName = `${wrParam.name}=`
        const paramIndex = url.search.indexOf(fullParamName)

        if (paramIndex >= 0) {
          paramValueStr = url.search.slice(paramIndex + fullParamName.length)
        }
      }
    }
    catch (err) {}

    return paramValueStr || null
  }

  /**
   * @param {string[]=} dontIgnoreDefaults - For each param, if the value is equal
   *    to the default value it's ignored, except for those
   *    in dontIgnoreDefaults.
   *    By default, only 'imode' and 'hideInput' are not ignored.
   *
   * @return {string}
   */
  toLink (dontIgnoreDefaults = [
    WiseReadParams.imode.name,
    WiseReadParams.hideInput.name,
  ]) {
    const url = new URL(WISEREAD_ORIGIN)

    for (const paramName in WiseReadParams) {
      /** @type {WRParam} */
      const param = WiseReadParams[paramName]
      const paramValue = this[paramName] // Using the 'get' function of each param

      if (!_.isNil(paramValue) &&
          (dontIgnoreDefaults.includes(paramName) || !_.isEqual(paramValue, param.default)) &&
          param.validator(paramValue)) {
        url.searchParams.append(paramName, paramValue)
      }
    }

    const withoutLastSlash = _.trimEnd(url.href, '/')
    return decodeURIComponent(withoutLastSlash)
  }

  /**
   * Check if any validator failed.
   * Return the failure message or empty string if everything was OK
   * @return {string}
   */
  checkValidators () {
    for (const paramName in WiseReadParams) {
      /** @type {WRParam} */
      const param = WiseReadParams[paramName]
      const paramValue = this[paramName]

      if (!param.validator(paramValue)) {
        return `'${paramName}' is illegal`
      }
    }

    // More special validations:
    if (this.configpath && this.download.length > 0) {
      return "Use 'configpath' or 'download' but no both"
    }

    return ''
  }
}
