async function test(a) {
  var b = 0
  await setTimeout((a) => {
    b = a * 2
  }, 100)
  return b - 10
}

var c = 20
if(c < 20) {
  c = test(c)
} else {
  c = test(c + 10)
}

module.exports.test = test