#!/usr/bin/env python3

import json

# NB! This file was removed from the repo to not confuse
data = json.load(open("data/events.json"))

# Example:
# {'model': 'events.event', 'pk': 32, 'fields': {'name': 'PyCon JP 2025', 'slug': 'pycon-jp-2025', 'location': 'SRID=4326;POINT (132.4505423856693 34.39234471962498)', 'latitude': 34.39234471962498, 'longitude': 132.4505423856693, 'date': '2025-09-26', 'address': 'Japan, 〒730-0811 Hiroshima, Naka Ward, Nakajimacho, 1−5 3階', 'description': 'September 26-27, 2025', 'event_type': 'in_person', 'event_category': 'conference', 'community': 'PyCon JP', 'website': 'https://2025.pycon.jp/'}}


template = """
---
# Added from the django_birthday_map project
# This can benefit from a few adjustments
title: "{name}"
description: "{description}"
date: "2025-07-07"
draft: false

params:
  event_type: "{event_type}"
  event_category: "{event_category}"
  event_date: "{date}"
  event_host: "{community}"
  event_localtime: ""
  event_tz: ""
  event_languages: ""
  event_url: "{website}"
  latitude: {latitude}
  longitude: {longitude}
  country: "{country}"
  city: "{city}"
  venue_name: ""
  venue_address: "{address}"
  social_media:
---

# {name}

{description}

"""

for event in data:

    new_file = open(f"content/events/{event['fields']['slug']}.md", "w")

    fields = event["fields"]

    try:
        if "Japan" in fields["address"]:
            city_and_zip = fields["address"].split(", ")[1].split(" ")
            fields["country"] = "Japan"
        elif "United States" in fields["address"]:
            city_and_zip = fields["address"].split(", ")[-3].split(" ")
            fields["country"] = "United States"
        else:
            city_and_zip = fields["address"].split(", ")[-2].split(" ")
            fields["country"] = fields["address"].split(", ")[-1]
        if len(city_and_zip) > 1:
            fields["city"] = city_and_zip[1]
        else:
            fields["city"] = city_and_zip[0]
    except IndexError:
        print(fields["address"])
        raise Exception("")

    if not "city" in fields:
        fields["city"] = "Unknown"
    if not "country" in fields:
        fields["country"] = "Unknown"

    if fields["event_category"] == "local_community":
        fields["event_category"] = "meetup"

    new_content = template.format(
      **fields
    )
    new_file.write(new_content)
    new_file.close()
