from pyotp import TOTP,random_base32

class Totp:  
    @staticmethod
    def verify(secret,code):
        secret = secret
        totp = TOTP(secret)
        return totp.verify(code)
    @staticmethod
    def generate():
        return random_base32()
        