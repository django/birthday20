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
--------------------------------------------

Please follow the instructions in [`content/add-event.md`](content/add-event.md) to submit your event via Pull Request or GitHub Issue.
