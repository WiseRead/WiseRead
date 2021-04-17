/**
 * 'comicSource' plugin type declarations.
 * See https://typescript.nuxtjs.org/cookbook/plugins.html
 */

import './vuex'
import { ComicSourceManager } from '../lib/ComicSourceManager'

declare module '@nuxt/types' {
  interface Context {
    $comicSource: ComicSourceManager
  }

  interface NuxtAppOptions {
    $comicSource: ComicSourceManager
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $comicSource: ComicSourceManager
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $comicSource: ComicSourceManager
  }
}
