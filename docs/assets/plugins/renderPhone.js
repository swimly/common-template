//default values
var defaultOptions = {
  show: true,
  type: 'phone'
};

// Docsify plugin functions
function plugin(hook, vm) {
  if (!defaultOptions.show) {
    return false;
  }
  var iframe;
  hook.beforeEach(function (content) {
    return content;
  });
  hook.afterEach(function (html, next) {
    next(html);
    if (window.location.href.indexOf('v-') < 0) {
      $('.preview').remove()
      return false;
    }
    // 向页面添加iframe容器
    iframe = $('.preview').length ? $('.preview') : $(`
      <div class="preview ${defaultOptions.type}">
        <div class="preview-content">
          <iframe src=""></iframe>
        </div>
      </div>
    `).appendTo('main')
    // 根据类型加载页面
    var isComponent = window.location.href.indexOf('webcomponent') >= 0
    var name = window.location.href.split('v-')[1]
    name = name.substring(0, name.length - 7)
    var origin = window.location.origin
    var path = window.location.pathname
    var base = `${origin}${path}src/example/v-${name}/`
    var url = isComponent ? `${base}webcomponent.html` : `${base}`
    var ifr = iframe.find('iframe')
    ifr.attr('src', url)
  });
}

// Docsify plugin options
window.$docsify['phone'] = Object.assign(defaultOptions, window.$docsify['phone']);
window.$docsify.plugins = [].concat(plugin, window.$docsify.plugins);
