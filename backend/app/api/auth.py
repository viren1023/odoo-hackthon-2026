
from fastapi import Response, status
from app.database import database
from app.services.jwt_handler import create_jwt
import traceback
from fastapi import Response, status
from passlib.context import CryptContext
from app.database import database
from app.services.jwt_handler import create_jwt
from fastapi import Response, status

async def regst(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        # Check if email already exists
        con.execute(
            "SELECT * FROM user WHERE email = %s",
            (data.email,)
        )
        row = con.fetchone()

        if row:
            response.status_code = status.HTTP_409_CONFLICT
            return {"msg": "Email already exists"}

        # Insert new user
        con.execute(
            "INSERT INTO user(email, pass, role) VALUES (%s, %s, %s)",
            (data.email, data.password, data.role)
        )

        db.commit()

        token = create_jwt(data.email)

        return {
            "msg": "Registered Successfully",
            "token": token
        }

    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": "Internal Server Error"}

    finally:
        if con:
            con.close()
        db.close()