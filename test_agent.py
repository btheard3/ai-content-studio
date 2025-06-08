import requests

response = requests.post(
    "http://localhost:8000/run/content_strategist",
    json={"text": "A new SaaS platform for small businesses"}
)
print(response.json())
