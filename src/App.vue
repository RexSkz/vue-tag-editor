<template>
  <div id="app">
    <tag-editor :map="map" v-model="code" />
    <textarea v-model="previewText" />
  </div>
</template>

<script>
import TagEditor from './components/TagEditor'
import sourceToPreview from './utils/sourceToPreview'

export default {
  name: 'App',
  components: {
    'tag-editor': TagEditor
  },
  data () {
    return {
      map: {
        a: 'The first input',
        b: 'The second input'
      },
      values: {
        a: 1,
        b: 2
      },
      code: 'What is the {answer} <i>for</i> {a}{b}?',
      previewText: ''
    }
  },
  watch: {
    code: {
      handler (newCode) {
        this.previewText = sourceToPreview(newCode, this.values)
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
textarea {
  margin-top: 1em;
  width: 30em;
  padding: 0.5em;
}
</style>
