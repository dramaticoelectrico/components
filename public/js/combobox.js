;(function () {
  const listParent = document.getElementById('owned_listbox')
  const form = document.getElementById('combobox-form')
  const input = document.getElementById('search')
  let index = -1

  const getData = async (val) => {
    const request = await fetch('http://127.0.0.1:5500/api/dogs.json?=' + val)
    const response = await request.json()
    return response.dogs
  }
  const resetListBox = () => {
    listParent.innerHTML = ''
    form.setAttribute('aria-expanded', false)
  }

  function filterData(str, data) {
    if (!data.length) return resetListBox()
    const regxp = new RegExp(`^${str}`, 'gi')
    return data.filter((item) => item.match(regxp))
  }
  function buildList(dataList) {
    let list
    listParent.innerHTML = ''
    index = -1
    if (!dataList.length) return resetListBox()
    form.setAttribute('aria-expanded', true)

    for (var i = 0; i < dataList.length; i++) {
      list = document.createElement('li')
      list.setAttribute('role', 'option')
      list.setAttribute('data-index', i)
      list.setAttribute('id', 'option-' + i)
      list.textContent = dataList[i]
      listParent.append(list)
    }
  }
  function traverseList(index) {
    listParent.querySelectorAll('li').forEach((item) => {
      item.removeAttribute('style')
      item.removeAttribute('aria-selected')
    })
    console.log(index)
    let select = listParent.querySelector('#option-' + index)

    if (!select) return

    select.setAttribute('style', 'background:red;')
    select.setAttribute('aria-selected', 'true')
  }

  function keyCodeEvents(type) {
    const els = listParent.querySelectorAll('li')

    if (!els.length) return
    switch (type.code) {
      case 'ArrowUp':
        // traverseList(index)
        if (index < 0) return
        traverseList((index = index - 1))
        break
      case 'ArrowDown':
        // traverseList(index)
        if (els.length - 1 <= index) index = -1
        traverseList((index = index + 1))
        break
      case 'ArrowRight':
        console.log('key right')
        break
      case 'ArrowLeft':
        console.log('key left')
        break
      case 'Escape':
        console.log('Escape')
        break
      case 'Enter':
        console.log('Enter')
        break
      default:
        console.log('looks like an error or missed')
    }
  }
  async function createDataList(e) {
    const query = e.target.value
    if (!query) return resetListBox()

    const response = await getData(query)
    const filterd = filterData(query, response)

    buildList(filterd)
  }
  input.addEventListener('input', createDataList)
  form.addEventListener('submit', (e) => e.preventDefault())
  input.addEventListener('keydown', keyCodeEvents)
})()
