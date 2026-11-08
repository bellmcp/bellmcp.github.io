;(function () {
  var root = document.documentElement
  var storageKey = 'darkmode'
  var icon = function (paths) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + paths + '</svg>'
  }
  var moon = icon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />')
  var sun = icon(
    '<circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" />' +
      '<path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />' +
      '<path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" />' +
      '<path d="m19.07 4.93-1.41 1.41" />',
  )
  function isDark() {
    return root.classList.contains('darkmode--activated')
  }

  function savedPreference() {
    try {
      return localStorage.getItem(storageKey)
    } catch (e) {
      return null
    }
  }

  var button = document.createElement('button')
  button.type = 'button'
  button.className = 'theme-toggle'

  function render() {
    var dark = isDark()
    button.innerHTML = dark ? sun : moon
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode')
    button.setAttribute('aria-pressed', String(dark))
  }

  function revealRadius(x, y) {
    return Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  }

  function apply(dark, animate) {
    var swap = function () {
      root.classList.toggle('darkmode--activated', dark)
      render()
    }
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!animate || !document.startViewTransition || reducedMotion) {
      swap()
      return
    }

    var rect = button.getBoundingClientRect()
    var x = rect.left + rect.width / 2
    var y = rect.top + rect.height / 2
    var radius = revealRadius(x, y)
    var small = 'circle(0px at ' + x + 'px ' + y + 'px)'
    var large = 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'

    root.classList.add('theme-switching')
    root.classList.toggle('theme-to-light', !dark)
    var transition = document.startViewTransition(swap)
    var reveal

    transition.ready.then(function () {
      reveal = root.animate(
        { clipPath: dark ? [small, large] : [large, small] },
        {
          duration: 350,
          easing: 'ease-in-out',
          fill: 'forwards',
          pseudoElement: dark ? '::view-transition-new(root)' : '::view-transition-old(root)',
        },
      )
    })

    var done = function () {
      if (reveal) reveal.cancel()
      root.classList.remove('theme-switching', 'theme-to-light')
    }
    transition.finished.then(done, done)
  }

  button.addEventListener('click', function () {
    var dark = !isDark()
    apply(dark, true)
    try {
      localStorage.setItem(storageKey, String(dark))
    } catch (e) {}
  })

  var media = window.matchMedia('(prefers-color-scheme: dark)')
  if (media.addEventListener) {
    media.addEventListener('change', function (event) {
      if (savedPreference() === null) apply(event.matches, true)
    })
  }

  render()
  document.body.appendChild(button)
})()
