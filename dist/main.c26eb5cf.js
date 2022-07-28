// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {


// 取出localStorage里寄放在x里面的hashMap字符串
var x = localStorage.getItem('x');
// 转为对象：XObject记录包含打开的网页的hashMap对象
var xObject = JSON.parse(x);
console.log(xObject);
// hashMap来存储网站（li标签）：初始存A站、B站；但当要从打开的网页返回时，hashMap取XObject
var hashMap = xObject || [{ logo: 'A', url: 'https://www.acfun.cn' }, { logo: 'B', url: 'https://www.bilibili.com' }];
console.log(hashMap);
var $siteList = $('.siteList');
var $lastLi = $siteList.find('.lastLi');
/* <li>
        <a href="https://www.bilibili.com/">
            <div class="site">
                <div class="logo">
                    <img src="./images/bilibili.png" alt="">
                </div>
                <div class="link">bilibili.com</div>
            </div>
        </a>
</li> */

var simplifyUrl = function simplifyUrl(url) {
    return url.replace('http://', '').replace('https://', '').replace('www.', '').replace(/\/.*/, '');
    // 最后，配合正则表达式删除 com 之后 以 / 开头的所有字符
};

// 遍历渲染hashMap的每个网点对象：插入到.siteList，且插在新增按钮前面
var render = function render() {
    // hashMap元素渲染到.siteList之前，把.siteList现有的除最后 新增按钮 以外的 li 全删除，再渲染hashMap
    $siteList.find('li:not(.lastLi)').remove();
    hashMap.forEach(function (node, index) {
        var $li = $('\n        <li>\n            <div class="site">\n                <div class="logo">' + node.logo + '</div>\n                <div class="link">' + simplifyUrl(node.url) + '</div>\n                <div class="close">\n                    <svg class="icon-close">\n                    <use href="#close-small"></use>\n                </svg>\n                </div>\n            </div>\n        </li>\n        ').insertBefore($lastLi);
        $li.on('click', function () {
            window.open(node.url);
        });
        // 点击.close，阻止冒泡
        $li.on('click', '.close', function (e) {
            e.stopPropagation();
            hashMap.splice(index, 1);
            // 对hashMap删除站点，故删除后要重新渲染hashMap
            render();
        });
    });
};
// 用render提交hashMap初始存储的网站
render();

// 处理新增站点
$('.addButton').on('click', function () {
    var url = window.prompt('请问想添加的网址是啥');
    // 若http在URL里出现的位置不是从0开始
    if (url.indexOf('http') !== 0) {
        url = 'https://' + url;
    }
    hashMap.push({
        logo: simplifyUrl(url)[0].toUpperCase(),
        url: url
    });
    render();
});

// 用localStorage存储hashMap，当从打开的网页返回的时候，可以再读取localStorage里的hashMap，防止丢失站点
window.onbeforeunload = function () {
    // localStorage只能存字符串，故先把hashMap对象转为字符串
    var string = JSON.stringify(hashMap);
    // 在本地存储localStorage里设置x存string
    localStorage.setItem('x', string);
};

$(document).on('keypress', function (e) {
    var key = e.key;
    for (var i = 0; i < hashMap.length; i++) {
        if (key === hashMap[i].logo || key.toUpperCase() === hashMap[i].logo) {
            window.open(hashMap[i].url);
        }
    }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.c26eb5cf.map