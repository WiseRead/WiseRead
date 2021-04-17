import { ComicSource } from '~/lib/ComicSource'

export class ComicSourceManager {
  /**
   * @param {NuxtContext} nuxtContext
   */
  constructor (nuxtContext) {
    /** @type {ComicSource?} */
    this.source = null

    /** @type {NuxtContext} */
    this.nuxtContext = nuxtContext
  }

  /**
   * @param {ComicSource} newComicSource
   */
  updateSource (newComicSource) {
    this.source?.freeComicSource()
    newComicSource.nuxtContext = this.nuxtContext
    this.source = newComicSource
  }
}
