import { m } from '../util/lib.js'

import Nav from './nav.js'
import Footer from './footer.js'

export default function Page() {
  return {
    view: vnode => [
      m(Nav),
      m('h1.title.text-center.text-primary', vnode.attrs.title),
      m('hr'),
      m('main.container', vnode.children),
      m(Footer)
    ]
  }
}
