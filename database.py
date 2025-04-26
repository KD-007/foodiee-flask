import pyodbc
import os

def get_db_connection():
    try:
        conn_str = (
            "DRIVER=FreeTDS;"
            f"SERVER={os.getenv('DB_SERVER')};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')};"
            "TDS_Version=8.0;"
            "Port=1433;"
            "Encrypt=yes;"
            "TrustServerCertificate=no;"
        )
        return pyodbc.connect(conn_str)
    except Exception as e:
        raise Exception(f"Database connection failed: {str(e)}")
