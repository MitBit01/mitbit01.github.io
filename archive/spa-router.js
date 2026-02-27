// ========================================
// Helpers
// ========================================
function load(key) {
  return JSON.parse(window.sessionStorage.getItem(key))
}

function save(key, value) {
  value == null ? window.sessionStorage.removeItem(key) : window.sessionStorage.setItem(key, JSON.stringify(value))
}

// ========================================
// Routing
// ========================================
window.onload = () => navigate(new URL(window.location.href), false)
window.onpopstate = () => navigate(new URL(window.location.href), false)
document.body.addEventListener('click', e => {
  const anchor = e.target.closest('a')
  if (!anchor) {
    return // Bubble non-links
  }

  const targetUrl = new URL(anchor.href)
  if (!targetUrl.searchParams.get('page')) {
    return // Bubble external links
  }

  e.preventDefault()
  navigate(targetUrl, true)
})

async function navigate(/**@type {URL}*/ url, /**@type {boolean}*/ pushState) {
  let page = url.searchParams.get('page') ?? 'launcher'

  if (!pushState || (new URL(window.location).searchParams.get('page') ?? 'launcher') !== page) {
    const template = document.createElement('template')

    let res = await fetch(`./${page}.html`)
    if (res.ok) {
      template.innerHTML = await res.text()

      Array.from(template.content.querySelectorAll('script')).forEach(old => {
        const clone = document.createElement('script')
        Array.from(old.attributes).forEach(attr => clone.setAttribute(attr.name, attr.value))
        clone.text = old.text
        old.parentNode?.replaceChild(clone, old)
      })
    } else {
      template.innerHTML = '<h1>Error</h1><p></p>'
      template.content.querySelector('p').textContent = `Could not find page "${page}"`
    }

    document.body.querySelector('main').replaceChildren(template.content)
  }

  document.body.querySelector(url.hash.length > 0 ? url.hash : '#top')?.scrollIntoView()

  if (pushState) {
    window.history.pushState({}, '', url)
  }
}

// ========================================
// Dark mode
// ========================================
const disableDarkModeButton = document.body.querySelector('#disable-dark-mode')
const enableDarkModeButton = document.body.querySelector('#enable-dark-mode')

disableDarkModeButton.onclick = () => setDarkMode(false)
enableDarkModeButton.onclick = () => setDarkMode(true)

function setDarkMode(enabled) {
  save('dark-mode', enabled)
  if (enabled) {
    document.body.classList.add('dark')
    disableDarkModeButton.classList.remove('is-hidden')
    enableDarkModeButton.classList.add('is-hidden')
  } else {
    document.body.classList.remove('dark')
    disableDarkModeButton.classList.add('is-hidden')
    enableDarkModeButton.classList.remove('is-hidden')
  }
}

setDarkMode(load('dark-mode') ?? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))
