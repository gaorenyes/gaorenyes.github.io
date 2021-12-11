$(document).ready(function(){
  //IE8 fix
  if(document.all&&document.querySelector&&!document.addEventListener){
    var style = $('<st'+'yle type="text/css">:before,:after{content:none !important}</style>').appendTo('head');
    setTimeout(function(){
      style.remove();
    },0);
  }

});
hljs.initHighlightingOnLoad();
marked.setOptions({
  highlight:function(code){
    return hljs.highlightAuto(code).value;
  }
});
function mdr(tmpls){
  $(tmpls).each(function(){
    var tmpl = $(this);
    var v = tmpl.val();
    if(!v) v = tmpl.html();
    var p = tmpl.parent();
    p.addClass('markdown-body');
    tmpl.after(marked(v));
    p.find('a').each(function(){
      var a = $(this);
      if(!a.attr('target')){
        var p = a.parent();
        if(!p || !p.hasClass('codes')){
          a.attr('target','_blank');
        }
      }
    });
  });
  $('.codes a').on('click',function(){
    var id = $(this).html();
    $('.codes a').each(function(){
      var o = $(this);
      var oid = o.html();
      if(oid===id){
        $('#'+oid).show();
        o.addClass('active');
      }else{
        $('#'+oid).hide();
        o.removeClass('active');
      }
    });
  });
}
function output(s){
  $('#output').show();
  $('<div>'+s+'</div>').appendTo('#output');
}