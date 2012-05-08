var repl = require('repl'),
    raven = require('./raven')

var useStore = function(url) {
  r.context.store = raven.use(url)
  r.context.db = r.context.store.defaultDb
}

console.log('RavenDB shell')

var r = repl.start("> ")

r.defineCommand('store', {
	help: 'Use the RavenDB datastore at a url ".store <url>"',
  action: function(url) {
    useStore(url)
    console.log('Using datastore at: ' + url)
    r.displayPrompt()
  }
})

r.defineCommand('collections', {
  help: 'Show all collections in the current database',
  action: function() {
    try {
      r.context.db.getCollections(function(err, collections) { 
        if (err) console.log(err)
        else if (!collections) console.log("No collections found.")
        else {
          for(var i=0; i < collections.length; i++) {
            r.outputStream.write(collections[i] + '\n')
          }
//          collections.forEach(function(collection) {
//            r.outputStream.write(collection + '\n')
//          })
        }
        r.displayPrompt()
      })
    } catch (e) {
      console.log(e)
      r.displayPrompt()
    }
  }
})

useStore('http://localhost:8080')
