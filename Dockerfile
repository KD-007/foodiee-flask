# Use the official Python image with Debian 11 (bullseye) as base
FROM python:3.9-slim-bullseye

# 1. First install dependencies that don't conflict
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gnupg2 \
    && curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /usr/share/keyrings/microsoft.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/11/prod bullseye main" > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update

# 2. Install MS ODBC driver first (before unixodbc-dev)
RUN ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql17

# 3. Then install remaining dependencies
RUN apt-get install -y --no-install-recommends \
    gcc \
    unixodbc-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Set secure Python defaults
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]