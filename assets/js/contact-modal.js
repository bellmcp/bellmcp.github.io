;(function () {
  var modal = document.querySelector('.contact-modal')
  if (!modal || typeof modal.showModal !== 'function') return

  var form = modal.querySelector('form')
  var title = modal.querySelector('.contact-modal-title')
  var lead = modal.querySelector('.contact-modal-lead')
  var topic = form.elements.topic
  var message = form.elements.message
  var copy = modal.querySelector('.contact-copy')
  var email = copy.getAttribute('data-email')
  var copyLabel = copy.firstChild.textContent

  var modes = {
    talk: {
      title: "Let's talk",
      lead: "Say hi, ask a question, or tell me about your project. I'll reply within a few days.",
      placeholder: "What's on your mind?",
      topic: 'Just saying hi',
    },
    contact: {
      title: "Let's talk",
      lead: "Tell me a bit about your project. I'll reply within a few days.",
      placeholder: 'What are you building, and when do you need it?',
      topic: 'Consulting & mentoring',
    },
    pricing: {
      title: 'Request pricing guidelines',
      lead: "Share what you have in mind and I'll send pricing that fits your project.",
      placeholder: 'Type of work, scope, and timeline',
      topic: 'Pricing guidelines',
    },
  }

  function open(mode) {
    var config = modes[mode] || modes.contact
    title.textContent = config.title
    lead.textContent = config.lead
    message.placeholder = config.placeholder
    topic.value = config.topic
    modal.showModal()
    document.documentElement.classList.add('modal-open')
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) form.elements.name.focus()
    else modal.focus()
  }

  document.querySelectorAll('[data-contact-modal]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault()
      open(link.getAttribute('data-contact-modal'))
    })
  })

  form.addEventListener('submit', function (event) {
    var action = event.submitter && event.submitter.value
    if (action !== 'send') return
    var name = form.elements.name.value.trim()
    var subject = topic.value + ' - ' + name
    var body = 'Hi Bell,\n\n' + message.value.trim() + '\n\n' + name
    window.location.href =
      'mailto:' + email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body)
  })

  modal.addEventListener('click', function (event) {
    if (event.target === modal) modal.close()
  })

  modal.addEventListener('close', function () {
    document.documentElement.classList.remove('modal-open')
  })

  copy.addEventListener('click', function () {
    var done = function () {
      copy.firstChild.textContent = 'Copied '
      copy.classList.add('is-copied')
      setTimeout(function () {
        copy.firstChild.textContent = copyLabel
        copy.classList.remove('is-copied')
      }, 1600)
    }
    if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, function () {})
  })
})()
