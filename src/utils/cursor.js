import getStartNode from './getStartNode'

export function getCursorPosition (target) {
  if (target && target.contentEditable) {
    const focused = target.focused
    target.focus()
    let _range = document.getSelection().getRangeAt(0)
    let range = _range.cloneRange()
    range.selectNodeContents(target)
    range.setEnd(_range.endContainer, _range.endOffset)
    if (!focused) target.blur()
    return range.toString().length
  }
  return target.selectionStart
}

export function setCursorPosition (target, pos) {
  if (target && target.contentEditable) {
    const range = document.createRange()
    const sel = window.getSelection()
    const [startNode, startPos] = getStartNode(target, pos)
    try {
      range.setStart(startNode, startPos)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    } catch (_) {
      // no-op
    }
  } else {
    target.setSelectionRange(pos, pos)
  }
}
