import JsonURL from 'https://cdn.jsdelivr.net/npm/@jsonurl/jsonurl/+esm'

export async function serialize(val) {
  const str = JsonURL.stringify(val, { AQF: true, noEmptyComposite: true })
  const cmp = await compress(str, 'deflate-raw')
  const enc = cmp.toBase64({ alphabet: 'base64url', omitPadding: true })
  return enc
}

export async function deserialize(enc) {
  const cmp = Uint8Array.fromBase64(enc, { alphabet: 'base64url' })
  const str = await decompress(cmp, 'deflate-raw')
  const val = JsonURL.parse(str, { AQF: true, noEmptyComposite: true })
  return val
}

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
