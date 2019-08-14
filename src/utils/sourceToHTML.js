const re = /{([^{}]+?)}/g

export default (source, map) => {
  // first escape the html input
  source = source.replace(/</g, '&lt;')
  // then convert
  return source.replace(re, ($0, $1) => {
    const value = map[$1]
    if (typeof value === 'undefined') {
      return $0
    }
    return `<span class="tag-editor-span" contenteditable="false">${value}</span>`
  })
}
