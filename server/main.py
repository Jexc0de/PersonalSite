import os
import time

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(override=True)

CLIENT_ID = os.environ["SPOTIFY_CLIENT_ID"]
CLIENT_SECRET = os.environ["SPOTIFY_CLIENT_SECRET"]
REFRESH_TOKEN = os.environ["SPOTIFY_REFRESH_TOKEN"]

ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://justinblackwood.com",
    "https://www.justinblackwood.com",
    "https://persite-23e49.web.app",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET"],
    allow_headers=["*"],
)

EMPTY = {"playing": False, "track": None, "artist": None,
         "albumArt": None, "url": None}


_token = {"value": None, "expires": 0.0}

_result = {"value": None, "expires": 0.0}
RESULT_TTL = 25.0


async def get_access_token(client: httpx.AsyncClient) -> str:
    if _token["value"] and time.time() < _token["expires"] - 60:
        return _token["value"]
    r = await client.post(
        "https://accounts.spotify.com/api/token",
        data={"grant_type": "refresh_token", "refresh_token": REFRESH_TOKEN},
        auth=(CLIENT_ID, CLIENT_SECRET),
    )
    r.raise_for_status()
    data = r.json()
    _token["value"] = data["access_token"]
    _token["expires"] = time.time() + data.get("expires_in", 3600)
    return _token["value"]

def shape(item: dict, playing: bool) -> dict:
    images = item["album"]["images"]
    art = None
    if images:
        art = images[1]["url"] if len(images) > 1 else images[0]["url"]
    return {
        "playing": playing,
        "track": item["name"],
        "artist": ", ".join(a["name"] for a in item["artists"]),
        "album": item["album"]["name"],
        "albumArt": art,
        "url": item["external_urls"].get("spotify"),
    }

async def fetch_from_spotify() -> dict:
    async with httpx.AsyncClient(timeout=8.0) as client:
        token = await get_access_token(client)
        headers = {"Authorization": f"Bearer {token}"}

        r = await client.get(
            "https://api.spotify.com/v1/me/player/currently-playing",
            headers=headers,
        )

        if r.status_code == 200:
            data = r.json()
            item = data.get("item")
            if item and data.get("currently_playing_type") == "track":
                return shape(item, bool(data.get("is_playing")))

        r = await client.get(
            "https://api.spotify.com/v1/me/player/recently-played?limit=1",
            headers=headers,
        )
        r.raise_for_status()
        items = r.json().get("items", [])
        return shape(items[0]["track"], False) if items else EMPTY


@app.get("/api/now-playing")
async def now_playing():
    now = time.time()
    if _result["value"] and now < _result["expires"]:
        return _result["value"]

    try:
        data = await fetch_from_spotify()
    except httpx.HTTPStatusError as exc:
        print(f"[now-playing] HTTP {exc.response.status_code}: {exc.response.text}")
        return _result["value"] or EMPTY
    except Exception as exc:
        print(f"[now-playing] {type(exc).__name__}: {exc}")
        return _result["value"] or EMPTY

    _result["value"] = data
    _result["expires"] = time.time() + RESULT_TTL
    return data