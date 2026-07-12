import traceback
from fastapi import Response, status
import bcrypt
from app.database import database
from app.services.jwt_handler import create_jwt

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

        # Hash password and insert new user
        hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        con.execute(
            "INSERT INTO user(email, pass, role) VALUES (%s, %s, %s)",
            (data.email, hashed_password, data.role)
        )

        db.commit()
        user_id = con.lastrowid

        token = create_jwt(data.email)

        return {
            "msg": "Registered Successfully",
            "token": token,
            "id": user_id
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
            "SELECT id, email, pass, role FROM user WHERE email = %s",
            (data.email,)
        )

        user = con.fetchone()

        if not user:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "User not found"}

        # user = (id, email, password, role)
        try:
            is_valid = bcrypt.checkpw(data.password.encode('utf-8'), user[2].encode('utf-8'))
        except ValueError:
            # Fallback for plain-text test accounts
            is_valid = (data.password == user[2])

        if not is_valid:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return {"msg": "Invalid password"}

        token = create_jwt(user[1])

        return {
            "msg": "Login Successful",
            "token": token,
            "id": user[0],
            "email": user[1],
            "role": user[3]
        }

    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": "Internal Server Error"}

    finally:
        if con:
            con.close()
        db.close()