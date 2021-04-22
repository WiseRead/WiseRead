import Vue from 'vue'
import { ComicSource, CSLoadingLiveData } from '~/lib/ComicSource'
import {
  ImagesModeEnum,
  Chapter,
} from '~/lib/models'

import _ from 'lodash'

const MB = 1024 * 1024
const MAX_STORAGE = MB * 900

export const state = () => ({
  /** @type {string} */
  imagesMode: ImagesModeEnum.CONTINUOUS,

  /** @type {boolean} */
  isLTR: true,

  /** @type {boolean} */
  showTopBlock: true,

  /** @type {number} */
  preloadingNumber: 2,

  /** @type {Chapter[]} */
  chapters: [],

  /** @type {number} */
  currChapterIndex: 0,

  /** @type {number} */
  currLoadingId: 0,

  /** @type {number} */
  firstLoadingIdOfSource: 0,

  /** @type {((comicSource: ComicSource, err: Error, loadingId: number, index: number) => void)} */
  onChapterLoadingError: (comicSource, err, loadingId, index) => {},

  /** @type {string} */
  currImageName: '',
})

export const getters = {
  /**
   * @return {Chapter?}
   */
  currChapter: (state) => {
    if (state.currChapterIndex < state.chapters.length) {
      return state.chapters[state.currChapterIndex]
    }

    return null
  },

  /**
   * @return {string}
   */
  currChapterName: (state, getters) => {
    return getters.currChapter?.chapterInfo.chapterName ?? 'Chapter ?'
  },

  /**
   * @return {string}
   */
  currDownloadPercent: (state, getters) => {
    const percent = getters.currChapter?.chapterInfo.downloadPercent
    return _.isNil(percent) ? 0 : percent
  },

  /**
   * @return {string[]}
   */
  chaptersNames: (state) => {
    return state.chapters.map((c) => c.chapterInfo.chapterName)
  },

  /**
   * @return {boolean}
   */
  areImagesDisplayed: (state, getters) => {
    return getters.currChapter?.images?.length > 0
  }
}

export const mutations = {

  // * imagesMode: *

  /**
   * @param {*} state
   * @param {{imagesMode: ImagesModeEnum}} param1
   */
  setImagesMode (state, { imagesMode }) {
    if (Object.values(ImagesModeEnum).includes(imagesMode)) {
      state.imagesMode = imagesMode
    }
  },

  // * isLTR: *

  /**
   * @param {*} state
   * @param {{isLTR: boolean}} param1
   */
  setIsLTR (state, { isLTR }) {
    state.isLTR = Boolean(isLTR)
  },

  // * showTopBlock: *

  /**
   * @param {*} state
   * @param {{showTopBlock: boolean}} param1
   */
  setShowTopBlock (state, { showTopBlock }) {
    state.showTopBlock = Boolean(showTopBlock)
  },

  // * preloadingNumber: *

  /**
   * @param {*} state
   * @param {{preloadingNumber: number}} param1
   */
  setPreloadingNumber (state, { preloadingNumber }) {
    if (preloadingNumber < 0) {
      return
    }

    state.preloadingNumber = _.toNumber(preloadingNumber)
  },

  // * Chapters: *

  /**
   * @param {*} state
   * @param {{
   * newFunc: ((comicSource: ComicSource, err: Error, loadingId: number, index: number) => void)?
   * }} param1
   */
  setOnChapterLoadingErrorFunction (state, { newFunc }) {
    if (newFunc) {
      state.onChapterLoadingError = newFunc
    }
    else {
      state.onChapterLoadingError = () => {}
    }
  },

  increaseLoadingId (state) {
    state.currLoadingId += 1
  },

  /**
   * @param {*} state
   * @param {{
   * chapters: Chapter[],
   * }} param1
   */
  updateChapters (state, { chapters }) {
    if (chapters) {
      state.chapters = chapters.map((c) => c.clone())
    }
    else {
      state.chapters = []
    }

    state.currChapterIndex = 0
    state.firstLoadingIdOfSource = state.currLoadingId + 1
  },

  /**
   * Each stream use this function to update its loaded chapter
   *
   * @param {*} state
   * @param {{
   * loadingId: number,
   * chapterIndex: number,
   * newChapter: Chapter,
   * }} param1
   */
  updateLoadedChapter (state, { loadingId, chapterIndex, newChapter }) {
    if (chapterIndex < 0 || chapterIndex >= state.chapters.length) {
      return
    }

    const chapterAtIndex = state.chapters[chapterIndex]
    const fromCurrSource = loadingId >= state.firstLoadingIdOfSource
    const isActive = chapterIndex === state.currChapterIndex && loadingId === state.currLoadingId

    // Only if the loading is still active
    if (fromCurrSource &&
      (!newChapter.images || isActive) &&
      !_.isEqual(newChapter, chapterAtIndex)) {
      const chapterClone = newChapter.clone()
      mutations.updateChapterAtIndex(state, { newChapter: chapterClone, index: chapterIndex })
    }
  },

  /**
   * @param {*} state
   * @param {{
   * newChapter: Chapter,
   * index: number
   * }} param1
   */
  replaceChapterAtIndex (state, { newChapter, index }) {
    if (index < 0 || index >= state.chapters.length) {
      return
    }

    Vue.set(state.chapters, index, newChapter)
  },

  /**
   * @param {*} state
   * @param {{
   * newChapter: Chapter,
   * index: number
   * }} param1
   */
  updateChapterAtIndex (state, { newChapter, index }) {
    if (index < 0 || index >= state.chapters.length) {
      return
    }

    state.chapters[index].updateAll(newChapter)
  },

  /**
   * @param {*} state
   * @param {{
   * index: number,
   * isLoadingError: boolean
   * }} param1
   */
  updateChapterAtIndex_IsLoadingError (state, { index, isLoadingError }) {
    if (index < 0 || index >= state.chapters.length) {
      return
    }
    state.chapters[index].chapterInfo.updateIsLoadingError(isLoadingError)
  },

  /**
   * @param {*} state
   * @param {{ index: number }} param1
   */
  updateCurrChapterIndex (state, { index }) {
    if (index < 0 || index >= state.chapters.length) {
      return
    }
    state.currChapterIndex = index
  },

  // * currImageName: *

  /**
   * @param {*} state
   * @param {{ name: string }} param1
   */
  updateCurrImageName (state, { name }) {
    state.currImageName = name
  },
}

export const actions = {
  /**
   * @param {*} context
   * @param {{
   * comicSource: ComicSource,
   * onChapterLoadingError: ((comicSource: ComicSource, err: Error, loadingId: number, index: number) => void)?,
   * }} param1
   */
  async initChaptersAndLoadFirstAsync (
    { state, commit, dispatch, getters }, {
      comicSource,
      onChapterLoadingError = null,
    }) {
    commit('setOnChapterLoadingErrorFunction', { newFunc: onChapterLoadingError })
    this.$comicSource.updateSource(comicSource)
    const streams = await comicSource.loadChaptersStreamsAsync()

    if (streams) {
      const tempChapters = streams.map((s) => s.streamedChapter)
      commit('updateChapters', { chapters: tempChapters })
      await dispatch('moveToChapterAtIndexAsync', { index: 0 })
    }
  },

  /**
   * @param {*} context
   */
  async loadCurrChapterFromSourceAsync ({ state, dispatch }) {
    await dispatch('loadChapterAtIndexFromSourceAsync', { chapterIndex: state.currChapterIndex })
  },

  /**
   * @param {*} context
   * @param {{
   * chapterIndex: number,
   * }} param1
   */
  async loadChapterAtIndexFromSourceAsync ({ state, commit }, { chapterIndex }) {
    if (chapterIndex < 0 || chapterIndex >= state.chapters.length) {
      return
    }

    // eslint-disable-next-line no-console
    console.log(`Start loading chapter at index ${chapterIndex}`)

    commit('increaseLoadingId')
    const startLoadingId = state.currLoadingId

    /** @type {ComicSource} */
    const comicSource = this.$comicSource.source

    const chapterStream = comicSource.getChapterStreamAtIndex(chapterIndex)

    try {
      const chapter = await chapterStream.load(new CSLoadingLiveData({
        updateChapterFunc: (newChapter) => {
          commit('updateLoadedChapter', {
            loadingId: startLoadingId,
            chapterIndex: chapterIndex,
            newChapter: newChapter
          })
        },
        getChapterIndex: () => chapterIndex,
      }))
    }
    catch (err) {
      state.onChapterLoadingError(comicSource, err, startLoadingId, chapterIndex)
    }
  },

  async moveToNextChapterAsync ({ state, dispatch }) {
    await dispatch('moveToChapterAtIndexAsync', { index: state.currChapterIndex + 1 })
  },

  async moveToPreviousChapterAsync ({ state, dispatch }) {
    await dispatch('moveToChapterAtIndexAsync', { index: state.currChapterIndex - 1 })
  },

  async moveToChapterAtIndexAsync ({ state, commit, dispatch, getters }, { index }) {
    if (index < 0 || index >= state.chapters.length) {
      return
    }

    /** @type {ComicSource} */
    const comicSource = this.$comicSource.source
    const firstLoadingIdOfSource = state.firstLoadingIdOfSource

    commit('updateChapterAtIndex_IsLoadingError', { index, isLoadingError: false })
    commit('updateCurrChapterIndex', { index })

    // Load curr chapter if not loaded yet
    if (getters.currChapter?.isPending()) {
      // Abort all chapters except the current
      comicSource.abortStreamsUnderIndex(index - 1)
      comicSource.abortStreamsAboveIndex(index + 1)

      // Free chapters if missing space
      if (this.$comicSource.source.getLoadedSize() > MAX_STORAGE) {
        comicSource.freeStreamsUnderIndex(index - 1)
        comicSource.freeStreamsAboveIndex(index + 2)
      }

      await dispatch('loadCurrChapterFromSourceAsync')
    }

    // Loading next chapter
    if (state.preloadingNumber >= 1 &&
      index === state.currChapterIndex && // If still the same chapter index
      firstLoadingIdOfSource === state.firstLoadingIdOfSource && // If active source
      index < state.chapters.length - 1 && // If there is next chapter
      this.$comicSource.source.getLoadedSize() < MAX_STORAGE) { // If MAX_STORAGE limit not reached
      await dispatch('loadChapterAtIndexFromSourceAsync', { chapterIndex: index + 1 })
    }

    // Loading next-next chapter
    if (state.preloadingNumber >= 2 &&
      index === state.currChapterIndex && // If still the same chapter index
      firstLoadingIdOfSource === state.firstLoadingIdOfSource && // If active source
      index > 0 && // If not first chapter (To save traffic before the user navigated)
      index < state.chapters.length - 2 && // If there is next-next chapter
      this.$comicSource.source.getLoadedSize() < MAX_STORAGE) { // If MAX_STORAGE limit not reached
      await dispatch('loadChapterAtIndexFromSourceAsync', { chapterIndex: index + 2 })
    }
  },
}
