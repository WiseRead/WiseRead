<template>
  <div :class="{ 'open-controller': isOpen }" class="controller">
    <!-- Empty area at the end of the page, responsive to the controller size -->
    <div class="empty-area"></div>

    <div class="wrapper">
      <div class="open-close controller-bg-color" @click="toggleOpenClose()">
        <IconArrowHeadUpThin class="open-close-icon" />
      </div>
      <div class="wrapper-main controller-bg-color">
        <div class="pt-3 pb-1 pl-2 md:pl-4 pr-2 md:pr-4 md:px-5 text-sm md:text-base text-left font-sans leading-snug">
          <div class="flex items-center justify-between">
            <div class="min-w-0">
              <!-- Line 1 -->
              <div class="flex items-center">
                <IconBookBlack class="mr-1 inline" style="width: 0.89rem; margin-top: 0.11rem;" />
                <span class="mr-3"> Chapter: {{ $store.state.currChapterIndex + 1 }}/{{ $store.state.chapters.length }}</span>
                <IconImage class="w-4 mr-1 inline" style="margin-top: 0.11rem;" /><span> Image:</span>
              </div>
              <!-- Line 2 -->
              <div class="image-name">{{ currImageName }}</div>
            </div>
            <!-- Rigth side -->
            <div class="pl-1 flex">
              <button
                v-if="currDownloadToDeviceFunc"
                title="Download"
                class="ml-1 mr-2 md:mr-3 focus:outline-none"
                @click="downloadToDevice()"
              >
                <IconImport class="download-icon" />
              </button>
              <div title="Scroll up" class="scroll-up" @click="scrollToTop()">
                <IconArrowUpLong class="scroll-up-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ts-ignore
import IconImage from '@/assets/icons/image/image.svg?inline'
// @ts-ignore
import IconBookBlack from '@/assets/icons/book/book_black.svg?inline'
// @ts-ignore
import IconArrowHeadUpThin from '@/assets/icons/arrows/arrowhead-up-thin.svg?inline'
// @ts-ignore
import IconArrowUpLong from '@/assets/icons/arrows/arrow-up-long.svg?inline'
// @ts-ignore
import IconImport from '@/assets/icons/import.svg?inline'

import { StrUtils } from '~/lib/utils/StrUtils'

export default {
  components: {
    IconImage,
    IconBookBlack,
    IconArrowHeadUpThin,
    IconArrowUpLong,
    IconImport
  },

  data () {
    return {
      isOpen: false,
    }
  },

  computed: {
    /**
     * @return {string}
     */
    currImageName () {
      let finalCurrImageName
      const currImageName = this.$store.state.currImageName

      if (currImageName) {
        const afterSlash = currImageName.substring(currImageName.lastIndexOf('/') + 1)
        finalCurrImageName = afterSlash
      }
      else {
        finalCurrImageName = 'No image name'
      }

      return StrUtils.addLtrToString(finalCurrImageName)
    },

    /**
     * @return {(() => void)?}
     */
    currDownloadToDeviceFunc () {
      return this.$store.getters.currChapter?.chapterInfo?.downloadToDeviceFunc
    },
  },

  methods: {
    /**
     * @param {string} side
     */
    toggleOpenClose () {
      this.isOpen = !this.isOpen
    },

    scrollToTop () {
      this.$scrollTo('body', 250, {
        easing: 'ease-out',
        force: false,
      })
    },

    downloadToDevice () {
      if (this.currDownloadToDeviceFunc) {
        this.currDownloadToDeviceFunc()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* stylelint-disable length-zero-no-unit */ // (For the calc we use '0rem')

.controller {
  --controller-height: 0rem; // Height when closed
  --open-controller-transition-time: 0.5s;

  @apply text-gray-400;

  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;

  .g-images-displayed & {
    opacity: 1;
    visibility: visible;
  }

  &.open-controller {
    --controller-height: 3.6rem; // Height when opened

    @screen md {
      --controller-height: 4rem;
    }
  }
}

.empty-area {
  height: calc(var(--controller-height) + 0.8rem);
  transition: height var(--open-controller-transition-time);
}

.wrapper {
  @apply fixed bottom-0 left-0 right-0;
  transition: all 0.5s;
}

.controller-bg-color {
  background: rgb(10 10 10 / 70%);
}

.scroll-up {
  @apply rounded-full cursor-pointer;
  padding: 0.4rem;
  transition: background-color 0.2s;

  @screen md {
    padding: 0.55rem;
  }

  &:hover {
    background-color: rgba(146, 141, 141, 0.753);
  }
}

.scroll-up-icon {
  width: 1.27rem;

  @screen md {
    width: 1.4rem;
  }
}

.download-icon {
  $transition-time: 0.1s;
  transition: width $transition-time, color $transition-time;
  width: 1.37rem;

  @screen md {
    width: 1.53rem;
  }

  &:hover {
    @apply text-blue-400;
    width: 1.39rem;

    @screen md {
      width: 1.55rem;
    }
  }
}

.open-close {
  @apply rounded-t-xl text-center cursor-pointer;
  margin-left: 1.5rem;
  height: 1.31rem;
  width: 3.1rem;

  @screen md {
    margin-left: 2rem;
    width: 3.2rem;
    height: 1.25rem;
  }
}

.open-close-icon {
  @apply inline transform rotate-0;
  height: 0.92rem;
  margin-bottom: 0.07rem;
  transition: transform var(--open-controller-transition-time);

  @screen md {
    height: 1.2rem;
    padding: 0.04rem;
    margin-bottom: 0.03rem;
  }

  .open-controller & {
    @apply rotate-180;
  }
}

.wrapper-main {
  @apply rounded-t-3xl;

  height: var(--controller-height);
  max-height: var(--controller-height);
  transition:
    height var(--open-controller-transition-time),
    max-height var(--open-controller-transition-time);
}

.image-name {
  @apply truncate;
  direction: rtl; // to put the three dots at the start
}
</style>
