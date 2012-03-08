/*
 * html.js -- DOM construction
 *
 *  SYNOPSIS:
 *
 *      html.TAG([args...]) -> Element
 *      html(tag) -> Tag function
 *
 *  USAGE:
 *
 *      document.body.appendChild(html.h1('page title'));
 *
 *      // more concisely
 *      with(html) {
 *        document.body.appendChild(
 *          table(tr(th('Message'),
 *                tr(td({width:100}, 'Hello'),
 *                      a('click here', {href:'http://www.example.com/'}))))
 *        );
 *      }
 *
 *      // Create new tag function
 *      var article = html('article');
 *      document.body.appendChild(article('lorem ipsum'));
 *
 *
 *  Author: Teppei Hamada <temada@gmail.com>
 *
 */

var html = (function(){
  function setattrs(element, attrs) {
    for (var name in attrs) {
      if (name == 'style') {
        element.style.cssText = attrs[name];
      } else if (name == 'class') {
        element.setAttribute('class', attrs[name]);
        element.setAttribute('className', attrs[name]);
      } else if (name.match(/(col|row)span/i)) {
        // http://www.softel.co.jp/blogs/tech/archives/1039
        element.setAttribute(RegExp.$1+'Span', attrs[name]);
      } else {
        element.setAttribute(name, attrs[name]);
      }
    }
  }

  return function(tag){
    return function(){
      var elem = document.createElement(tag);
      var args = Array.prototype.slice.apply(arguments);
      while (args.length > 0) {
        var arg = args.shift();
        var ctor = arg.constructor;
        if (ctor == String)
          elem.appendChild(document.createTextNode(arg));
        else if (ctor == Number)
          elem.appendChild(document.createTextNode(arg+''));
        else if (ctor == Object)
          setattrs(elem, arg);
        else if (ctor == Array)
          args = arg.concat(args);
        else if (arg.appendChild)
          elem.appendChild(arg);
      }
      return elem;
    };
  };
})();


// Presets
(function(){
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
    for (var i=0; i<tags.length; i++)
        html[tags[i]] = html(tags[i]);
})();
