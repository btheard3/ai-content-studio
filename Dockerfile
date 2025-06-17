# Use a minimal Python image
FROM python:3.10-slim

# Set environment variable to prevent output buffering
ENV PYTHONUNBUFFERED=1


# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI's default port
EXPOSE 8000

# Run the server
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
