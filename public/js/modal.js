const Modal = function (config) {
  const { id, trigger } = config
  const modal = document.getElementById(id)
  const modalBtn = document.getElementById(trigger)
  const closeBtn = modal.querySelectorAll('.dialog-close')
  const agreeBtn = modal.querySelector('.dialog-agree')

  function launchDialog(e) {
    e.preventDefault()
    modal.dataset.hidden = false
    modal.setAttribute('aria-hidden', false)

    modal.addEventListener('transitionend', removeModalTransitions)

    setTimeout(() => modal.classList.add('active'), 0)

    closeBtn.forEach((btn) => btn.addEventListener('click', closeDialog))
    agreeBtn.addEventListener('click', closeDialog)
  }
  function removeModalTransitions() {
    if (Array.from(modal.classList).indexOf('active') > -1) return

    modal.dataset.hidden = true
    modal.removeEventListener('transitionend', removeModalTransitions)
  }
  function closeDialog(e) {
    e.preventDefault()

    modal.classList.remove('active')
    modal.setAttribute('aria-hidden', true)

    closeBtn.forEach((btn) => btn.removeEventListener('click', closeDialog))
    agreeBtn.removeEventListener('click', closeDialog)
  }

  function init() {
    modalBtn.addEventListener('click', launchDialog)
  }

  return { init: init }
}
