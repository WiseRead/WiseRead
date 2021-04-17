/**
 * Handle array in Vue
 */

import Vue from 'vue'

export const VArray = {
  /**
   * @param {any[]} arr
   * @param {number} index1
   * @param {number} index2
   */
  swap (arr, index1, index2) {
    const temp = arr[index1]
    Vue.set(arr, index1, arr[index2])
    Vue.set(arr, index2, temp)
  },

  /**
   * Find first duplication in array
   * @param {any[]} arr
   * @return {[number, number]} Tuple of [origin_index, duplication_index],
   * or [-1, -1] if no duplication was found.
   */
  firstDuplicateIndex (arr) {
    for (let i = 1; i < arr.length; i++) {
      for (let i2 = 0; i2 < i; i2++) {
        if (arr[i] === arr[i2]) {
          return [i2, i]
        };
      }
    };

    return [-1, -1]
  },
}
