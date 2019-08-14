const htmlToSource = (html, map) => {
  const dom = document.createElement('div')
  dom.innerHTML = html
  return Array.from(dom.childNodes).map(node => {
    if (node.nodeName === 'DIV') {
      return '\n' + htmlToSource(node.innerHTML)
    }
    if (node.nodeName === 'SPAN' && node.className === 'tag-editor-span') {
      return '{' + map[node.innerHTML] + '}'
    }
    return node.textContent
  }).join('')
}

export default htmlToSource
