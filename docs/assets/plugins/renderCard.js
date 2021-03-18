//default values
var defaultOptions = {
  
}

// Docsify plugin functions
function plugin(hook, vm) {
  hook.beforeEach(function (content) {
      var html = content.replace(/<!-- card:start -->/g, '<div class="start"></div>').replace(/<!-- card:end -->/g, '<div class="end"></div>');
      return html
  })
  hook.afterEach(function (html, next) {
      next(html)
      $('.start').each(function(){
        var group = $(this).nextUntil('.end')
        var card = $(group).wrapAll('<div class="card"></div>')
      })
  })
}

// Docsify plugin options
window.$docsify["card"] = Object.assign(
  defaultOptions,
  window.$docsify["card"]
)
window.$docsify.plugins = [].concat(plugin, window.$docsify.plugins)
