import { m } from '../util/lib.js'

import Page from '../components/page.js'

export default function Home() {
  return {
    view: () => m(Page, {title: 'BrowserToys'}, [
      m('p', 'BrowserToys is a simple framework to spin up applets.'),
      m('p', 'It can be run as a static site without any build tools.'),
      m('p', [
        'Using ',
        m('a', {href:'https://mithril.js.org/',target:'_blank'}, 'Mithril.js'),
        ' and ',
        m('a', {href:'https://jenil.github.io/chota/',target:'_blank'}, 'chota'),
        '.']),
    ])
  }
}
