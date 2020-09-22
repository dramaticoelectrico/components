const ComboBox = function (config) {
  /**
   * config
   * form: form id
   * list: list parent id
   * input: input id
   * styles: {highligt: color}
   */

  const settings = {
    form: 'combobox-form',
    listBox: 'owned_listbox',
    input: 'search',
    styles: {
      highligt: 'background-color: rgb(175, 218, 233);',
    },
  }
  const Config = { ...settings, ...config }
  const listParent = document.getElementById(Config.listBox)
  const form = document.getElementById(Config.form)
  const input = document.getElementById(Config.input)
  let listIndex = -1
  let currentSelect = ''

  const resetListBox = () => {
    listParent.innerHTML = ''
    form.setAttribute('aria-expanded', false)
    input.focus()
  }

  function filterData(str, data) {
    if (!data.length) return resetListBox()
    const regxp = new RegExp(`^${str}`, 'gi')
    const filtered = data.filter((item) => item.match(regxp))
    buildList(filtered)
  }
  function buildList(dataList) {
    let list
    listParent.innerHTML = ''
    listIndex = -1
    if (!dataList.length || input.value === '') return resetListBox()
    form.setAttribute('aria-expanded', true)

    for (var i = 0; i < dataList.length; i++) {
      list = document.createElement('li')
      list.setAttribute('role', 'option')
      list.dataset.index = i
      list.id = 'option-' + i
      list.textContent = dataList[i]
      listParent.append(list)
    }
  }

  function traverseList(listIndex) {
    listParent.querySelectorAll('li').forEach((item) => {
      item.removeAttribute('style')
      item.removeAttribute('aria-selected')
    })
    let select = listParent.querySelector('#option-' + listIndex)

    if (!select) return

    select.setAttribute('style', Config.styles.highligt)
    select.setAttribute('aria-selected', 'true')
    input.value = select.textContent
    currentSelect = select.textContent
  }

  function keyCodeEvents(event) {
    const els = listParent.querySelectorAll('li')

    if (!els.length) return

    switch (event.code) {
      case 'ArrowUp':
        setTimeout(
          () => (event.target.selectionStart = currentSelect.length),
          0
        )
        if (listIndex < 0) return
        traverseList((listIndex = listIndex - 1))
        break
      case 'ArrowDown':
        if (els.length - 1 <= listIndex) listIndex = -1
        traverseList((listIndex = listIndex + 1))
        break
      case 'ArrowRight':
        event.target.selectionStart = currentSelect.length
        break
      case 'ArrowLeft':
        event.target.selectionStart = 0
        break
      case 'Escape':
        if (listParent.children) resetListBox()
        break
      case 'Enter':
        event.preventDefault()
        if (!els[listIndex]) return
        input.value = els[listIndex].textContent
        resetListBox()
        break
      default:
        console.warn('a key event ran through ', event.code)
    }
  }

  function formSubmit(e) {
    e.preventDefault()
    console.log(input.value, ' === submit do submit')
    resetListBox()
    input.value = ''
  }
  function handleListClick(e) {
    if (e.target.nodeName === 'LI') {
      input.value = e.target.textContent
      resetListBox()
    }
  }

  /**
   * API Events
   */

  form.addEventListener('submit', formSubmit)
  input.addEventListener('keydown', keyCodeEvents)
  listParent.addEventListener('click', handleListClick)

  return {
    filterData: filterData,
  }
}
