from fastapi import Response, status
from app.database import database
import traceback


async def register_maintenance(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        # Check if vehicle exists
        con.execute(
            "SELECT * FROM vehicles WHERE license_plate=%s",
            (data.license_plate,)
        )

        if not con.fetchone():
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "Vehicle not found"}

        # Add maintenance record
        con.execute(
            """
            INSERT INTO maintenance
            (
                license_plate,
                service_name,
                cost,
                service_date,
                status
            )
            VALUES
            (%s,%s,%s,%s,'Active')
            """,
            (
                data.license_plate,
                data.service_name,
                data.cost,
                data.service_date
            )
        )

        db.commit()

        response.status_code = status.HTTP_201_CREATED
        return {"msg": "Maintenance record added successfully"}

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()


async def update_maintenance_status(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        con.execute(
            "SELECT * FROM maintenance WHERE id=%s",
            (data.id,)
        )

        if not con.fetchone():
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "Maintenance record not found"}

        con.execute(
            "UPDATE maintenance SET status=%s WHERE id=%s",
            (data.status, data.id)
        )

        db.commit()

        response.status_code = status.HTTP_200_OK
        return {"msg": "Maintenance status updated successfully"}

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()


async def get_all_maintenance(response: Response):
    db = database()
    con = None

    try:
        con = db.cursor(dictionary=True)

        con.execute("SELECT * FROM maintenance")

        maintenance = con.fetchall()

        response.status_code = status.HTTP_200_OK
        return maintenance

    except Exception as e:
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()