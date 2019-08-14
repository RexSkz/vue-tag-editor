const re = /{([^{}]+?)}/g

export default (source, map) => source.replace(re, ($0, $1) => {
  const value = map[$1]
  if (typeof value === 'undefined') {
    return $0
  }
  return value
})
