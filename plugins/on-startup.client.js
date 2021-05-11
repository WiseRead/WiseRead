/* eslint-disable no-console */

/**
 * @param {NuxtContext} context
 * @param {*} inject
 */
export default (context, inject) => {
  // @ts-ignore
  window.onNuxtReady(() => {
    console.log(`LAST_COMMIT_SHA: ${context.$config.LAST_COMMIT_SHA}`)
    console.log(`IS_BETA: ${context.$config.IS_BETA}`)
  })
}
