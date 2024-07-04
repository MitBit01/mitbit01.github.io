import { m } from '../util/lib.js'

export default function Nav() {
  return {
    view: () =>
      m('nav.nav', [
        m('div.nav-left', [
          m(m.route.Link, {class:m.route.get() === '/' ? 'brand active' : 'brand', href:'/'}, 'BrowserToys'),
          m('div.tabs', [
            m(m.route.Link, {class:m.route.get() === '/bead-encoding' ? 'active' : '', href:'/bead-encoding'}, 'Bead Encoding'),
            m(m.route.Link, {class:m.route.get() === '/cy-borg-generator' ? 'active' : '', href:'/cy-borg-generator'}, 'Cy_Borg Generator'),
            m(m.route.Link, {class:m.route.get() === '/slim-vtt' ? 'active' : '', href:'/slim-vtt'}, 'SlimVTT')
          ])
        ])
      ])
  }
}
