;(function () {
  var year = String(new Date().getFullYear())
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = year
  })

  document.querySelectorAll('.back-to-top').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })


  var typer = document.querySelector('.name-typer')
  if (typer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var output = typer.querySelector('.name-typer-text')
    var caret = typer.querySelector('.name-typer-caret')
    var moveCaret = function () {
      caret.style.transform = 'translateX(' + output.offsetWidth + 'px)'
    }
    var names = ['Bell', 'เบล', 'bellmcp', 'Wutipat', 'วุฒิภัทร', '吴天培', '贝儿', 'たつはつ', 'べる']
    var split = function (text) {
      if (window.Intl && Intl.Segmenter) {
        return Array.from(new Intl.Segmenter().segment(text), function (part) {
          return part.segment
        })
      }
      return Array.from(text)
    }
    var index = 0
    var chars = split(names[0])
    var length = chars.length
    var deleting = true
    output.textContent = ''
    chars.forEach(function (text) {
      var char = document.createElement('span')
      char.textContent = text
      output.appendChild(char)
    })

    var tick = function () {
      var delay
      var typed = !deleting
      if (deleting) {
        length -= 1
        typer.classList.add('is-typing')
        delay = 60
        if (length === 0) {
          deleting = false
          index = (index + 1) % names.length
          chars = split(names[index])
          delay = 350
        }
      } else {
        length += 1
        delay = 110
        if (length === chars.length) {
          deleting = true
          typer.classList.remove('is-typing')
          delay = 2200
        }
      }
      if (!typed) {
        while (output.childNodes.length > length) {
          output.removeChild(output.lastChild)
        }
      } else {
        var char = document.createElement('span')
        char.className = 'name-typer-char'
        char.textContent = chars[length - 1]
        output.appendChild(char)
      }
      moveCaret()
      setTimeout(tick, delay)
    }

    moveCaret()
    typer.classList.add('is-ready')
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveCaret)
    window.addEventListener('resize', moveCaret)
    setTimeout(tick, 2200)
  }
})()
