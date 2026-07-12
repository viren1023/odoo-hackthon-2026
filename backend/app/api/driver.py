from fastapi import Response, status
from app.database import database
import traceback


async def add_driver(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        # Check if license number already exists
        con.execute(
            "SELECT * FROM drivers WHERE license_number=%s",
            (data.license_number,)
        )

        if con.fetchone():
            response.status_code = status.HTTP_409_CONFLICT
            return {"msg": "Driver already registered"}

        # Register driver
        con.execute(
            """
            INSERT INTO drivers
            (
                uid,
                name,
                category,
                license_number,
                license_expiry_date,
                contact,
                trip_complete,
                status
            )
            VALUES
            (%s, %s, %s, %s, %s, %s, 0, %s)
            """,
            (
                data.uid,
                data.name,
                data.category,
                data.license_number,
                data.license_expiry_date,
                data.contact,
                "Available"
            )
        )

        db.commit()

        response.status_code = status.HTTP_201_CREATED
        return {"msg": "Driver registered successfully"}

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()


async def update_driver_status(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        # Check if driver exists
        con.execute(
            "SELECT * FROM drivers WHERE license_number=%s",
            (data.license_number,)
        )

        if not con.fetchone():
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "Driver not found"}

        # Update status
        con.execute(
            "UPDATE drivers SET status=%s WHERE license_number=%s",
            (data.status, data.license_number)
        )

        db.commit()

        response.status_code = status.HTTP_200_OK
        return {"msg": "Driver status updated successfully"}

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()



async def get_all_drivers(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor(dictionary=True)

        if data.uid != 0:
            con.execute(
                "SELECT * FROM drivers WHERE uid=%s",
                (data.uid,)
            )
        else:
            con.execute("SELECT * FROM drivers")

        drivers = con.fetchall()

        response.status_code = status.HTTP_200_OK
        return drivers

    except Exception as e:
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()