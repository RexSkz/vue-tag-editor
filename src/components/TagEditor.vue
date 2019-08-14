<template>
  <div class="wrapper">
    <div class="map">
      <span
        v-for="[key, value] in mapEntries"
        :key="key"
        class="tag-editor-span"
        contenteditable="false"
        @click="addTag(key, value)"
      >
        {{value}}
      </span>
    </div>
    <div
      ref="editor"
      class="editor"
      v-html="html"
      contenteditable="true"
      @input="onInput"
      @blur="saveCursorPos"
    />
  </div>
</template>

<script>
import getStartNode from '../utils/getStartNode'
import htmlToSource from '../utils/htmlToSource'
import sourceToHTML from '../utils/sourceToHTML'
import { getCursorPosition, setCursorPosition } from '../utils/cursor'

export default {
  name: 'TagEditor',
  props: {
    value: String,
    map: Object,
    showMap: Boolean
  },
  data () {
    return {
      html: '',
      cursorPos: 0,
      inputLock: false,
      saveLock: false
    }
  },
  computed: {
    revMap () {
      const o = {}
      for (const key in this.map) {
        o[this.map[key]] = key
      }
      return o
    },
    mapEntries () {
      return Object.entries(this.map)
    }
  },
  watch: {
    value (newValue) {
      this.setHTML(newValue)
    }
  },
  methods: {
    saveCursorPos () {
      if (this.saveLock) return
      this.saveLock = true
      this.cursorPos = getCursorPosition(this.$refs.editor)
      this.$nextTick(() => {
        this.saveLock = false
      })
    },
    onInput () {
      if (this.inputLock) return
      this.saveCursorPos()
      const html = this.$refs.editor.innerHTML
      const source = htmlToSource(html, this.revMap)
      this.$emit('input', source)
    },
    setHTML (source) {
      if (this.inputLock) return
      const html = sourceToHTML(source, this.map)
      this.html = html
      this.$nextTick(() => setCursorPosition(this.$refs.editor, this.cursorPos))
    },
    addTag (key, value) {
      if (this.inputLock) return
      this.inputLock = true
      const editor = this.$refs.editor
      const tag = document.createElement('span')
      tag.className = 'tag-editor-span'
      tag.contentEditable = 'false'
      tag.innerText = value
      const [startNode, startPos] = getStartNode(editor, this.cursorPos)
      if (startPos >= startNode.textContent.length) {
        startNode.parentNode.insertBefore(tag, startNode.nextSibling)
      } else if (startPos <= 0) {
        startNode.parentNode.insertBefore(tag, startNode)
      } else {
        const text = startNode.textContent
        const fragment = document.createDocumentFragment()
        const leftText = document.createTextNode(text.substr(0, startPos))
        const rightText = document.createTextNode(text.substr(startPos, text.length - 1))
        fragment.appendChild(leftText)
        fragment.appendChild(tag)
        fragment.appendChild(rightText)
        startNode.parentNode.replaceChild(fragment, startNode)
      }
      this.cursorPos += value.length
      const html = editor.innerHTML
      const source = htmlToSource(html, this.revMap)
      this.$emit('input', source)
      this.$nextTick(() => {
        setCursorPosition(this.$refs.editor, this.cursorPos)
        this.inputLock = false
      })
    }
  },
  mounted () {
    this.setHTML(this.value)
  }
}
</script>

<style scoped>
.map {
  margin-bottom: 1em;
}
.editor {
  min-width: 5em;
  min-height: 1em;
  border: 1px solid #bbb;
  border-radius: 4px;
  padding: 0.5em;
  line-height: 1.5em;
}
.tag-editor-span {
  margin-right: 4px;
  cursor: pointer;
  user-select: none;
}
</style>

<style>
.tag-editor-span {
  display: inline-block;
  padding: 2px 4px;
  background: #ccc;
  border-radius: 2px;
  line-height: calc(1.5em - 4px);
}
</style>
