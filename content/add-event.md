---
title: "Add your event"
date: "2025-07-03"
draft: false

params:
  cssClassSuffix: "main"
  subtitle: "Django is turning 20 this year, and what better way to celebrate it than to bring your local or online community together for an event!? Here are some ideas + an online form to make it easy to get started."
  # subsubtitle: "Some tips and guidance on adding it to this website."

---

## A special call for proposals! BIRTHDAYS!

To mark the event, we are calling for everyone to do a little thing! Meet new people, or gather old familiar friends - down at the pub, in a park, at your school or online. Nothing is too small.

## What to know before submitting

When your event is submitted and approved, it will probably get some attention. So it's good to have organized at least the date and the location in advance. You can update your event information later.

If you need help organizing it, make sure to note that so people see it.

## Meetup tips

* If you are worried about the costs or handling money is annoying, just ask people to bring things.
* Don't worry about a cake, most people will come to meet others - not because of the cake!
* Don't have a place to be? Ask around in some adequately sized cafés, ask your union, ask your university - or maybe meet outside in a park?
* Worried if people will come or not? Add an RSVP, it can be as simple as "write me an email if you want to come". You can also use Google Forms to make it easier for yourself. But always **make sure to get people's contacts** in case you need to make adjustments!

## Option 1: Submitting a Pull Request

Creating the event directly with a pull request is definitely the fastest way for our team to process new events.

1. Copy the [contents of the template](https://raw.githubusercontent.com/django/birthday20/refs/heads/main/content/events/00_template.md)
2. [Create a new file in content/events](https://github.com/django/birthday20/new/main/content/events) with a meaningful, lowercase slug (for instance your city’s name, i.e. “johannesburg.md”) and paste in the template's content.
3. Adjust the content, following the instructions in the comments.
4. Submit the change as a Pull Request

You can also choose to run this website locally at the same time run this website locally so you can see how it looks before it’s published. See the [README](https://github.com/django/birthday20/) of the repository.

If you need to update your event later, you would have to find it in [/content/events/](https://github.com/django/birthday20/tree/main/content/events) and submit a pull request to change the markdown file.


## Option 2: Adding the event via GitHub form

The easiest way to create an event is to [submit an issue to our GitHub repository](https://github.com/django/birthday20/issues/new) where you should select the "Add event" type.
