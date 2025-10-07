---
title: "Removing the magic"
date: "2025-09-20"
draft: false

params:
  timeline_date: 2006-05-01
  timeline_type: milestone

---

Doing "magic" in Python isn't necessary perceived as a good thing, in fact Python's 2nd Zen reads *explicit is better than implicit*.
As the earliest versions of Django contained quite a bit of magic, project [Removing the magic](https://code.djangoproject.com/wiki/RemovingTheMagic) is launched: It's probably one of the biggest user-facing refactors in Django, a project that renamed almost all core database tables and redesigned the structure of many core modules. That big of a change would be unthinkable 20 years later, but it was necessary in Django's first years to refine Django's core concepts.
