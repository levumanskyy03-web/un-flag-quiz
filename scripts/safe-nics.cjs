const os = require('os')
const original = os.networkInterfaces.bind(os)
os.networkInterfaces = () => {
  try {
    return original()
  } catch {
    return {}
  }
}
