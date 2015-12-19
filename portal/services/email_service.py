
import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class EmailService():
    """This service is used to send Emails through Gmail"""

    def __init__(self, from_address, username, password):
        self.from_address = from_address

        self.username = username
        self.password = password

        self.server = smtplib.SMTP('smtp.gmail.com:587')
        self.server.starttls()
        self.server.login(self.username, self.password)

    def create_plain_message(self):
        message = """
        Hello!

        THINGS ABOUT EMAILS AND STUFF

        FSAI"""
        return message

    def create_html_message(self, token, user_name):
        template = open('portal/templates/email/email_template.html')
        content = template.read()
        content = content.replace("[TOKEN_REPLACE]", token)
        content = content.replace("[USER_NAME_REPLACE]", user_name)

        return content

    def create_multipart_email(self, to_address, token, user_name):
        # Create message container - the correct MIME type is multipart/alternative.
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "FSAI Recover Password"
        msg['From'] = self.from_address
        msg['To'] = to_address

		# Create the body of the message (a plain-text and an HTML version).
        text = self.create_plain_message()
        html = self.create_html_message(token, user_name)

		# Record the MIME types of both parts - text/plain and text/html.
        part1 = MIMEText(text, 'plain')
        part2 = MIMEText(html, 'html')

		# Attach parts into message container.
        # According to RFC 2046, the last part of a multipart message, in this case
        # the HTML message, is best and preferred.
        msg.attach(part1)
        msg.attach(part2)

        return msg

    def send(self, to_address, token, user_name):

        # stmpt has us add the subject at the top of the message...
        # message = 'Subject: %s\n%s' % (subject, self.create_message(message))
        msg = self.create_multipart_email(to_address, token, user_name)

        self.server.sendmail(self.from_address, to_address, msg.as_string())
