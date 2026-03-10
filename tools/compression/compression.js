import $ from 'https://cdn.jsdelivr.net/npm/jquery/+esm'

/**@type {JQuery<HTMLTextAreaElement>}*/
const $inp = $('#txa-input')

async function compress(str, algo) {
  const stream = new Blob([str])
    .stream()
    .pipeThrough(new CompressionStream(algo))
  return Promise.resolve(stream)
    .then(stream => new Response(stream))
    .then(resp => resp.blob())
    .then(blob => blob.arrayBuffer())
    .then(buf => new Uint8Array(buf))
}

async function decompress(bytes, algo) {
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream(algo))
  const arr = await Promise.resolve(stream)
    .then(stream => new Response(stream))
    .then(resp => resp.blob())
    .then(blob => blob.arrayBuffer())
    .then(buf => new Uint8Array(buf))
  return new TextDecoder().decode(arr)
}

$inp.on('input', async function () {
  // Handle empty input
  let txt = this.value
  if (txt === '') {
    $('pre.out').text('\n')
    $('span.out').text('0')
    return
  }

  // Minify if JSON
  try {
    txt = JSON.stringify(JSON.parse(txt));
  } catch (e) {
    // Do nothing, don't worry if not JSON
  }

  ['deflate-raw', 'brotli'].forEach(async (algo) => {
    const bytes = await compress(txt, algo)

    const hex = bytes.toHex()
    $(`pre.out.hex.${algo}`).text(hex)
    $(`span.out.hex.${algo}`).text(hex.length)

    const b64 = bytes.toBase64({ alphabet: 'base64url', omitPadding: true })
    $(`pre.out.b64.${algo}`).text(b64)
    $(`span.out.b64.${algo}`).text(b64.length)

    if (txt !== await decompress(bytes, algo))
      console.error(`Decompressed text does not match for algo ${algo}.`)
  });
})

/*
{
  "v": 1,
  "round": 1,
  "turn": 1,
  "p": [
    {
      "n": "name one",
      "d": [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      "h": [8,9,10],
      "f": [7],
      "s": [1,2,3,4,5],
      "m": [6]
    },
    {
      "n": "name two",
      "d": [11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
      "h": [6,7,8,9,10],
      "s": [1,2,3,4,5]
    }
  ]
}
*/

// (v:1,round:1,turn:1,p:((n:name+one,d:(11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30),h:(8,9,10),f:(7),s:(1,2,3,4,5),m:(6)),(n:name+two,d:(11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30),h:(6,7,8,9,10),s:(1,2,3,4,5))))

/*
[
118234, 361466, 425871, 326704, 282732, 244478,
324758, 110614, 456937, 658792, 702462, 731055,
563777, 729269, 684608, 531314, 469833, 427651,
852367, 378297, 213547, 151127, 869008, 197513,
728308, 735982, 801504, 101799, 773673, 709813,
987423, 298728, 882510, 538577, 429910, 336452,
887042, 990637, 224123, 319361, 449138, 494233,
320588, 948089, 316134, 271013, 949072, 220441,
231340, 890771, 995446, 448260, 582578, 138402,
326399, 611715, 643965, 710715, 871157, 959087,
208864, 433819, 729922, 990275, 306381, 576864,
641347, 259413, 804304, 771208, 553904, 229157,
162939, 853818, 233211, 805522, 286848, 865123,
105571, 548513, 395423, 316618, 913481, 405268,
689638, 804231, 822689, 510453, 533141, 609718,
294365, 924084, 861968, 542223, 523568, 181187,
752196, 714154, 561922, 619574
]
*/

// (118234,361466,425871,326704,282732,244478,324758,110614,456937,658792,702462,731055,563777,729269,684608,531314,469833,427651,852367,378297,213547,151127,869008,197513,728308,735982,801504,101799,773673,709813,987423,298728,882510,538577,429910,336452,887042,990637,224123,319361,449138,494233,320588,948089,316134,271013,949072,220441,231340,890771,995446,448260,582578,138402,326399,611715,643965,710715,871157,959087,208864,433819,729922,990275,306381,576864,641347,259413,804304,771208,553904,229157,162939,853818,233211,805522,286848,865123,105571,548513,395423,316618,913481,405268,689638,804231,822689,510453,533141,609718,294365,924084,861968,542223,523568,181187,752196,714154,561922,619574)
