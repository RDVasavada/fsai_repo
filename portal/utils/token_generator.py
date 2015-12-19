import random
import string

class TokenGenerator():

	def __init__(self):
		pass

	@classmethod
	def create_random_token(cls, length):
		token = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

		return token