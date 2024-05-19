from django import template
from django.utils.text import slugify

register = template.Library()

@register.filter(name='hyphenate')
def hyphenate(value):
    return slugify(value)