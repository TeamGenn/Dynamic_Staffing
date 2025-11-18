import os
import re

import uvicorn


def _parse_port(value: str | None, default: int = 8000) -> int:
    """
    Railway exposes PORT as an env var but their launcher might not expand
    shell expressions such as `$PORT` inside Procfile commands.
    This helper converts whatever we get into an integer and falls back
    to the default when the value is missing or malformed.
    """
    if not value:
        return default

    trimmed = value.strip()
    if trimmed.isdigit():
        return int(trimmed)

    match = re.search(r"\d+", trimmed)
    if match:
        return int(match.group())

    return default


def main() -> None:
    host = os.environ.get("HOST", "0.0.0.0")
    port = _parse_port(os.environ.get("PORT"))

    reload_enabled = os.environ.get("UVICORN_RELOAD", "").lower() in {"1", "true", "yes"}

    uvicorn.run(
        "backend.main:app",
        host=host,
        port=port,
        reload=reload_enabled,
    )


if __name__ == "__main__":
    main()

