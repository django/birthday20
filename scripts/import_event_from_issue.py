#!/usr/bin/env python3

import re
import sys

# This script doesn't require anything special, but maybe should require a GitHub API?
# (that, however, requires an API key?)

print('Please paste in the Markdown code of the issue:')
contents = []
while True:
    try:
        line = input()
    except EOFError:
        break
    contents.append(line)
issue_markdown = "\n".join(contents)

# Stuff we're missing in the issue template..
print("Please input the country:")
country = input()
print("Please input the city:")
city = input()

# TODO: Some fields aren't ideal for this yet
headline_mapping = {
  "title": "Title of the event",
  "short_description": "Short description",
  "body": "Long description",
  "how_to_attend": "How to attend",
  "event_type": "Event type",
  "event_category": "Event category",
  "event_date": "Event date",
  "event_date_end": "",
  "event_localtime": "Local time",
  "event_tz": "Timezone (UTC offset)",
  "event_host": "Host group",
  "event_languages": "Event language",
  "event_url": "RSVP Instructions or URL",
  "latitude": "Event latitude (optional)",
  "longitude": "Event longitude (optional)",
  "country": "",
  "city": "",
  "venue_name": "Venue name",
  "venue_address": "Venue address",
  "social_media": "Social media accounts (optional)",
}

found_content = {k: "" for k in headline_mapping.keys()}

template = """
---
# PUT YOUR EVENT NAME HERE!
title: "{title}"
# PUT A SHORT DESCRIPTION!
description: "{short_description}"
# (NOT the event date - but the publication date, set to today's date)
date: "2025-06-21"
draft: false

params:
  event_type: "{event_type}"
  event_category: "{event_category}"
  event_date: "{event_date}"
  # Leave empty if single-day event.
  event_date_end: ""
  # Local time of event: "HH:MM", "TBD" or "" (if full day and no time)
  event_localtime: "{event_localtime}"
  # Timezone UTC offset of the localtime
  event_tz: "{event_tz}"
  # Your community's name or name of organizers
  event_host: "{event_host}"
  # Languages expected to be spoken
  event_languages: "{event_languages}"
  # Fill this in if you have a website or leave empty if not
  event_url: "{event_url}"
  # Copy values from your location on Google Maps
  latitude: {latitude}
  longitude: {longitude}
  # Put your country
  country: "{country}"
  city: "{city}"
  # If this is an in_person event_type, put the name and address
  venue_name: "{venue_name}"
  venue_address: "{venue_address}"
  # Does your community have social media? Put URLs here (not handles!)
  social_media:
    {social_media}
    # mastodon: "https://fosstodon.org/@djangodenmark/"
    # twitter: "..."
    # instagram: "..."
    # linkedin: "..."
    # bluesky: "..."
---

# {title}

{body}

## How to attend

{how_to_attend}

## Code of Conduct

https://www.djangoproject.com/conduct/
"""

blocks_by_headline = {}

current_headline = None
for line in issue_markdown.split("\n"):
    if line.startswith("###"):
        current_headline = line[4:]
        print(f"Found: {current_headline}")
        blocks_by_headline[current_headline] = []
    elif current_headline in headline_mapping.values():
        blocks_by_headline[current_headline].append(line.strip())
    elif current_headline:
        print(f"Ignoring headline: {current_headline}")
    else:
        print(f"Ignoring line: {line}")

for key, headline in headline_mapping.items():

    found_content[key] = "\n".join(blocks_by_headline.get(headline, [])).strip()

found_content["city"] = city
found_content["country"] = country

print(template.format(**found_content))
