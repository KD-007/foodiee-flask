import smtplib
from email.mime.text import MIMEText
import os

def send_email(to_email, subject, message):
        smtp_user = os.environ.get("SMTP_MAIL")
        smtp_pass = os.environ.get("SMTP_PASSWORD")
        
        print([smtp_user, smtp_pass])
        
        msg = MIMEText(message)
        msg["Subject"] = subject
        msg["From"] = f"kuldeepverma~Foodiee <{smtp_user}>"
        msg["To"] = to_email

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)

