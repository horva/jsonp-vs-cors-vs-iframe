$(function(){

  var article_width = $(window).innerWidth();
  var article_count = $('.board article').length;

  window.is_number = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  };

  _go_to_page = function(page_no) {
    var el = $(".board");
    if (page_no < 1 || page_no > article_count) {
      return;
    }
    el.css('left', -1 * (page_no - 1) * article_width);
  };

  get_hash = function() {
    var hash = location.hash.substr(1);
    if (!is_number(hash) || hash < 1) return 0;
    return parseInt(hash, 10);
  };

  set_hash = function(new_value) {
    if (new_value < 1) {
      new_value = 1;
    } else if (new_value > article_count) {
      new_value = article_count;
    }
    location.hash = new_value;
    _go_to_page(new_value);
  };

  window.go_to_next_page = function() {
    set_hash(get_hash() + 1);
  };

  window.go_to_prev_page = function() {
    set_hash(get_hash() - 1);
  };

  $('.board article').css({
    'width': article_width,
    'padding': '0 40px'
  });

  $('.board').css('width', article_width * article_count);

  $("body").keydown(function(e) {
    if ($(':focus').is('input, textarea')) {
      return;
    }
    if (e.keyCode == 39) go_to_next_page();
    else if (e.keyCode == 37) go_to_prev_page();
  });

  if (get_hash() === 0) {
    set_hash(1);
  } else {
    _go_to_page(get_hash());
  }

});
