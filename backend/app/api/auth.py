
from fastapi import Response, status
from app.database import database
from app.services.jwt_handler import create_jwt
import traceback
from fastapi import Response, status
from passlib.context import CryptContext
from app.database import database
from app.services.jwt_handler import create_jwt
from fastapi import Response, status

async def auth_regst(response: Response, data):
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


async def auth_login(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        con.execute(
            "SELECT email, pass, role FROM user WHERE email = %s",
            (data.email,)
        )

        user = con.fetchone()

        if not user:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "User not found"}

        # user = (email, password, role)
        if user[1] != data.password:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return {"msg": "Invalid password"}

        token = create_jwt(user[0])

        return {
            "msg": "Login Successful",
            "token": token,
            "email": user[0],
            "role": user[2]
        }

    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": "Internal Server Error"}

    finally:
        if con:
            con.close()
        db.close()