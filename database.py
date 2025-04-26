import os
import pymssql

def get_db_connection():
    return pymssql.connect(
        server=os.getenv('DB_SERVER'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME'),
        as_dict=True  # Returns results as dictionaries
    )
