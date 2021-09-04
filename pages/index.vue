<template>
  <div :class="{ 'g-images-displayed': $store.getters.areImagesDisplayed }">
    <div
      @drop="onDrop($event)"
      @dragover="onDragover($event)"
    >
      <TopBlock
        v-if="this.$store.state.showTopBlock"
        class="nav-x-padding mb-12"
        @filesUploaderChange="onFilesUploaderChange"
        @enterDownloadLink="enterDownloadLink"
      />
      <ConfigLoader v-if="showConfigLoader" />

      <div
        v-show="this.$store.state.chapters.length > 0"
        class="keep-height flex flex-col justify-between"
      >
        <div>
          <ChaptersNav class="nav-x-padding" type="top" />
          <Loader v-if="showExtractionLoader" class="text-center" />
          <ProgressBar v-if="showProgressBar" :percent="this.$store.getters.currDownloadPercent" />
        </div>

        <div class="flex-auto">
          <ImagesList />
        </div>

        <div>
          <ChaptersNav class="nav-x-padding" type="bottom" />
          <Controller />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import FileName from '~/lib/utils/FileName'
import Sort from '~/lib/Sort'
import DomImagesHelp from '~/lib/DomImagesHelp'
import DropboxHelp from '~/lib/filehosts/DropboxHelp'
import {
  RawJsonSource, GistSource,
  ConfigpathType, parseConfigJson, ConfigpathData
} from '~/lib/Configpath'

import GoogleDriveHelp from '~/lib/filehosts/GoogleDriveHelp'
import { WiseReadLink, splitParamToTypeValue } from '~/lib/WiseReadLink'
import { RemoteSourceEnum } from '~/lib/models/RemoteSourceEnum'
import { ArchiveError, ArchiveErrorTypeEnum } from '~/lib/utils/Archive'
import { DownloadError, DownloadStatusEnum, PROXY_URL } from '~/lib/utils/Download'
import {
  ComicSource,
  ComicSource_ImagesBlobs,
  ComicSource_ArchivesBlobs,
  ComicSource_DirectLinks,
  ComicSource_DropboxFolder,
} from '~/lib/ComicSource'
import {
  ImageBlob,
  ChapterLink,
} from '~/lib/models'

import _ from 'lodash'
import ResizeObserver from 'resize-observer-polyfill'

export default {
  data () {
    return {
      showConfigLoader: false,
    }
  },

  computed: {
    /**
     * @return {boolean}
     */
    showExtractionLoader () {
      return this.$store.getters.currChapter?.chapterInfo?.isExtractingNow === true
    },

    /**
     * @return {boolean}
     */
    showProgressBar () {
      return this.$store.getters.currChapter?.chapterInfo?.downloadStatus === DownloadStatusEnum.DOWNLOADING
    },
  },

  beforeMount () {
    window.addEventListener('scroll', this.throttledHandleScroll)
    window.addEventListener('resize', this.throttledHandleWindowResize)
    const ro = new ResizeObserver(this.throttledHandleWindowResize).observe(document.body)
  },

  async mounted () {
    this.$nextTick(async function () {
      try {
        const urlStr = window.location.href
        const wrLink = new WiseReadLink(urlStr)
        console.log(`Params: ${JSON.stringify(wrLink)}`)

        this.$store.commit('setImagesMode', { imagesMode: wrLink.imode })
        this.$store.commit('setIsLTR', { isLTR: wrLink.ltr })
        this.$store.commit('setShowTopBlock', { showTopBlock: !wrLink.hideInput })
        this.$store.commit('setPreloadingNumber', { preloadingNumber: wrLink.preloading })

        // If the loading time takes longer than expected, show Loader
        // (Probably when reading configpath or preparing Dropbox folder)
        let loadingConfig = true
        setTimeout(() => {
          if (loadingConfig) {
            this.showConfigLoader = true
          }
        }, 1500)

        /** @type {ComicSource=} */
        let comicSource

        // Try to create comicSource if preset in the url params
        try {
          if (wrLink.chapterLinks.length > 0) {
            comicSource = this.createComicSourceFromDownloadLinks(wrLink.chapterLinks, false)
          }
          else if (wrLink.source) {
            comicSource = this.createComicSourceFromRemoteSource(wrLink.source)
          }
          else if (wrLink.configpath) {
            /** @type {ConfigpathData} */
            const configpathData = await this.readConfigpath(wrLink.configpath)
            const chapterLinks = configpathData.chapterLinks
            comicSource = this.createComicSourceFromDownloadLinks(chapterLinks, false)
          }
        }
        catch (err) {
          this.putError(err.message, err, false, true)
        }

        // If comicSource created successfully from the url params
        if (comicSource) {
          try {
            // Load streams now, when the Loader is still active
            await comicSource.loadChaptersStreamsAsync()
            this.updateStoreChapters(comicSource, wrLink.cstart ?? 0)
          }
          catch (err) {
            this.putError("Can't load chapters", err, true, true)
          }
        }

        // Hide ConfigLoader if shown
        this.showConfigLoader = loadingConfig = false
      }
      catch (err) {
        this.putError("Can't read url params", err, false, true)
      }

      // Just to make sure the Loader turned off
      this.showConfigLoader = false
    })
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.throttledHandleScroll)
    window.removeEventListener('resize', this.throttledHandleWindowResize)
  },

  methods: {
    onDragover (evt) {
      evt.stopPropagation()
      evt.preventDefault()

      // Explicitly show this is a copy.
      evt.dataTransfer.dropEffect = 'copy'
    },

    onDrop (evt) {
      evt.stopPropagation()
      evt.preventDefault()

      /** @type {FileList} */
      const files = evt.dataTransfer.files
      this.loadLocalFiles(files)
    },

    onFilesUploaderChange (evt) {
      this.loadLocalFiles(evt.target.files)
    },

    enterDownloadLink (downloadLink) {
      if (downloadLink) {
        const oneChapterLink = [new ChapterLink({ name: 'Chapter', link: downloadLink })]
        const comicSource = this.createComicSourceFromDownloadLinks(oneChapterLink, true)
        this.updateStoreChapters(comicSource, 0)
      }
    },

    // Avoid excessively updating the position while scrolling.
    throttledHandleScroll: _.throttle(function () {
      DomImagesHelp.updateCurrImageNameByDomAsync({ commit: this.$store.commit })
    }, 100),

    throttledHandleWindowResize: _.throttle(function () {
      DomImagesHelp.updateDomImagesDataByDomAsync({ commit: this.$store.commit })
    }, 500),

    scrollToTop () {
      this.$scrollTo('body', 250, {
        easing: 'ease-out',
        force: false,
      })
    },

    /**
     * @param {FileList} files
     */
    async loadLocalFiles (files) {
      if (files && files.length > 0) {
        this.scrollToTop()

        try {
          const comicSource = this.createComicSourceFromLocalFiles(files)
          this.updateStoreChapters(comicSource)
        }
        catch (err) {
          alert(err.message)
        }
      }
    },

    /**
     * @param {FileList} files
     * @return {ComicSource}
     */
    createComicSourceFromLocalFiles (files) {
      const filesAsArray = Array.from(files)

      // If all are archives:
      if (FileName.areAllArchives(filesAsArray.map((f) => f.name))) {
        Sort.sortFiles(filesAsArray)
        return new ComicSource_ArchivesBlobs({ blobs: filesAsArray })
      }
      // If wrong files combination:
      else if (FileName.areSomeArchives(filesAsArray.map((f) => f.name))) {
        throw new Error("You can't open zip/cbz files with other file types")
      }
      // If all are images:
      else {
        const images = filesAsArray.map((o) => new ImageBlob({ data: o, name: o.name }))
        Sort.sortChapterImages(images)
        return new ComicSource_ImagesBlobs({ imagesBlobs: images })
      }
    },

    /**
     * @param {ChapterLink[]} inChapterLinks
     * @param {boolean} inTryUseFileName
     *
     * @return {ComicSource_DirectLinks}
     */
    createComicSourceFromDownloadLinks (inChapterLinks, inTryUseFileName) {
      console.log(`Download: ${JSON.stringify(inChapterLinks)}`)

      const chapterLinks = _.clone(inChapterLinks)
      const anyChapterNameIsMissing = (chapterLinks.some((c) => !c.name))

      if (anyChapterNameIsMissing) {
        for (let index = 0; index < chapterLinks.length; index++) {
          chapterLinks[index].name = `Chapter ${index + 1}`
        }
      }

      this.prepareChapterLinks(chapterLinks)

      const tryUseFileName = inTryUseFileName || anyChapterNameIsMissing
      const comicSource = new ComicSource_DirectLinks({ chapterLinks, tryUseFileName })

      return comicSource
    },

    /**
     * @param {string} source
     * @return {ComicSource}
     */
    createComicSourceFromRemoteSource (source) {
      console.log(`Download from source: ${source}`)
      const [type, value] = splitParamToTypeValue(source)

      if (type === RemoteSourceEnum.DROPBOX_FOLDER) {
        return new ComicSource_DropboxFolder({ folderLink: value })
      }

      throw new Error('Remote source type is not supported')
    },

    /**
     * Clean and edit the chapter links
     * @param {ChapterLink[]} chapterLinks
     */
    prepareChapterLinks (chapterLinks) {
      for (let index = 0; index < chapterLinks.length; index++) {
        const originLink = chapterLinks[index].link
        if (DropboxHelp.isDropboxHost(originLink)) {
          chapterLinks[index].link = DropboxHelp.convertShareLinkToDirectLink(originLink)
        }
        else if (GoogleDriveHelp.isGoogleDriveHost(originLink)) {
          chapterLinks[index].link = GoogleDriveHelp.convertShareLinkToDirectLink(originLink)
        }
      }
    },

    /**
     * @param {ComicSource} comicSource
     * @param {number} startChapter
     */
    updateStoreChapters (comicSource, startChapter = 0) {
      this.$store.dispatch('initChaptersAndLoadFirstAsync', {
        comicSource: comicSource,
        startChapter: startChapter,
        onChapterLoadingError: this.onChapterLoadingError
      })
    },

    /**
     * @param {string} message
     * @param {Error} error
     * @param {boolean=} putErrorInAlert
     * @param {boolean=} showAlert
     */
    putError (message, error, putErrorInAlert = true, showAlert = true) {
      const alertFunc = (message) => {
        _.delay(() => { alert(message) }, 200)
      }

      const fullMessage = message + ((putErrorInAlert && error.message) ? ` (${error.message})` : '')

      if (showAlert) {
        console.log(`Alert Error: ${fullMessage}`)
        alertFunc(fullMessage)
      }
      else {
        console.log(`No-Alert Error: ${fullMessage}`)
      }

      console.error(error)
    },

    /**
     * @param {ComicSource} comicSource
     * @param {Error} err
     * @param {number} loadingId
     * @param {number} index
     *
     * @return {void}
     */
    onChapterLoadingError (comicSource, err, loadingId, index) {
      if (loadingId < this.$store.state.firstLoadingIdOfSource) {
        return
      }

      // If the error came from the active chapter
      if (index === this.$store.state.currChapterIndex && loadingId === this.$store.state.currLoadingId) {
        if (err instanceof ArchiveError) {
          const archiveErrorType = err.archiveErrorType

          if (archiveErrorType === ArchiveErrorTypeEnum.LOADING_FAILURE) {
            this.putError('Not a valid zip/cbz file', err)
          }
          else if (archiveErrorType === ArchiveErrorTypeEnum.EXTRACTION_FAILURE) {
            this.putError("Can't extract archive. Maybe your network is limited by Netspark, Rimon or something", err, true)
          }
          else {
            this.putError('Unknown extraction error', err)
          }
        }
        else if (err instanceof DownloadError) {
          this.putError('Download error', err)
        }
        else {
          this.putError('Chapter loading error', err)
        }
      }
      // If the error came from inactive chapter
      else {
        this.putError('Loading error of inactive chapter', err, true, false)
      }
    },

    /**
     * @param {string} configpath - "type:value" string
     *  (Example: 'gist:bcb9c0cc01f7058648a5e2fd95301ae2')
     *
     * @return {Promise<ConfigpathData>}
     */
    async readConfigpath (configpath) {
      const [type, value] = splitParamToTypeValue(configpath)

      if (type === ConfigpathType.GIST) {
        const gistId = value
        try {
          const jsonData = await GistSource.getJSON(gistId)
          return parseConfigJson(jsonData)
        }
        catch (err) {
          throw new Error(`Can't load/parse config from gist ${gistId}`)
        }
      }
      else if (type === ConfigpathType.RAWURL || type === ConfigpathType.GITIO) {
        // Note: GITIO is not officially supported.
        const rawUrl = (type === ConfigpathType.RAWURL) ? value : `${PROXY_URL}https://git.io/${value}`
        try {
          const jsonData = await RawJsonSource.getJSON(rawUrl)
          return parseConfigJson(jsonData)
        }
        catch (err) {
          throw new Error(`Can't load/parse config from ${rawUrl}`)
        }
      }

      throw new Error('Config type is not supported')
    }
  },
}
</script>

<style lang="scss">
.keep-height {
  min-height: 110vh;
}
</style>
