;(function () {
  var year = String(new Date().getFullYear())
  document.querySelectorAll('.current-year').forEach(function (el) {
    el.textContent = year
  })

  var header = document.querySelector('header')
  var firstBar = document.querySelector('section .followMeBar')
  var naturalTop = function (el) {
    var position = el.style.position
    el.style.position = 'static'
    var top = el.getBoundingClientRect().top + window.scrollY
    el.style.position = position
    return top
  }
  if (header && window.ResizeObserver) {
    var sidebar = window.matchMedia('(min-width: 768px)')
    var compactLevels = ['sidebar-compact', 'sidebar-compact-more', 'sidebar-compact-most']
    var fitSize = null
    var fitSidebar = function (gap, force) {
      var size = [window.innerWidth, window.innerHeight]
      if (!force && fitSize && fitSize[0] === size[0] && Math.abs(fitSize[1] - size[1]) < 120) return
      fitSize = size
      var root = document.documentElement
      root.classList.remove.apply(root.classList, compactLevels)
      if (!sidebar.matches) return
      for (var i = 0; i < compactLevels.length; i++) {
        if (header.offsetHeight + gap + 16 <= window.innerHeight) return
        root.classList.add(compactLevels[i])
      }
    }
    var placeHeader = function (force) {
      var gap = parseFloat(getComputedStyle(document.body).paddingTop) || 0
      fitSidebar(gap, force === true)
      var top = Math.min(gap, window.innerHeight - header.offsetHeight - 16)
      document.documentElement.style.setProperty('--header-top', top + 'px')
      if (firstBar) {
        var barTop = Math.max(0, naturalTop(firstBar))
        document.documentElement.style.setProperty('--bar-top', barTop + 'px')
      }
    }
    new ResizeObserver(function () {
      placeHeader()
    }).observe(header)
    window.addEventListener('resize', function () {
      placeHeader()
    })
    placeHeader(true)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        placeHeader(true)
      })
    }
  }

  var stickyBars = document.querySelectorAll('section .followMeBar')
  if (stickyBars.length) {
    var pending = false
    var markStuck = function () {
      pending = false
      stickyBars.forEach(function (bar) {
        var top = parseFloat(getComputedStyle(bar).top) || 0
        bar.classList.toggle('is-stuck', bar.getBoundingClientRect().top <= top + 0.5)
      })
    }
    var queue = function () {
      if (pending) return
      pending = true
      requestAnimationFrame(markStuck)
    }
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    markStuck()
  }

  document.querySelectorAll('.back-to-top').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  })


  var nav = document.getElementById('navigation-menu')
  var toggle = document.querySelector('.theme-toggle')
  if (nav && toggle) {
    var root = document.documentElement
    var floating = window.matchMedia('(max-width: 960px)')
    var placeToggle = function () {
      var links = nav.querySelectorAll('.nav-link')
      if (!floating.matches || !links.length) {
        root.classList.remove('nav-merged')
        return
      }
      var first = links[0].getBoundingClientRect()
      var last = links[links.length - 1].getBoundingClientRect()
      var base = last.right - first.left + 12
      root.style.setProperty('--nav-half', base / 2 + 'px')
      root.classList.toggle('nav-merged', root.clientWidth < base + 2 * (16 + 48 + 8))
    }
    var indicator = document.createElement('span')
    indicator.className = 'nav-indicator'
    indicator.setAttribute('aria-hidden', 'true')
    nav.insertBefore(indicator, nav.firstChild)
    var placeIndicator = function () {
      var active = nav.querySelector('.nav-link.active')
      if (!active) {
        indicator.style.opacity = '0'
        return
      }
      indicator.style.opacity = '1'
      indicator.style.width = active.offsetWidth + 'px'
      indicator.style.height = active.offsetHeight + 'px'
      indicator.style.transform =
        'translate(' + active.offsetLeft + 'px, ' + active.offsetTop + 'px)'
    }
    var layout = function () {
      placeToggle()
      placeIndicator()
    }
    layout()
    requestAnimationFrame(function () {
      nav.classList.add('has-indicator')
    })
    new MutationObserver(placeIndicator).observe(nav, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })
    window.addEventListener('resize', layout)
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout)
    nav.addEventListener('transitionend', function (event) {
      if (event.target === nav) placeIndicator()
    })
  }

  var bars = document.querySelectorAll('section .followMeBar')
  var footer = document.querySelector('.site-footer')
  if (bars.length > 1 && footer) {
    var lastBar = bars[bars.length - 1]
    var fitTail = function () {
      footer.style.marginTop = ''
      var position = lastBar.style.position
      lastBar.style.position = 'static'
      var top = lastBar.getBoundingClientRect().top + window.scrollY
      lastBar.style.position = position
      top -= parseFloat(getComputedStyle(lastBar).top) || 0
      var gap = Math.max(window.innerHeight, document.documentElement.clientHeight) - (document.documentElement.scrollHeight - top)
      if (gap > 0) footer.style.marginTop = Math.ceil(gap) + parseFloat(getComputedStyle(footer).marginTop) + 'px'
    }
    var fitWidth = window.innerWidth
    fitTail()
    window.addEventListener('resize', function () {
      if (window.innerWidth === fitWidth) return
      fitWidth = window.innerWidth
      fitTail()
    })
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTail)
  }

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
