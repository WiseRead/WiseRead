<template>
  <div>
    <!-- ("images-list" class and "data-image-name" are used in DomImagesHelp) -->
    <div class="flex flex-col images-list" :class="{ 'separated': isSeparated }">
      <img
        v-for="({blobUrl, name}, index) of imagesBlobsURLs"
        :key="blobUrl"
        :src="blobUrl"
        alt="missing image"
        :data-image-name="name"
        @load="onImageLoad($event, index, name)"
        @error="replaceImageByDefault"
      />
    </div>
  </div>
</template>

<script>
// @ts-ignore
import errorImg from '~/assets/icons/image/image-times.svg'
import { ImagesModeEnum, Chapter } from '~/lib/models'
import DomImagesHelp from '~/lib//DomImagesHelp'

import _ from 'lodash'

export default {
  computed: {
    isSeparated () {
      return this.$store.state.imagesMode === ImagesModeEnum.SEPARATE
    },

    imagesBlobsURLs () {
      /** @type {Chapter?} */
      const currChapter = this.$store.getters.currChapter

      if ((!currChapter?.isPending()) && currChapter?.images) {
        return currChapter.images.filter((b) => b.data.size !== 0).map(
          (b) => { return { blobUrl: URL.createObjectURL(b.data), name: b.name } })
      }

      // When loading error, return invalid url to show error-image
      if (currChapter?.isPending() && currChapter?.chapterInfo.isLoadingError) {
        return [{ blobUrl: 'error', name: 'error' }]
      }

      return []
    },
  },

  methods: {
    replaceImageByDefault (e) {
      if (!e.target.classList.contains('error-image')) {
        e.target.classList.add('error-image')
      }

      e.target.src = errorImg
    },

    onImageLoad (evt, index, name) {
      URL.revokeObjectURL(evt.target.src)
      this.debouncedUpdateDomImagesData()
    },

    debouncedUpdateDomImagesData: _.debounce(function () {
      DomImagesHelp.updateDomImagesDataByDomAsync({ commit: this.$store.commit })
    }, 200)
  }
}
</script>

<style lang="scss" scoped>
img {
  @apply mx-auto text-5xl select-none;
  box-shadow: -2px 0 0 0 rgb(0 0 0 / 18%), 2px 0 0 0 rgb(0 0 0 / 18%);
  text-align: center;
  width: 100%;
  transition:
    margin 1.8s,
    box-shadow 0.2s,
    border-width 0.2s;

  @screen md {
    width: 679px;
  }

  .dark-mode & {
    border-color: transparent;
  }

  .separated & {
    @apply my-8.5;
    box-shadow: 0 0 9px -2px #0006;
    border-color: transparent;

    @screen ph {
      @apply my-8.5;
    }
  }

  .separated &:first-child {
    @apply mt-0;
  }

  .separated &:last-child {
    @apply mb-0;
  }

  &.error-image {
    @apply border-2 mt-6 mb-8;
    width: 16%;
    transition: margin 0.2s;

    @screen md {
      @apply mt-5 mb-6;
      width: 95px;
    }
  }
}

</style>
