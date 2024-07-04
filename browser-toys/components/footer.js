import { m } from '../util/lib.js'

export default function Footer() {
  return {
    view: () => m('footer.container', m('a', {onclick:() => window.scrollTo({top: 0, left: 0, behavior: 'smooth'})}, '[Top]'))
  }
}
