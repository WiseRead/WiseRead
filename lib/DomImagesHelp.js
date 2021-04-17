import { DomImageData } from '~/lib/models'

import _ from 'lodash'
import jQuery from 'jquery'

/** @type {DomImageData[]} */
let g_domImagesData = []

const DomImagesHelp = {
  async updateDomImagesDataByDomAsync ({ commit }) {
    this.throttledUpdateDomImagesDataByDom({ commit })
  },

  async updateCurrImageNameByDomAsync ({ commit }) {
    this.throttledUpdateCurrImageNameByDomAsync({ commit })
  },

  throttledUpdateDomImagesDataByDom: _.throttle(function ({ commit }) {
    g_domImagesData = []
    const images = jQuery('.images-list img')

    // Stop if no images
    if (images) {
      images.each(function (index) {
        const imageElement = jQuery(this)
        const offset = imageElement.offset()?.top ?? 0
        const outerHeight = imageElement.outerHeight() ?? 0
        const imageName = imageElement.data('image-name')

        g_domImagesData.push(new DomImageData({ name: imageName, height: outerHeight, topDistance: offset }))
      })
    }

    this.updateCurrImageNameByDomAsync({ commit })
  }, 300),

  throttledUpdateCurrImageNameByDomAsync: _.throttle(function ({ commit }) {
    let finalImageName = ''

    if (g_domImagesData && g_domImagesData?.length > 0) {
      // Find the currently viewed image
      let currImageData = g_domImagesData[0]
      const viewHeight = jQuery(window).height()
      const scrollPosition = jQuery(window).scrollTop()

      if (viewHeight !== undefined && scrollPosition !== undefined) {
        for (const imageData of g_domImagesData) {
          const distanceBetweenViewMiddleAndTop = scrollPosition + (viewHeight / 2)
          if (distanceBetweenViewMiddleAndTop > imageData.topDistance) {
            currImageData = imageData
          }
          else {
            break
          }
        }

        if (currImageData.name) {
          finalImageName = currImageData.name
        }
      }
    }

    commit('updateCurrImageName', { name: finalImageName })
  }, 100),
}

export default DomImagesHelp
