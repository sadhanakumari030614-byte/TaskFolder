
import re
from typing import Optional


def parse_quick_add(text: str) -> dict:
    """
    Simple mock AI parser.
    Converts natural-language task text into structured data.
    No API key and no network call are required.
    """

    text = text.strip()

    if not text:
        return {
            "title": "",
            "description": None,
            "priority": "medium",
            "status": "todo",
            "due_date": None,
        }

    # -----------------------------
    # Priority
    # -----------------------------

    priority = "medium"

    lower_text = text.lower()

    if "high priority" in lower_text or "urgent" in lower_text:
        priority = "high"

    elif "low priority" in lower_text:
        priority = "low"

    elif "medium priority" in lower_text:
        priority = "medium"

    # -----------------------------
    # Due date
    # -----------------------------

    due_date: Optional[str] = None

    if "tomorrow" in lower_text:
        due_date = "Tomorrow"

    elif "today" in lower_text:
        due_date = "Today"

    # -----------------------------
    # Remove instructions from title
    # -----------------------------

    title = re.sub(
        r"\b(high|medium|low)\s+priority\b",
        "",
        text,
        flags=re.IGNORECASE,
    )

    title = re.sub(
        r"\burgent\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    title = re.sub(
        r"\btomorrow\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    title = re.sub(
        r"\btoday\b",
        "",
        title,
        flags=re.IGNORECASE,
    )

    title = re.sub(r"\s+", " ", title).strip()

    return {
        "title": title,
        "description": None,
        "priority": priority,
        "status": "todo",
        "due_date": due_date,
    }