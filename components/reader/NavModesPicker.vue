<!-- See https://nuxtjs.org/blog/going-dark-with-nuxtjs-color-mode -->

<template>
  <div class="flex flex-row-reverse">
    <ul>
      <li :title="currColor.name">
        <component
          :is="currColor.icon"
          @click="toggleColorMode()"
        />
      </li>
    </ul>
    <ul :class="{'hide': !isReaderPage}">
      <li
        v-for="imagesMode of imagesModes"
        :key="imagesMode"
        :title="capitalize(`${imagesMode} images`)"
      >
        <component
          :is="`icon-${imagesMode}`"
          :class="getImagesModeClasses(imagesMode)"
          @click="updateImagesMode(imagesMode)"
        />
      </li>
    </ul>
    <ul>
      <li :title="currFullscreen.name">
        <component
          :is="currFullscreen.icon"
          class="feather big"
          @click="toggleFullscreen()"
        />
      </li>
    </ul>
  </div>
</template>

<script>
// @ts-ignore
import IconLight from '@/assets/icons/color-mode/light.svg?inline'
// @ts-ignore
import IconDark from '@/assets/icons/color-mode/dark.svg?inline'
// @ts-ignore
import IconContinuous from '@/assets/icons/images-mode/continuous-images.svg?inline'
// @ts-ignore
import IconSeparate from '@/assets/icons/images-mode/separate-images.svg?inline'
// @ts-ignore
import IconFullscreen from '@/assets/icons/fullscreen/fullscreen.svg?inline'
// @ts-ignore
import IconFullscreenExit from '@/assets/icons/fullscreen/fullscreen_exit.svg?inline'

import { ImagesModeEnum } from '~/lib/models'
import DomUtils from '~/lib/utils/DomUtils'
import _ from 'lodash'

export default {
  components: {
    IconLight,
    IconDark,
    IconContinuous,
    IconSeparate,
    IconFullscreen,
    IconFullscreenExit,
  },

  data () {
    return {
      imagesModes: Object.values(ImagesModeEnum),
      isFullscreen: false,
    }
  },

  computed: {
    /**
     * @return {boolean}
     */
    isReaderPage () {
      return this.$route.name === 'index'
    },

    /**
     * @return {{
     * icon: string,
     * name: string
     * }}
     */
    currColor: function () {
      return this.$colorMode.value === 'dark'
        ? { icon: 'icon-light', name: 'Light mode' }
        : { icon: 'icon-dark', name: 'Dark mode' }
    },

    /**
     * @return {{
     * icon: string,
     * name: string
     * }}
     */
    currFullscreen: function () {
      return this.isFullscreen
        ? { icon: 'icon-fullscreen-exit', name: 'Exit Fullscreen' }
        : { icon: 'icon-fullscreen', name: 'Fullscreen' }
    },
  },

  mounted () {
    this.$nextTick(function () { // Code that will run only after the entire view has been rendered
      setInterval(() => { this.isFullscreen = DomUtils.isFullscreen() }, 1000)
    })
  },

  methods: {
    toggleColorMode () {
      this.$colorMode.preference = this.$colorMode.preference === 'dark' ? 'light' : 'dark'
    },

    getImagesModeClasses (imagesMode) {
      return {
        preferred: imagesMode === this.$store.state.imagesMode,
        selected: imagesMode === this.$store.state.imagesMode
      }
    },

    updateImagesMode (imagesMode) {
      if (imagesMode === ImagesModeEnum.CONTINUOUS) {
        this.$store.commit('setImagesMode', { imagesMode: ImagesModeEnum.CONTINUOUS })
      }
      else if (imagesMode === ImagesModeEnum.SEPARATE) {
        this.$store.commit('setImagesMode', { imagesMode: ImagesModeEnum.SEPARATE })
      }
    },

    capitalize (str) {
      return _.capitalize(str)
    },

    toggleFullscreen () {
      if (DomUtils.isFullscreen()) {
        DomUtils.closeFullscreen()
        this.isFullscreen = false
      }
      else {
        DomUtils.openFullscreen()
        this.isFullscreen = true
      }
    },
  }
}
</script>

<style scoped>
ul {
  line-height: 0;

  &.hide {
    display: none;
  }
}

ul li {
  @apply mx-2 inline-block;

  @screen -md {
    @apply mx-1;
  }
}

/* Our SVGs have the class of feather */
.feather {
  --color-primary: #41b38a;
  --color-secondary: #b5b5b5;

  width: 32px;
  position: relative;
  top: 0;
  cursor: pointer;
  padding: 5px;
  border: 2px solid transparent;
  color: var(--color-secondary);
  margin: 0;
  border-radius: 5px;
  transition: var(--color-mode-transition-time);

  &.big {
    padding: 2px;
  }

  @screen -sm {
    width: 29px;
    padding: 4px;
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.336);
  }

  &.preferred {
    border-color: var(--color-primary);
  }

  &.selected {
    color: var(--color-primary);
    border-color: var(--color-primary);
    transition: var(--color-mode-transition-time);
  }
}
</style>
