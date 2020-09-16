;(function () {
  const listParent = document.getElementById('owned_listbox')
  const form = document.getElementById('combobox-form')
  const input = document.getElementById('search')
  let listIndex = -1

  const getData = async (val) => {
    const request = await fetch('http://127.0.0.1:5500/api/dogs.json?=' + val)
    const response = await request.json()
    return response.dogs
  }
  const resetListBox = () => {
    listParent.innerHTML = ''
    form.setAttribute('aria-expanded', false)
    input.focus()
  }

  function filterData(str, data) {
    if (!data.length) return resetListBox()
    const regxp = new RegExp(`^${str}`, 'gi')
    return data.filter((item) => item.match(regxp))
  }
  function buildList(dataList) {
    let list
    listParent.innerHTML = ''
    listIndex = -1
    if (!dataList.length) return resetListBox()
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
  async function createDataList(e) {
    const query = e.target.value
    if (!query) return resetListBox()

    const response = await getData(query)
    const filterd = filterData(query, response)

    buildList(filterd)
  }
  function traverseList(listIndex) {
    listParent.querySelectorAll('li').forEach((item) => {
      item.removeAttribute('style')
      item.removeAttribute('aria-selected')
    })
    let select = listParent.querySelector('#option-' + listIndex)

    if (!select) return

    select.setAttribute('style', 'background:#d2d2d2;')
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
        listParent.innerHTML = ''
        break
      default:
        console.log('looks like an error or missed')
    }
  }

  function formSubmit(e) {
    e.preventDefault()
    console.log(input.value, ' === submit do submit')
    input.value = ''
  }
  function handleListClick(e) {
    if (e.target.nodeName === 'LI') {
      input.value = e.target.textContent
      resetListBox()
    }
  }
  /**
   * Events
   */
  input.addEventListener('input', createDataList)
  form.addEventListener('submit', formSubmit)
  input.addEventListener('keydown', keyCodeEvents)
  listParent.addEventListener('click', handleListClick)
})()
