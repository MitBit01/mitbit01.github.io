import { m } from '../util/lib.js'

import Page from '../components/page.js'

export default function SlimVtt() {
  return {
    view: () => m(Page, {title: 'SlimVTT'}, [
      m('div', {id:'terminal'})
    ])
  }
}
