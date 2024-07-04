import { m } from './util/lib.js'

import Home from './pages/home.js'
import BeadEncoding from './pages/bead-encoding.js'
import CyBorgGenerator from './pages/cy-borg-generator.js'
import SlimVtt from './pages/slim-vtt.js'

m.route(document.body, '/', {
  '/': Home,
  '/bead-encoding': BeadEncoding,
  '/cy-borg-generator': CyBorgGenerator,
  '/slim-vtt': SlimVtt,
})
