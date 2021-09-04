<template>
  <div class="page manage-link-page">
    <h1>{{ title }}</h1>
    Create or edit your WiseRead Link. Select settings and add chapters.
    <div class="pt-3 pb-10 mb-10 border-b-2 border-separator-color">
      <h2>Edit old link</h2>
      <div>
        Enter WiseRead link you want to edit (Ignore if you want to create new link):
        <div class="flex" style="margin-top: 0.2rem;">
          <input
            v-model.trim="initialLink"
            type="text"
            placeholder="Old link"
            class="link-input"
          />
          <button v-wave class="btn ml-3" @click="enterInitialLink()">Enter</button>
        </div>
      </div>
    </div>
    <div>
      <h2>Images</h2>
      <div>
        Images mode:
        <select v-model="wrLink._imode" class="select mt-1">
          <option v-for="option in imagesModeOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <h2>Direction</h2>
      <div>
        Navigation direction:
        <select v-model="wrLink._ltr" class="select mt-1">
          <option v-for="option in ltrOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div>
      <h2>Page</h2>
      <div>
        Layout:
        <select v-model="wrLink._hideInput" class="select mt-1">
          <option v-for="option in hideInputOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="mt-12 border-l-4 pl-5 dark:border-gray-700">
      <h2 class="tracking-wider opacity-50">Advanced:</h2>
      <div>
        <h2>Network</h2>
        <div>
          Number of chapters to be pre-loaded (download next chapters while reading):
          <select v-model="wrLink._preloading" class="select mt-1">
            <option v-for="option in preloadingOptions" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <h2 class="custom mt-14">Chapters</h2>
      <div>
        <RadioGroup
          v-model="selectedChaptersInputMode"
          :options="Object.values(enum_ChaptersInputMode)"
          class="radio-group mt-5"
        />
      </div>

      <div v-if="selectedChaptersInputMode === enum_ChaptersInputMode.CHAPTER_LIST">
        <transition-group name="flip-list" class="divide-y-2 chapters-list" tag="div">
          <div
            v-for="(chapter, index) in chapterLinks"
            :id="'chapter-item-' + index"
            :key="chapter.id"
            class="flip-list-item"
          >
            <div class="chapter-area" :class="{'cstart-here': index + 1 === cstart}">
              <div class="flex items-center space-x-4 mb-2">
                <div class="flex pr-3 border-r border-gray-600">
                  <div class="relative"><div class="cstart-here-arrow"><IconRightArrow /></div></div>
                  <div class="chapter-number">{{ index + 1 }}</div>
                </div>
                <div title="Delete">
                  <IconTrashAlt
                    :class="[chapterLinks.length <= 1 ? 'click-disabled opacity-50' : '']"
                    class="chapter-icon click-icon text-red-800 dark:text-red-700"
                    style="margin-bottom: 0.08rem; padding: 0.044rem;"
                    @click="deleteChapter(index)"
                  />
                </div>
                <div title="Move up">
                  <IconArrowCircleUp
                    :class="[index === 0 ? 'click-disabled opacity-50' : '']"
                    class="chapter-icon click-icon regular-icon"
                    @click="swapChapters(index, index - 1)"
                  />
                </div>
                <div title="Move down">
                  <IconArrowCircleDown
                    :class="[index >= chapterLinks.length - 1 ? 'click-disabled opacity-50' : '']"
                    class="chapter-icon click-icon regular-icon"
                    @click="swapChapters(index, index + 1)"
                  />
                </div>
              </div>
              <input
                v-model.trim="chapter.name"
                type="text"
                placeholder="Chapter name"
                :class="{'bad-input': !checkChapterName(index).isLegal}"
                class="input my-1"
              />
              <span v-if="areChapterNamesRequired" class="ml-2 opacity-100 select-none">(Required)</span>
              <span v-else class="ml-2 opacity-75 select-none">(Optional)</span>
              <input
                v-model.trim="chapter.link"
                type="url"
                placeholder="https://example.com/files/chapter.cbz"
                :class="{'bad-input': !checkChapterLink(index).isLegal}"
                class="link-input"
              />
            </div>
          </div>
        </transition-group>
        <button
          v-wave
          class="font-medium text-xl flex items-center rounded-xl p-1 focus:outline-none"
          @click="addChapter()"
        >
          <IconPlusCircle class="inline mr-2" style="width: 1.57rem;" />Add chapter
        </button>
      </div>
      <div v-else-if="selectedChaptersInputMode === enum_ChaptersInputMode.CONFIG_FILE">
        <div class="mt-5">
          <div class="mb-8 blockquote">
            Config file is an external file with chapters and settings.
            <br />
            <NuxtLink to="/doc/config-file">Read more ></NuxtLink>
            <br />
          </div>
          Enter config link/id:
          <input
            v-model.trim="configpathValue"
            type="text"
            placeholder="Link or id"
            class="link-input mt-5"
          />

          <div class="mt-5">
            Config type:
            <select v-model="selectedConfigpathType" class="select mt-1">
              <option v-for="option in configpathTypeOptions" :key="option.value" :value="option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div
        v-if="chapterLinks.length > 1 || (cstart != '') || selectedChaptersInputMode === enum_ChaptersInputMode.CONFIG_FILE"
        id="cstartArea"
        class="mt-8 mb-2 pt-3 border-t-2 border-separator-color"
      >
        From which chapter to start:
        <div>
          <input
            v-model.number="cstart"
            class="input my-1 w-16"
            :class="{'bad-input': !checkCStart().isLegal}"
            type="number"
            min="1"
            :max="maxCStart"
          />
          <span class="ml-2 opacity-75 select-none">(Optional, first chapter by default)</span>
        </div>
      </div>
    </div>

    <div class="output-height"></div>

    <div class="output-height fixed bottom-0 left-0 right-0 rounded-t-2xl output-bg-color">
      <div class="output page-x-padding">
        <div class="flex justify-between items-center mx-2 select-none">
          <div class="output-title">
            Final link:
            <span v-show="!isLegalState" class="output-error-msg">
              <span v-if="!getProblem.elementId">({{ getProblem.message }})</span>
              <span v-else class="underline cursor-pointer" @click="scrollToElement(getProblem.elementId)">
                ({{ getProblem.message }})
              </span>
            </span>
          </div>
          <button
            v-wave="{ duration: 0.3, initialOpacity: 0.2, finalOpacity: 0.35 }"
            class="output-copy-btn"
            @click="copyOutputLink()"
          >
            Copy
          </button>
        </div>
        <input
          v-model="outputLink"
          type="text"
          placeholder="Your final link"
          :class="{'bad-input': !isLegalState}"
          class="link-input"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script>
// @ts-ignore
import IconPlusCircle from '@/assets/icons/plus-circle.svg?inline'
// @ts-ignore
import IconTrashAlt from '@/assets/icons/trash-alt.svg?inline'
// @ts-ignore
import IconArrowCircleDown from '@/assets/icons/arrows/arrow-circle-down.svg?inline'
// @ts-ignore
import IconArrowCircleUp from '@/assets/icons/arrows/arrow-circle-up.svg?inline'
// @ts-ignore
import IconRightArrow from '@/assets/icons/arrows/arrowhead-right-outline.svg?inline'

import { ChapterLink, ImagesModeEnum } from '~/lib/models'
import { ConfigpathType } from '~/lib/Configpath'
import { WiseReadLink, WiseReadParams, splitParamToTypeValue, WISEREAD_ORIGIN, MAX_CHAPTER_NAME_LEN } from '~/lib/WiseReadLink'
import { VArray } from '~/lib/utils/VArray'
import { StrUtils } from '~/lib/utils/StrUtils'
import DomUtils from '~/lib/utils/DomUtils'

import Vue from 'vue'
import _ from 'lodash'

/**
 * @readonly @enum {string}
 */
const enum_ChaptersInputMode = {
  CHAPTER_LIST: 'Chapter List',
  CONFIG_FILE: 'Config File',
}

class FailureReport {
  /**
   * @param {{
   * message: string,
   * elementId: string | undefined,
   * }} param0
   */
  constructor ({ message, elementId }) {
    this.message = message
    this.elementId = elementId
  }

  /**
   * Is the reported chapter legal
   * @return {boolean}
   */
  get isLegal () {
    return this.message === ''
  }
}

class ChapterReport {
  constructor (area = '', message = '', data = {}) {
    this.area = area
    this.message = message
    this.data = data

    /** @type {number?} */
    this.index = null
  }

  /**
   * Is the reported chapter legal
   * @return {boolean}
   */
  get isLegal () {
    return this.area === '' && this.message === ''
  }

  /**
   * @param {object} newData
   * @return {ChapterReport}
   */
  updateData (newData) {
    this.data = Object.assign(this.data, newData)
    return this
  }

  /**
   * @param {number} index
   * @return {ChapterReport}
   */
  setIndex (index) {
    this.index = index
    return this
  }

  /**
   * @return {string}
   */
  fullMessage () {
    if (this.isLegal) {
      return ''
    }

    const part1 = this.area === ''
      ? 'Bad chapter'
      : `Bad chapter ${this.area}`

    const part2 = _.isNil(this.index)
      ? ''
      : ` at chapter #${this.index + 1}`

    let message = this.message
    if (message === 'duplication' && !_.isNil(this.data.originIndex)) {
      message = `duplication of #${this.data.originIndex + 1}`
    }

    const part3 = message === ''
      ? ''
      : ` - ${message}`

    return `${part1}${part2}${part3}`
  }

  /**
   * @return {FailureReport}
   */
  toFailureReport () {
    return new FailureReport({
      message: this.fullMessage(),
      elementId: (!_.isNil(this.index)) ? `#chapter-item-${this.index}` : undefined
    })
  }
}

export default {
  components: {
    IconPlusCircle,
    IconTrashAlt,
    IconArrowCircleDown,
    IconArrowCircleUp,
    IconRightArrow,
  },

  data () {
    return {
      title: 'Manage Link',

      wrLink: new WiseReadLink(),

      /** @type {ChapterLink[]} */
      chapterLinks: [],

      /** @type {number | string} */
      cstart: '',
      initialLink: '',
      enum_ChaptersInputMode: enum_ChaptersInputMode,
      selectedChaptersInputMode: enum_ChaptersInputMode.CHAPTER_LIST,
      configpathValue: '',
      selectedConfigpathType: ConfigpathType.RAWURL,

      imagesModeOptions: [
        { text: 'Continuous (best for webtoon)', value: ImagesModeEnum.CONTINUOUS },
        { text: 'Separate', value: ImagesModeEnum.SEPARATE },
      ],

      ltrOptions: [
        { text: 'Left to Right', value: true },
        { text: 'Right to Left', value: false },
      ],

      hideInputOptions: [
        { text: 'Keep top area', value: false },
        { text: 'Remove top area', value: true },
      ],

      preloadingOptions: [
        { text: '2 (Recommended)', value: 2 },
        { text: '1', value: 1 },
        { text: '0 (Less traffic but slow)', value: 0 },
      ],

      configpathTypeOptions: [
        { text: 'Raw URL', value: ConfigpathType.RAWURL },
        { text: 'Gist id', value: ConfigpathType.GIST },
      ],
    }
  },

  /**
   * @return {any}
   */
  head () {
    return {
      title: this.title,
    }
  },

  computed: {
    /**
     * @return {boolean}
     */
    areChapterNamesRequired () {
      // Chapter names are required if there is any name
      return this.chapterLinks.some((c) => c.name.trim())
    },

    /**
     * @return {string}
     */
    outputLink () {
      return this.wrLink.toLink()
    },

    /**
     * @return {boolean}
     */
    isLegalState () {
      return this.getProblem.isLegal
    },

    /**
     * Check if any validator failed.
     * @return {FailureReport}
     */
    getProblem () {
      for (let index = 0; index < this.chapterLinks.length; index++) {
        let chapterReport = this.checkChapterName(index)

        if (!chapterReport.isLegal) {
          return chapterReport.setIndex(index).toFailureReport()
        }

        chapterReport = this.checkChapterLink(index)
        if (!chapterReport.isLegal) {
          return chapterReport.setIndex(index).toFailureReport()
        }
      }

      const failureReport = this.checkCStart()
      if (!failureReport.isLegal) {
        return failureReport
      }

      const globalMessage = this.wrLink.checkValidators()
      return new FailureReport({ message: globalMessage, elementId: undefined })
    },

    /**
     * @return {number}
     */
    maxCStart () {
      if (this.selectedChaptersInputMode === enum_ChaptersInputMode.CONFIG_FILE) {
        return 999999
      }

      if (this.chapterLinks.length > 0) {
        return this.chapterLinks.length
      }

      return 1
    },

    /**
     * @return {{type: string, value: string }}
     */
    currConfigpathTypeAndValue () {
      return { type: this.selectedConfigpathType, value: this.configpathValue }
    },
  },

  watch: {
    chapterLinks: {
      deep: true,
      /** @param {ChapterLink[]} newChapterLinks */
      handler (newChapterLinks) {
        this.wrLink._chapterLinks = newChapterLinks
      },
    },
    cstart: {
      /** @param {number | string} newCStart */
      handler (newCStart) {
        if (_.isNumber(newCStart)) {
          this.wrLink._cstart = Math.max(newCStart - 1, 0)
        }
        else {
          this.wrLink._cstart = 0
        }
      },
    },
    selectedChaptersInputMode: {
      /** @param {enum_ChaptersInputMode} newMode */
      handler (newMode) {
        if (newMode === enum_ChaptersInputMode.CHAPTER_LIST) {
          this.wrLink._configpath = ''
          this.wrLink._chapterLinks = this.chapterLinks
          if (this.cstart === 1) {
            this.cstart = ''
          }
        }
        else {
          this.wrLink._configpath = this.combineConfigpathTypeAndValue(
            this.selectedConfigpathType, this.configpathValue)
          this.wrLink._chapterLinks = []
        }
      },
    },

    currConfigpathTypeAndValue: {
      /**  @param {{type: string, value: string }} configpathTypeAndValue */
      handler (configpathTypeAndValue) {
        this.wrLink._configpath = this.combineConfigpathTypeAndValue(
          configpathTypeAndValue.type, configpathTypeAndValue.value
        )
      },
    },
  },

  mounted () {
    // Init with empty ChapterLink
    this.chapterLinks.push(new ChapterLink({ link: '', name: '' }))
  },

  methods: {
    copyOutputLink () {
      DomUtils.copyTextToClipboard(this.outputLink)
    },

    enterInitialLink () {
      if (!this.initialLink) { return }
      if (!this.initialLink.includes(WISEREAD_ORIGIN)) {
        alert(`WiseRead domain (${WISEREAD_ORIGIN}) is missing`)
        return
      }
      this.wrLink = new WiseReadLink(this.initialLink)
      this.chapterLinks = this.wrLink.chapterLinks
      if (this.chapterLinks.length === 0) {
        // Init with empty ChapterLink
        this.chapterLinks.push(new ChapterLink({ link: '', name: '' }))
      }
      this.cstart = _.isNumber(this.wrLink.cstart) ? this.wrLink.cstart + 1 : 0
      if (this.cstart === 1) {
        this.cstart = ''
      }
      if (this.wrLink.configpath) {
        const [configpathType, configpathValue] = splitParamToTypeValue(this.wrLink.configpath)
        this.selectedConfigpathType = configpathType
        this.configpathValue = configpathValue
        this.selectedChaptersInputMode = enum_ChaptersInputMode.CONFIG_FILE
      }

      alert('You have successfully entered the link!')
    },

    /**
     * Return 'type:value', or empty no value
     * @param {string} ConfigpathType
     * @param {string} configpathValue
     * @return {string}
     */
    combineConfigpathTypeAndValue (ConfigpathType, configpathValue) {
      if (configpathValue) {
        return `${ConfigpathType}:${configpathValue}`
      }
      else {
        return ''
      }
    },

    /**
     * @param {number} chapterIndex
     * @return {ChapterReport}
     */
    checkChapterName (chapterIndex) {
      if (chapterIndex < 0 || chapterIndex > this.chapterLinks.length - 1) {
        return new ChapterReport('name', 'error')
      }

      // Ignore when in config mode
      if (this.selectedChaptersInputMode === enum_ChaptersInputMode.CONFIG_FILE) {
        return new ChapterReport()
      }

      // If empty link, any name is good
      if (!this.chapterLinks[chapterIndex].link.trim()) {
        return new ChapterReport()
      }

      const chapterName = this.chapterLinks[chapterIndex].name
      const chapterNameTrim = chapterName.trim()

      if (chapterNameTrim.length > MAX_CHAPTER_NAME_LEN) {
        return new ChapterReport('name', 'too long')
      }

      if (this.areChapterNamesRequired && !chapterNameTrim) {
        return new ChapterReport('name', 'empty')
      }

      if (chapterNameTrim) {
        const [originIndex, dupIndex] = VArray.firstDuplicateIndex(this.chapterLinks.map((c) => c.name))
        if (dupIndex === chapterIndex) {
          return new ChapterReport('name', 'duplication', { originIndex: originIndex })
        }
      }

      return WiseReadParams.chapterNames.validator([chapterName])
        ? new ChapterReport()
        : new ChapterReport('name')
    },

    /**
     * @return {FailureReport}
     */
    checkCStart () {
      const elementId = '#cstartArea'

      if (this.cstart === '' || this.cstart === 1) {
        return new FailureReport({ message: '', elementId })
      }

      if (this.cstart < 1) {
        return new FailureReport({ message: "Start chapter can't be less than 1", elementId })
      }

      if (this.cstart > this.wrLink.download.length &&
          this.selectedChaptersInputMode === enum_ChaptersInputMode.CHAPTER_LIST) {
        return new FailureReport({ message: "Start chapter can't be greater than the number of chapters", elementId })
      }

      return new FailureReport({ message: '', elementId })
    },

    /**
     * @param {number} chapterIndex
     * @return {ChapterReport}
     */
    checkChapterLink (chapterIndex) {
      if (chapterIndex < 0 || chapterIndex > this.chapterLinks.length - 1) {
        return new ChapterReport('link', 'error')
      }

      // Ignore when in config mode
      if (this.selectedChaptersInputMode === enum_ChaptersInputMode.CONFIG_FILE) {
        return new ChapterReport()
      }

      const chapterLink = this.chapterLinks[chapterIndex].link
      const chapterLinkTrim = chapterLink.trim()

      // If last
      if (chapterIndex === this.chapterLinks.length - 1) {
        if (!chapterLinkTrim) {
          return new ChapterReport()
        }
      }
      else {
        if (!chapterLinkTrim) {
          return new ChapterReport('link', 'empty')
        }
      }

      if (!StrUtils.isValidHttpUrl(chapterLinkTrim)) {
        return new ChapterReport('link', 'invalid url')
      }

      if (chapterLinkTrim) {
        const [originIndex, dupIndex] = VArray.firstDuplicateIndex(this.chapterLinks.map((c) => c.link))
        if (dupIndex === chapterIndex) {
          return new ChapterReport('link', 'duplication', { originIndex: originIndex })
        }
      }

      return WiseReadParams.download.validator([chapterLink])
        ? new ChapterReport()
        : new ChapterReport('link')
    },

    addChapter () {
      // If last link is missing
      if (this.chapterLinks.length > 0 && !_.last(this.chapterLinks)?.link.trim()) {
        alert('Please enter link before adding a new chapter')
      }
      else {
        if (this.chapterLinks.length === 0) {
          this.chapterLinks.push(new ChapterLink({ link: '', name: '' }))
          this.scrollToLastChapterAfterVTick()
        }
        else {
          const last = _.last(this.chapterLinks)
          if (!last) { return }
          const initialName = StrUtils.hasNumber(last.name) ? StrUtils.incrementLastNumber(last.name).trim() : ''

          // Instead of just pushing to the end, we replace the last chapter with the new one,
          // and then we push back the last at his right position before the new one.
          // We do it for the transition effect to look better.
          Vue.set(this.chapterLinks, this.chapterLinks.length - 1, new ChapterLink({ link: '', name: initialName }))
          Vue.nextTick(() => {
            this.chapterLinks.splice(this.chapterLinks.length - 1, 0, last)
            this.scrollToLastChapterAfterVTick()
          })
        }
      }
    },

    scrollToLastChapterAfterVTick () {
      Vue.nextTick(() => {
        const el = this.$el.querySelector('.chapters-list')?.lastElementChild
        if (el) {
          el.scrollIntoView({ behavior: 'auto' })
        }
      })
    },

    deleteChapter (index) {
      if (index < 0 || index > this.chapterLinks.length - 1) {
        return
      }

      if (this.chapterLinks.length > 1) {
        this.chapterLinks.splice(index, 1)
      }
    },

    swapChapters (index1, index2) {
      if (index1 >= 0 && index1 < this.chapterLinks.length &&
          index2 >= 0 && index2 < this.chapterLinks.length) {
        VArray.swap(this.chapterLinks, index1, index2)
      }
    },

    /**
     * @param {string} elementId
     */
    scrollToElement (elementId) {
      this.$scrollTo(elementId, 250, {
        easing: 'ease-out',
        force: true,
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.manage-link-page {
  .dark-mode & {
    @apply text-gray-500;
  }
}

// # List transition: #
// See https://vuejs.org/v2/guide/transitions.html#List-Move-Transitions
// See https://v3.vuejs.org/guide/transitions-list.html#list-move-transitions

.flip-list-move {
  transition: transform 0.7s;
}

.flip-list-item {
  transition: all 0.7s ease;
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.flip-list-leave-active {
  position: absolute;
}

// # List transition end #

.border-separator-color {
  @apply transition-colors duration-cmt;

  .dark-mode & {
    @apply border-gray-700;
  }
}

$select-margin: 0.32rem;

.select {
  @apply bg-transparent block border-2 rounded-md border-gray-300 shadow-sm cursor-pointer;
  @apply transition-colors duration-cmt;
  margin-top: $select-margin;
  margin-bottom: $select-margin;

  padding: 0.32rem 0.38rem;
  min-width: 87%;

  @screen sm2 {
    min-width: 19rem;
  }

  &:focus {
    @apply outline-none;
  }

  .dark-mode & {
    @apply border-gray-600;
  }

  option {
    .dark-mode & {
      @apply bg-gray-800 text-gray-300;
    }
  }
}

.chapters-list > * {
  .dark-mode & {
    @apply border-gray-600; // Apply to the divide line color
  }
}

.chapter-area {
  @apply py-6;
}

.chapter-number {
  @apply flex items-center justify-center rounded-full text-center;
  @apply text-white bg-gray-500 bg-opacity-100 font-semibold font-mono select-none;
  @apply transition-colors duration-cmt;

  width: 1.44rem;
  height: 1.44rem;
  font-size: 0.84rem;

  .dark-mode & {
    @apply text-gray-500 bg-gray-700;
    color: #b7c0cc;
  }

  .cstart-here & {
    @apply border-2 border-gray-700;

    .dark-mode & {
      @apply border-gray-500;
    }
  }
}

.cstart-here-arrow {
  @apply hidden;

  .cstart-here & {
    @apply block absolute fill-current w-6;
    right: 7px;

    // center
    top: 50%;
    transform: translate(0%, -50%);

    @screen -lg {
      @apply hidden;
    }
  }
}

.chapter-icon {
  height: 1.467rem;

  &.click-icon:not(.click-disabled) {
    @apply cursor-pointer;
  }

  &.regular-icon {
    .dark-mode &:not(.click-disabled) {
      opacity: 0.85;
    }
  }
}

.radio-group {
  @apply text-lg;

  --indicator-color: currentColor;

  @screen -md {
    --labels-gap: 1rem;
  }
}

.btn {
  @apply bg-gray-500 border-gray-500 text-white border-2;
  @apply font-medium rounded-md my-1 px-2;
  @apply transition-colors duration-cmt;

  &:focus {
    @apply outline-none bg-gray-600 border-gray-600;
  }

  .dark-mode & {
    @apply border-gray-700 text-gray-400 bg-gray-700;
  }
}

.output-height {
  height: 5.7rem;
}

.output {
  padding-top: 0.84rem;
  padding-bottom: 0.75rem;
}

.output-bg-color {
  @apply bg-gray-300;
  @apply transition-colors duration-cmt;

  .dark-mode & {
    @apply bg-gray-700;
  }
}

.output-copy-btn {
  @apply font-medium rounded-lg px-2 ml-1 bg-gray-500 text-gray-200;
  @apply transition-colors duration-cmt;
  margin-bottom: 0.02rem;

  .dark-mode & {
    @apply bg-gray-800 text-gray-400;
    background-color: #6a7382;
  }

  &:focus {
    @apply outline-none bg-gray-600;
  }
}

.output-title {
  @apply font-medium h-6 overflow-y-auto;

  .output-error-msg {
    @apply pl-2 text-sm text-red-600;

    @screen sm2 {
      @apply text-base;
    }

    .dark-mode & {
      color: #ee5c5c;
    }
  }
}
</style>
