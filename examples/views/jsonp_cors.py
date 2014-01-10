from functools import wraps
import json

from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.http import HttpResponse

from ..models import Post
from ..forms import PostForm


def custom_response(request, data):
    callback = request.GET.get('callback')
    if callback:
        response_data = "%s(%s)" % (callback, json.dumps(data))
    else:
        response_data = "%s" % (json.dumps(data))
    return HttpResponse(response_data, content_type='application/json')


def view_wrapper(func):
    def inner_decorator(request, *args, **kwargs):

        if request.is_ajax():
            try:
                request.data = json.loads(request.body)
            except (TypeError, ValueError):
                request.data = None
        elif request.method == 'GET':
            request.data = request.GET.dict() or None
        elif request.method == 'POST':
            request.data = request.POST.dict() or None
        else:
            request.data = None

        response_data = func(request, *args, **kwargs)

        return custom_response(request, response_data)

    return wraps(func)(inner_decorator)


def _render_post_form(form):
    return render_to_string('examples/jsonp_cors/post_form.html', {
        'form': form,
        'posts': Post.objects.all()
    })


@view_wrapper
def get_post_form(request, id=None):
    if id:
        form = PostForm(None, instance=get_object_or_404(Post, id=id))
    else:
        form = PostForm()
    return {
        'html': _render_post_form(form),
        'success': True,
        'error': ''
    }


@view_wrapper
def edit_post(request, id=None):
    try:
        form = PostForm(request.data,
            instance=get_object_or_404(Post, id=id)
                if id else Post(author=request.user))

        if form.is_valid():
            form.save()
            form = PostForm(instance=Post(author=request.user))
            return {
                'html': _render_post_form(form),
                'success': True,
                'error': ''
            }

        return {
            'html': _render_post_form(form),
            'success': False,
            'error': ''
        }
    except Exception as e:
        print e


@view_wrapper
def delete_post(request, id):
    try:
        Post.objects.get(id=id).delete()
        return {
            'success': True
        }
    except Post.DoesNotExist:
        return {
            'success': False
        }


@view_wrapper
def delete_all_posts(request):
    Post.objects.all().delete()
    return {
        'success': True
    }
