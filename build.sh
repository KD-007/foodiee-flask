#!/bin/bash
set -e  # Exit on error

# Install dependencies (no sudo needed)
apt-get update -y && apt-get install -y --no-install-recommends \
    unixodbc-dev \
    tdsodbc \
    freetds-bin \
    gcc

# Configure FreeTDS
echo "[FreeTDS]
Driver = /usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so
Setup = /usr/lib/x86_64-linux-gnu/odbc/libtdsS.so" > /etc/odbcinst.ini

# Install Python dependencies
pip install -r requirements.txt
