Array.fromArgs = function (args) {
  return [].slice.call(args, 0)
}

Array.map = function (arr, key) {
  if (!Array.isArray(arr)) return []
  if (!key) return arr
  if (typeof key === 'function') return arr.map(key)
  return arr.map(function (item) {
    return item[key]
  })
}

Array.head = function (arr) {
  if (!Array.isArray(arr)) return
  if (arr[0]) return arr[0]
}
