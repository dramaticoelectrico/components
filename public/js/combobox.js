;(function (config) {
  /**
   * config
   * data: object
   * form: form id
   * list: list parent id
   * input: input id
   * styles: {highligt: color}
   */

  const listParent = document.getElementById('owned_listbox')
  const form = document.getElementById('combobox-form')
  const input = document.getElementById('search')
  let listIndex = -1

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

    select.setAttribute('style', 'background-color: rgb(175, 218, 233);')
    select.setAttribute('aria-selected', 'true')
    input.value = select.textContent
  }

  function keyCodeEvents(event) {
    const els = listParent.querySelectorAll('li')
    const chars = event.target.value.length

    if (!els.length) return

    switch (event.code) {
      case 'ArrowUp':
        setTimeout(() => (event.target.selectionStart = chars), 0)
        if (listIndex < 0) return
        traverseList((listIndex = listIndex - 1))
        break
      case 'ArrowDown':
        if (els.length - 1 <= listIndex) listIndex = -1
        traverseList((listIndex = listIndex + 1))
        break
      case 'ArrowRight':
        event.target.selectionStart = chars
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
   * getData()
   * @param {String} val
   */
  const getData = async (val) => {
    try {
      const request = await fetch('http://127.0.0.1:5500/api/dogs.json?=' + val)
      return await request.json()
    } catch (error) {
      console.error({ error, method: 'getData()' })
    }
  }
  /**
   * createDataList()
   * Outside function to use with API
   * @param {Object} e
   */
  async function createDataList(e) {
    const query = e.target.value
    const response = await getData(query)

    // call the api method here
    filterData(query, response.dogs)

    // buildList(filterd)
  }
  input.addEventListener('input', createDataList)

  /**
   * API Events
   */

  form.addEventListener('submit', formSubmit)
  input.addEventListener('keydown', keyCodeEvents)
  listParent.addEventListener('click', handleListClick)
})()
