from fastapi import Response, status
from app.database import database
import traceback


async def register_vehicle(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        # Check if license plate already exists
        con.execute(
            "SELECT * FROM vehicles WHERE license_plate=%s",
            (data.license_plate,)
        )

        if con.fetchone():
            response.status_code = status.HTTP_409_CONFLICT
            return {"msg": "License plate already registered"}

        # Register vehicle
        con.execute(
            """
            INSERT INTO vehicles
            (uid, Vname, license_plate, type, capacity, odometer, acquisition_cost, status)
            VALUES (%s, %s, %s, %s, %s, 0, 0, %s)
            """,
            (
                data.uid,
                data.Vname,
                data.license_plate,
                data.type,
                data.capacity,
                data.status
            )
        )

        db.commit()

        response.status_code = status.HTTP_201_CREATED
        return {"msg": "Vehicle registered successfully"}

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()


async def update_vehicle_status(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        con.execute(
            "SELECT * FROM vehicles WHERE license_plate=%s",
            (data.license_plate,)
        )

        if not con.fetchone():
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "Vehicle not found"}

        con.execute(
            "UPDATE vehicles SET status=%s WHERE license_plate=%s",
            (data.status, data.license_plate)
        )

        db.commit()

        response.status_code = status.HTTP_200_OK
        return {"msg": "Vehicle status updated successfully"}

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()