! function () {
  function e() {
    $('#online').click(function(){
      var isComponent = window.location.href.indexOf('webcomponent') >= 0
      var arr = window.location.href.split('/')
      var name = arr[arr.length - 2]
      var base = `${window.location.origin}${window.location.pathname}src/example/${name}`
      var url = isComponent ? `${base}/webcomponent.html` : `${base}/index.html`
      console.log(url)
      $.get(url, function (html) {
        createMonaco('monaco', '在线编辑', html)
      });
      return false;
      createMonaco('monaco', '在线编辑器')
    })
  }
  window.$docsify.plugins = [].concat(function (o) {
    o.doneEach(e)
  }, window.$docsify.plugins)
}();
