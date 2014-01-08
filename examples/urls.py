from django.conf.urls import patterns, url

urlpatterns = patterns('examples.views.jsonp_cors',
    url(r'^jsonp/post/add/$', 'edit_post',
        name='jsonp_add_post'),
    url(r'^jsonp/post/edit/(?P<id>\d+)/$', 'edit_post',
        name='jsonp_edit_post'),
    url(r'^jsonp/post/delete/(?P<id>\d+)/$', 'delete_post',
        name='jsonp_delete_post'),
    url(r'^jsonp/post/delete/all/$', 'delete_all_posts',
        name='jsonp_delete_all_post'),

    url(r'^jsonp/post/get_form/(?P<id>\d+)/$', 'get_post_form',
        name='jsonp_get_edit_post_form'),
    url(r'^jsonp/post/get_form/$', 'get_post_form',
        name='jsonp_get_add_post_form'),
)
