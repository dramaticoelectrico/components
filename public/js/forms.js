;(function () {
  const fileField = document.getElementById('upload')
  const label = document.querySelector('.form-upload label')
  const uploadFileName = document.querySelector('.upload-filename')
  function getFileName(event) {
    if (!this.files.length) return

    const filename = this.files[0].name
    uploadFileName.textContent = 'file :: ' + filename
    label.className += 'active'
  }

  fileField.addEventListener('change', getFileName)
})()
