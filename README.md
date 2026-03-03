# django-birthday20

A community-driven static website where people around the world can submit and discover Django birthday events for  **Django’s 20th Birthday** website


This is a [Hugo](https://gohugo.io/) project.

## Requirements

- Hugo (extended version recommended)
- Docker (optional, for containerized setup)


## Running with Docker

We have a docker compose file that allows you to run the site easily:

```bash
docker compose up
```

## Running without Docker

```bash
# Install dependencies
uv sync

# Run hugo server
uv run hugo server
```

##  Add Your Event to Django's 20th Birthday

The main purpose of this repository is to collect and showcase birthday events from the Django community.

Contributions are welcome! Please read the instructions in [`content/add-event.md`](content/add-event.md) before submitting a Pull Request or GitHub Issue.

You can submit an event either:
- By opening a Pull Request with a new Markdown file
- Or by using the GitHub Issue form (no coding required)

## 📁 Where Events Live

All events displayed on the website are stored as Markdown files in:
`content/events/`

Each file represents one event and is automatically rendered on the site using Hugo.

