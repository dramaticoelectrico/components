const FOCUSABLE_ELS = [
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]',
]
const Modal = function (config) {
  const { id, trigger } = config
  const modal = document.getElementById(id)
  const modalBtn = document.getElementById(trigger)
  const closeBtn = modal.querySelectorAll('.modal-close')
  const agreeBtn = modal.querySelector('.modal-agree')
  const overlay = document.getElementById('overlay')
  const focusable = [...modal.querySelectorAll(FOCUSABLE_ELS)]
  const inertItems = createInertItems(modal)

  let activeItem = null

  function createInertItems(focusedEl) {
    const bodyFocus = [...document.body.children].filter(
      (item) => item !== focusedEl
    )
    return bodyFocus
      .map((item) => item.querySelectorAll(FOCUSABLE_ELS))
      .reduce((item, acc) => [...acc, ...item], [])
  }

  function openOverlay() {
    overlay.dataset.hidden = false
    overlay.addEventListener('transitionend', removeModalTransitions)
    setTimeout(() => overlay.classList.add('active'), 0)
  }
  function closeOverlay() {
    overlay.classList.remove('active')
    overlay.removeEventListener('click', closeOverlay)
  }

  function launchModal(e) {
    e.preventDefault()

    activeItem = e.target

    inertItems.forEach(function (item) {
      item.setAttribute('aria-hidden', true)
      item.setAttribute('tabIndex', -1)
    })

    modal.dataset.hidden = false
    modal.setAttribute('aria-hidden', false)

    modal.setAttribute('tabIndex', 1)
    focusable[0].focus()

    modal.addEventListener('transitionend', removeModalTransitions)

    setTimeout(() => modal.classList.add('active'), 0)
    openOverlay()
    closeBtn.forEach((btn) => btn.addEventListener('click', closeModal))
    agreeBtn.addEventListener('click', closeModal)
    overlay.addEventListener('click', closeModal)
  }
  function removeModalTransitions() {
    if (Array.from(this.classList).indexOf('active') > -1) return

    this.dataset.hidden = true
    this.removeEventListener('transitionend', removeModalTransitions)
  }
  function closeModal(e) {
    e.preventDefault()

    modal.classList.remove('active')
    modal.setAttribute('aria-hidden', true)
    modal.setAttribute('tabIndex', -1)

    closeOverlay()

    inertItems.forEach(function (item) {
      item.removeAttribute('aria-hidden')
      item.removeAttribute('tabIndex')
    })

    activeItem.focus()

    closeBtn.forEach((btn) => btn.removeEventListener('click', closeModal))
    agreeBtn.removeEventListener('click', closeModal)
  }

  function keyEvents(event) {
    const type = event.shiftKey && event.keyCode === 9 ? 'shiftTab' : event.code
    switch (type) {
      case 'Escape':
        closeModal(event)
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
    modalBtn.addEventListener('click', launchModal)
    modal.addEventListener('keydown', keyEvents)
  }

  return { init: init }
}
