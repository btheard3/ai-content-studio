import requests

response = requests.post("http://localhost:8000/run/content_strategist")

print("Status:", response.status_code)
try:
    print(response.json())
except Exception as e:
    print("Raw Response:", response.text)