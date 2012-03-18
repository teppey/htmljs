/*
 * html.js -- DOM or HTML construction
 *
 *  SYNOPSIS:
 *      html.TAG([args...]) -> Element
 *      htmls.TAG([args...]) -> Function -> String
 *
 *      Create new tag function:
 *        html(tag) -> Function -> Element
 *        htmls(tag) -> Function -> Function -> String
 *
 *  USAGE:
 *      document.body.appendChild(html.h1('page title'));
 *
 *      // More concisely
 *      with(html) {
 *        document.body.appendChild(
 *          table(tr(th('Name'), th('URL')),
 *                tr(td('Google'), td('http://www.google.com/')),
 *                tr(td('Yahoo'), td('http://www.yahoo.com/')))
 *        );
 *      }
 *
 *      // Create new tag function
 *      var article = html('article');
 *      document.body.appendChild(article('lorem ipsum'));
 *
 *      // Default attributes
 *      var para = html('p', {'class':'para'});
 *      document.body.appendChild(para('content'));
 *
 *      // String for 'innerHTML'
 *      with(htmls) {
 *        document.body.innerHTML = table(
 *          tr(th('Name'), th('URL')),
 *          tr(td('Google'), td('http://www.google.com/')),
 *          tr(td('Yahoo'), td('http://www.yahoo.com/'))
 *        )();
 *      }
 *
 *
 *  Author: Teppei Hamada <temada@gmail.com>
 *
 */

(function(global){

  // Type detection
  // copied from underscore.js
  var toString = Object.prototype.toString;
  var isString = function(obj){
    return toString.call(obj) == '[object String]';
  };
  var isNumber = function(obj){
    return toString.call(obj) == '[object Number]';
  };
  var isArray = function(obj){
    return toString.call(obj) == '[object Array]';
  };
  var isElement = function(obj){
    return obj && obj.nodeType == 1;
  };
  var isObject = function(obj){
    return obj && obj.constructor && obj.constructor === Object;
  };
  var isFunction = function(obj){
    return toString.call(obj) == '[object Function]';
  };

  var setattrs = function(elem, attrs) {
    for (var name in attrs) {
      if (name == 'style') {
        elem.style.cssText = attrs[name];
      } else if (name == 'class') {
        elem.setAttribute('class', attrs[name]);
        elem.setAttribute('className', attrs[name]);
      } else if (/(col|row)span/i.test(name)) {
        // http://www.softel.co.jp/blogs/tech/archives/1039
        elem.setAttribute(RegExp.$1+'Span', attrs[name]);
      } else {
        elem.setAttribute(name, attrs[name]);
      }
    }
  };

  // Shortcut
  var slice = Array.prototype.slice;

  global.html = function(tag){
    var defaults = slice.call(arguments, 1);
    return function(){
      var args = defaults.concat(slice.call(arguments));
      var elem = document.createElement(tag);
      while (args.length > 0) {
        var arg = args.shift();
        if (isString(arg)) {
          elem.appendChild(document.createTextNode(arg));
        } else if (isNumber(arg)) {
          elem.appendChild(document.createTextNode(''+arg));
        } else if (isArray(arg)) {
          args = arg.concat(args);
        } else if (isElement(arg)) {
          elem.appendChild(arg);
        } else if (isObject(arg)) {
          setattrs(elem, arg);
        } else if (arg && arg.toString) {
          elem.appendChild(document.createTextNode(arg.toString()));
        } else {
          continue;
        }
      }

      return elem;
    };
  };

  // copied from underscore.js
  var escapeHTML = function(str){
    return (''+str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  global.htmls = function(tag, var_args){
    var defaults = slice.call(arguments, 1);
    return function(){
      var args = defaults.concat(slice.call(arguments));
      return function(){
        var attrs = [];
        var contents = [];
        while (args.length > 0) {
          var arg = args.shift();
          if (isString(arg)) {
            contents.push(escapeHTML(arg));
          } else if (isNumber(arg)) {
            contents.push(''+arg);
          } else if (isFunction(arg)) {
            contents.push(arg());
          } else if (isArray(arg)) {
            args = arg.concat(args);
          } else if (isElement(arg)) {
            var wrapper = document.createElement('div');
            wrapper.appendChild(arg);
            contents.push(wrapper.innerHTML);
          } else if (isObject(arg)) {
            for (var name in arg) {
              var val = arg[name];
              if (isString(val) || isNumber(val)) {
                attrs.push(' '+escapeHTML(name)+'="'+escapeHTML(''+val)+'"');
              } else if (val === true) {
                attrs.push(' '+escapeHTML(name));
              }
            }
          } else if (arg && arg.toString) {
            contents.push(escapeHTML(arg.toString()));
          } else {
            continue;
          }
        }

        var elem = escapeHTML(tag);
        return '<'+elem+attrs.join('')+'>'+contents.join('')+'</'+elem+'\n>';
      };
    };
  };

})(this);


// Presets
(function(html, htmls){
    var tags = ('a abbr acronym address applet area b base'
               + ' basefont bdo bgsound big blink blockquote'
               + ' body br button caption center cite code'
               + ' col colgroup dd del dfn dir div dl dt'
               + ' em embed fieldset font form frame frameset'
               + ' h1 h2 h3 h4 h5 h6 head hr html i'
               + ' iframe ilayer img input ins isindex kbd'
               + ' label legend li link listing map menu meta'
               + ' multicol nobr noembed noframes nolayer noscript'
               + ' object ol optgroup option p param plaintext'
               + ' pre q s samp script select small spacer'
               + ' span strike strong style sub sup table'
               + ' tbody td textarea tfoot th thead title tr'
               + ' tt u ul var wbr xmp').split(/\s+/);
    for (var i=0; i<tags.length; i++) {
        html[tags[i]] = html(tags[i]);
        htmls[tags[i]] = htmls(tags[i]);
    }
})(html, htmls);


/* vim:set ft=javascript sw=2: */
