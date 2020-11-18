const SnackBar = function ({ el, status }) {
  const snackbar = document.getElementById(el)
  const dimensions = snackbar.getBoundingClientRect()
  const init = {}
  init.open = function () {
    snackbar.classList.add('active')
    snackbar.setAttribute('aria-hidden', false)
  }
  init.close = function () {
    snackbar.classList.remove('active')
    snackbar.setAttribute('aria-hidden', true)
  }
  return init
}
