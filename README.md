# django-birthday20

Static site for the Django's 20th birthday website

This is a [Hugo](https://gohugo.io/) project.

Running with Docker
-------------------

We have a docker compose file that allows you to run the site easily:

```bash
docker compose up
```

Running without Docker
----------------------

```bash
# Install dependencies
uv sync

# Run hugo server
uv run hugo server
```

🎉 Add Your Event to Django's 20th Birthday!
---------------------
Want to celebrate Django’s 20th birthday with your community? You can add your event to this website!

There are two ways to submit your event:

###  Option 1: Submit via Pull Request

Follow the instructions in [`content/add-event.md`](content/add-event.md) to create a markdown file for your event and submit a pull request.

- Copy the [event template](https://raw.githubusercontent.com/django/birthday20/refs/heads/main/content/events/00_template.md)
- Create a new file in [`content/events/`](https://github.com/django/birthday20/new/main/content/events)
- Customize it and submit a PR

###  Option 2: Submit via GitHub Issue

You can also [submit an issue](https://github.com/django/birthday20/issues/new) and select the **"Add event"** type — quick and easy!

For full instructions and meetup tips, see [`content/add-event.md`](content/add-event.md)