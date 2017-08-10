// murmurhash2 via https://gist.github.com/raycmorgan/588423

export default function (str, seed) {
  let hash = 0, i, chr

  if (str.length === 0) return hash

  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0
  }

  return hash
}
