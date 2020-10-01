const FOCUSABLE_ELS = [
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]',
]
const Modal = function (config) {
  const { id, trigger } = config
  const modal = document.getElementById(id)
  const modalBtn = document.getElementById(trigger)
  const closeBtn = modal.querySelectorAll('.dialog-close')
  const agreeBtn = modal.querySelector('.dialog-agree')
  const focusable = [...modal.querySelectorAll(FOCUSABLE_ELS)]

  function launchDialog(e) {
    e.preventDefault()
    modal.dataset.hidden = false
    modal.setAttribute('aria-hidden', false)
    modal.setAttribute('tabIndex', '1')
    modal.focus()

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
    modal.setAttribute('tabIndex', '-1')

    closeBtn.forEach((btn) => btn.removeEventListener('click', closeDialog))
    agreeBtn.removeEventListener('click', closeDialog)
  }

  function keyEvents(event) {
    const type = event.shiftKey && event.keyCode === 9 ? 'shiftTab' : event.code
    switch (type) {
      case 'Escape':
        closeDialog(event)
        break
      case 'Tab':
        if (document.activeElement === focusable[focusable.length - 1]) {
          focusable[0].focus()
          event.preventDefault()
        }
        break
      case 'shiftTab':
        if (document.activeElement === focusable[0]) {
          focusable[focusable.length - 1].focus()
          event.preventDefault()
        }
        break
      default:
        console.log(type)
        return
    }
  }

  function init() {
    modalBtn.addEventListener('click', launchDialog)
    modal.addEventListener('keydown', keyEvents)
  }

  return { init: init }
}
