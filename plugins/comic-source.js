import { ComicSourceManager } from '~/lib/ComicSourceManager'

/**
 * @param {NuxtContext} context
 * @param {any} inject
 */
export default (context, inject) => {
  const comicSourceManager = new ComicSourceManager(context)

  // Inject in Vue, context and store
  inject('comicSource', comicSourceManager)
}
