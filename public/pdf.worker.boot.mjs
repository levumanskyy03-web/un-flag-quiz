if (typeof Map !== 'undefined') {
  if (typeof Map.prototype.getOrInsert !== 'function') {
    Map.prototype.getOrInsert = function getOrInsert(key, value) {
      if (this.has(key)) return this.get(key)
      this.set(key, value)
      return value
    }
  }
  if (typeof Map.prototype.getOrInsertComputed !== 'function') {
    Map.prototype.getOrInsertComputed = function getOrInsertComputed(key, callback) {
      if (this.has(key)) return this.get(key)
      const value = callback(key)
      this.set(key, value)
      return value
    }
  }
}

import './pdf.worker.min.mjs'
