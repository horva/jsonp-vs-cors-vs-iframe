$.extend({
  request: function(url, data, request_type, callback_fn, method) {
    // request_type - if JSONP '?&callback=?' will be appended to url,
    //                JSONP will also force GET method
    // method - HTTP method, GET with be used by default

    request_type = request_type.toLowerCase();
    if (request_type == 'jsonp') {
      url += '?&callback=?';
    }

    if (method === undefined || !$.inArray(method.toLowerCase(),
      ['get', 'post', 'put', 'patch', 'delete', 'options'])) method = 'get';

    var ajax_params = {
      url: url,
      data: data,
      dataType: 'json',
      type: method,
      success: function(response_data) {
        if (callback_fn) callback_fn(response_data);
      },
      crossDomain: true
      // headers: {
      //   'Test-Header': 'ABC'
      // }
    };

    if (request_type == 'cors') {
      ajax_params.xhrFields = {'withCredentials': true};
    }

    $.ajax(ajax_params);
  }
});

$(function(){

  window.JSONP_CORS = {
    base_url: base_url,
    init: function() {
        var self = this;
        self.get_form();
    },
    get_request_type: function(){
      return $('.request_type').val();
    },
    make_request: function(url, data, method, callback_fn) {
      self = this;
      $.request(url, data, self.get_request_type(), callback_fn, method);
    },
    get_url: function(url) {
      var self = this;
      return self.base_url + url;
    },
    get_form_url: function(id) {
      var self = this;
      var url = '/examples/jsonp/post/get_form/';
      if (id) {
        url += id + '/';
      }
      return self.get_url(url);
    },
    get_delete_url: function(id) {
      var self = this;
      var url = '/examples/jsonp/post/delete/' + id + '/';
      return self.get_url(url);
    },
    get_delete_all_url: function(id) {
      var self = this;
      var url = '/examples/jsonp/post/delete/all/';
      return self.get_url(url);
    },
    get_form: function(id) {
      var self = this;
      var url = self.get_form_url(id);
      self.make_request(url, {}, 'GET', function(data){
        self.render(data.html);
      });
    },
    post_form: function() {
      var self = this;
      self.make_request(
        self.get_url($('.jsonp_form_holder form').attr('action')),
        $('.jsonp_form_holder form').form_values(),
        'POST',
        function(data){
          self.render(data.html);
        }
      );
    },
    render: function(html) {
      $('.jsonp_form_holder').html(html);
    },
    delete: function(id) {
      var self = this;
      self.make_request(
        self.get_delete_url(id),
        {},
        'DELETE',
        function(data){
          if (data.success) {
            self.get_form();
          }
        }
      );
    },
    delete_all: function() {
      var self = this;
      self.make_request(
        self.get_delete_all_url(),
        {},
        'DELETE',
        function(data){
          if (data.success) {
            self.get_form();
          }
        }
      );
    }
  };

  $('body').on('submit', '.jsonp_form_holder form', function(){
    JSONP_CORS.post_form();
    return false;
  });

  $('body').on('click', '.post-table tr', function(){
    var el = $(this);
    var id = el.data('id');
    JSONP_CORS.get_form(id);
    return false;
  });

  $('body').on('click', '.delete-post', function(){
    var el = $(this);
    var id = el.data('id');
    JSONP_CORS.delete(id);
    return false;
  });

  $('body').on('click', '.delete-all-posts', function(){
    var el = $(this);
    var id = el.data('id');
    JSONP_CORS.delete_all();
    return false;
  });

  JSONP_CORS.init();

});
