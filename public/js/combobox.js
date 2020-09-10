;(function () {
  const listParent = document.getElementById('owned_listbox')
  const form = document.getElementById('combobox-form')
  const input = document.getElementById('search')

  const getData = async (val) => {
    const request = await fetch('http://127.0.0.1:5500/api/dogs.json?=' + val)
    return await request.json()
  }
  const resetListBox = () => {
    listParent.innerHTML = ''
    form.setAttribute('aria-expanded', false)
  }

  const filterData = async (e) => {
    if (!e.target.value) return resetListBox()
    const data = await getData(e.target.value)
    const regxp = new RegExp(`^${e.target.value}`, 'gi')
    buildList(data.dogs.filter((item) => item.match(regxp)))
  }

  const buildList = (dataList) => {
    let list
    listParent.innerHTML = ''
    if (!dataList.length) return resetListBox()
    form.setAttribute('aria-expanded', true)

    for (var i = 0; i < dataList.length; i++) {
      list = document.createElement('li')
      list.setAttribute('role', 'option')
      list.setAttribute('id', 'option-' + i)
      list.textContent = dataList[i]
      listParent.append(list)
    }
  }

  input.addEventListener('input', filterData)
})()
