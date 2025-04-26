import pyodbc
import os

def get_db_connection():
    drivers = [
        'ODBC Driver 17 for SQL Server',  # First try official driver
        'FreeTDS',                        # Fallback option
        'SQL Server Native Client 11.0'   # Legacy option
    ]
    
    for driver in drivers:
        try:
            conn_str = (
                f'DRIVER={{{driver}}};'
                f'SERVER={os.getenv("DB_SERVER")};'
                f'DATABASE={os.getenv("DB_NAME")};'
                f'UID={os.getenv("DB_USER")};'
                f'PWD={os.getenv("DB_PASSWORD")};'
                'Encrypt=yes;TrustServerCertificate=no;'
            )
            return pyodbc.connect(conn_str)
        except pyodbc.Error as e:
            last_error = e
    raise Exception(f"All driver attempts failed. Last error: {str(last_error)}")
