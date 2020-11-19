/**
 * UI status alert
 * el: Target element
 * status: error, warning, success
 * auto: Boolean control show/hide. true by defult
 * @param { el, status, auto } Object
 * @returns Object init
 */
const SnackBar = function ({ el, status }) {
  const defaults = { el, status: 'success' }
  const options = { ...defaults, el, status }
  const snackbar = document.getElementById(options.el)
  let timer = null

  function handlerCleanup(event) {
    if (event.animationName === 'animationSnackbarClose') {
      snackbar.classList.remove('snackbar-active--close')
      snackbar.removeAttribute('style')
      snackbar.removeEventListener('animationend', handlerCleanup)
    }
  }

  const init = {}
  init.show = function (s) {
    const delay = s || 5000
    this.open()
    timer = setTimeout(() => {
      this.close()
    }, delay)
  }
  init.open = function () {
    snackbar.setAttribute('style', 'display: block')
    setTimeout(() => snackbar.classList.add('snackbar-active--open'), 100)
    snackbar.setAttribute('aria-hidden', false)
    snackbar.addEventListener('animationend', handlerCleanup)
  }
  init.close = function () {
    snackbar.classList.add('snackbar-active--close')
    snackbar.classList.remove('snackbar-active--open')
    snackbar.setAttribute('aria-hidden', true)
    clearTimeout(timer)
  }
  return init
}
