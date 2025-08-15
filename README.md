# django-birthday20

Static site for the Django birthday website

This is a [Hugo](https://gohugo.io/) project.

Running with Docker
-------------------

In `docker-compose.yml`, we have specified a `serve` target which you can run locally like this:

```bash
docker compose run --rm -u `id -u` --service-ports serve
```

Running without Docker
----------------------

```bash
# Install dependencies
uv sync

# Run hugo server
uv run hugo server
```
