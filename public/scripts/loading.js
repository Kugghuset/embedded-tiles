'use strict'

import utils from './utils';

/**
 * @param {Element|Object|String} element The element, jQuery object or queryString for the element
 * @param {Boolean} isLoading Defaults to true
 */
export const setLoading = (element, isLoading = true) => {
  // Ensure DOM element
  let _element = getElement(element);

  if (isLoading) {
    $(_element).addClass('spinner');
  } else {
    $(_element).removeClass('spinner');
  }
}

export default {
  setLoading: setLoading,
}
