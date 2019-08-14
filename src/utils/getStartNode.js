export default (target, pos) => {
  const children = target.childNodes
  let startNode = null
  if (pos >= target.textContent.length) {
    const textNode = document.createTextNode(' ')
    target.appendChild(textNode)
    startNode = textNode
    pos = 0
  } else if (pos >= children[0].textContent.length) {
    let index = 0
    do {
      pos -= children[index].textContent.length
      index++
    } while (
      index + 1 < children.length &&
      pos >= children[index].textContent.length
    )
    startNode = children[index]
  } else {
    startNode = children[0]
  }
  if (startNode.nodeName !== '#text' && !pos) {
    if (startNode.previousSibling && startNode.previousSibling.nodeName === '#text') {
      startNode = startNode.previousSibling
      pos = startNode.textContent.length
    } else {
      const textNode = document.createTextNode(' ')
      startNode.parentNode.insertBefore(textNode, startNode)
      startNode = textNode
    }
  }
  return [startNode, pos]
}
