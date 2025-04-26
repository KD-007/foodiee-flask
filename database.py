import pyodbc
import os

def get_db_connection():
    conn_str = (
        "DRIVER=/usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so;"  # Exact path
        f"SERVER={os.getenv('DB_SERVER')};"
        f"DATABASE={os.getenv('DB_NAME')};"
        f"UID={os.getenv('DB_USER')};"
        f"PWD={os.getenv('DB_PASSWORD')};"
        "TDS_Version=8.0;"
        "Port=1433;"
        "Encrypt=yes;"  # For Azure SQL
        "TrustServerCertificate=no;"
    )
    return pyodbc.connect(conn_str)
