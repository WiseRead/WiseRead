<template>
  <div>
    <div
      :id="isTop ? 'chapterNavTop' : 'chapterNavBottom'"
      class="flex justify-between items-center h-12 rounded-md my-5 cnav-color "
      :class="{ 'colored-nav': isColored }"
    >
      <div
        class="arrow-area"
        :class="{ 'hide': !shouldShowLeftArrow }"
        @click="arrowClick('left')"
      >
        <IconLeftArrow class="arrow" />
      </div>
      <div class="chapter-title">
        <span v-if="chaptersNumber > 1" class="opacity-50">{{ currChapterNumber }}.</span>
        {{ chapterName }}
      </div>
      <div
        class="arrow-area"
        :class="{ 'hide': !shouldShowRightArrow }"
        @click="arrowClick('right')"
      >
        <IconRightArrow class="arrow" />
      </div>
    </div>
  </div>
</template>

<script>
// @ts-ignore
import IconLeftArrow from '@/assets/icons/arrows/arrowhead-left-outline.svg?inline'
// @ts-ignore
import IconRightArrow from '@/assets/icons/arrows/arrowhead-right-outline.svg?inline'

export default {
  components: {
    IconLeftArrow,
    IconRightArrow,
  },

  props: {
    type: {
      type: String,
      required: true,
      validator: function (value) {
        return ['top', 'bottom'].includes(value)
      }
    }
  },

  computed: {
    /**
     * @return {boolean}
     */
    isTop () {
      return this.type === 'top'
    },

    /**
     * @return {boolean}
     */
    isColored () {
      return !this.isTop // Or maybe change to: (!this.isTop || !this.$store.state.showTopBlock)
    },

    /**
     * @return {string}
     */
    chapterName () {
      return this.$store.getters.currChapterName
    },

    /**
     * @return {number}
     */
    currChapterNumber () {
      return this.$store.state.currChapterIndex + 1
    },

    /**
     * @return {number}
     */
    chaptersNumber () {
      return this.$store.state.chapters.length
    },

    /**
     * @return {boolean}
     */
    isThereNextChapter () {
      return !(this.$store.state.chapters.length < 2 ||
              this.$store.state.currChapterIndex === this.$store.state.chapters.length - 1)
    },

    /**
     * @return {boolean}
     */
    isTherePreviousChapter () {
      return !(this.$store.state.chapters.length < 2 ||
              this.$store.state.currChapterIndex < 1)
    },

    /**
     * @return {boolean}
     */
    shouldShowRightArrow () {
      if ((this.$store.state.isLTR && this.isThereNextChapter) ||
          (!this.$store.state.isLTR && this.isTherePreviousChapter)) {
        return true
      }
      return false
    },

    /**
     * @return {boolean}
     */
    shouldShowLeftArrow () {
      if ((!this.$store.state.isLTR && this.isThereNextChapter) ||
          (this.$store.state.isLTR && this.isTherePreviousChapter)) {
        return true
      }
      return false
    },
  },

  methods: {
    /**
     * @param {string} side
     */
    arrowClick (side) {
      const moveToChapterFunc = async () => {
        if ((side === 'right' && this.$store.state.isLTR) ||
            (side === 'left' && !this.$store.state.isLTR)) {
          await this.$store.dispatch('moveToNextChapterAsync')
        }
        else {
          await this.$store.dispatch('moveToPreviousChapterAsync')
        }
      }

      if (!this.isTop) {
        // Scroll to top chapter title
        const cancelScroll = this.$scrollTo('#chapterNavTop', 150, {
          easing: 'ease-out',
          offset: -20,
          force: true,
          onDone: (element) => {
            moveToChapterFunc()
          },
        })
      }
      else {
        moveToChapterFunc()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.cnav-color {
  @apply text-gray-600 transition-colors duration-cmt;

  .dark-mode & {
    @apply transition-colors duration-cmt;
    color: var(--topblock-title-color);
  }
}

.arrow-area {
  @apply mx-1;
  cursor: pointer;
  transition: all 0.5s, color var(--color-mode-transition-time);

  @screen sm {
    @apply mx-2;
  }

  @screen md {
    @apply mx-6;
  }

  &.hide {
    opacity: 0;
    visibility: hidden;
  }
}

.arrow {
  @apply fill-current;
  width: 1.97rem;

  @screen sm {
    width: 2.2rem;
  }

  @screen md {
    width: 2.5rem;
  }
}

.chapter-title {
  @apply font-semibold font-sans truncate select-none;
  font-size: 0.9rem;

  @screen sm {
    font-size: 0.99rem;
  }

  @screen sm2 {
    font-size: 1.05rem;
  }

  @screen md {
    font-size: 1.13rem;
  }
}

.colored-nav {
  @apply bg-gray-400;
  transition: background-color var(--color-mode-transition-time);

  .dark-mode & {
    @apply bg-gray-700;
  }
}
</style>
