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
        <div class="truncate"><div>{{ chapterName }}</div></div>

        <div v-if="$store.state.chapters.length >= 2">
          <select v-model="selectedChapter" class="chapter-jump-select" @change="onChapterJump($event)">
            <option v-for="(cName, index) in $store.getters.chaptersNames" :key="index" :value="index">
              {{ cName }}
            </option>
          </select>
          <button><IconDiagonalArrowRightUp class="jump-button" /></button>
        </div>
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
// @ts-ignore
import IconDiagonalArrowRightUp from '@/assets/icons/arrows/diagonal-arrow-right-up-outline.svg?inline'

export default {
  components: {
    IconLeftArrow,
    IconRightArrow,
    IconDiagonalArrowRightUp,
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

  data () {
    return {
      selectedChapter: this.$store.state.currChapterIndex ?? 0,
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

  watch: {
    '$store.state.currChapterIndex': function (val, oldVal) {
      this.selectedChapter = val
    }
  },

  methods: {
    /**
     * @param {string} side
     */
    arrowClick (side) {
      let targetIndex = this.$store.state.currChapterIndex

      if ((side === 'right' && this.$store.state.isLTR) ||
          (side === 'left' && !this.$store.state.isLTR)) {
        targetIndex += 1 // Next chapter
      }
      else {
        targetIndex -= 1 // Previous chapter
      }

      this.moveToChapter(targetIndex)
    },

    /**
     * @param {number} index
     */
    moveToChapter (index) {
      const dispatchMoveToChapter = () => { this.$store.dispatch('moveToChapterAtIndexAsync', { index: index }) }

      if (!this.isTop) {
        // Scroll to top chapter title
        const cancelScroll = this.$scrollTo('#chapterNavTop', 150, {
          easing: 'ease-out',
          offset: -20,
          force: true,
          onDone: (element) => {
            dispatchMoveToChapter()
          },
        })
      }
      else {
        dispatchMoveToChapter()
      }
    },

    onChapterJump () {
      this.moveToChapter(this.selectedChapter)
    },
  }
}
</script>

<style lang="scss" scoped>
$jump-button-width: 1rem;

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
  @apply flex items-center font-semibold font-sans truncate select-none;
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

.jump-button {
  @apply cursor-pointer;
  width: $jump-button-width;
  max-width: $jump-button-width;
}

.hidden-select {
  opacity: 0;
  position: absolute;
}

.chapter-jump-select {
  @extend .hidden-select;

  @apply cursor-pointer;
  width: $jump-button-width;
  max-width: $jump-button-width;

  option {
    .dark-mode & {
      @apply bg-gray-800 text-gray-300;
    }
  }
}
</style>
