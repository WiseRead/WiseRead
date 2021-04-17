<!-- See https://nuxtjs.org/blog/going-dark-with-nuxtjs-color-mode -->

<template>
  <div class="flex flex-row-reverse">
    <ul>
      <li
        v-for="color of colors"
        :key="color"
        :title="capitalize(`${color} mode`)"
      >
        <component
          :is="`icon-${color}`"
          :class="getColorClasses(color)"
          @click="$colorMode.preference = color"
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

import { ImagesModeEnum } from '~/lib/models'
import _ from 'lodash'

export default {
  components: {
    IconLight,
    IconDark,
    IconContinuous,
    IconSeparate,
  },

  data () {
    return {
      colors: ['light', 'dark'],
      imagesModes: Object.values(ImagesModeEnum)
    }
  },

  computed: {
    /**
     * @return {boolean}
     */
    isReaderPage () {
      return this.$route.name === 'index'
    }
  },

  methods: {
    getColorClasses (color) {
      // Does not set classes on ssr when preference is system (because we don't know the preference until client-side)
      if (this.$colorMode.unknown) {
        return {}
      }
      return {
        preferred: color === this.$colorMode.preference,
        selected: color === this.$colorMode.value
      }
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
    }
  }
}
</script>

<style scoped>
ul {
  line-height: 0;
  transition: opacity 0.3s;

  &.hide {
    opacity: 0;
    visibility: hidden;
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
