import Vue from 'vue'

interface ColorMode extends Vue {
  value: string
  preference: string
  unknown: Boolean
}

declare module '@nuxt/types' {
  interface Context {
    $colorMode: ColorMode
  }

  interface NuxtAppOptions {
    $colorMode: ColorMode
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $colorMode: ColorMode
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $colorMode: ColorMode
  }
}
