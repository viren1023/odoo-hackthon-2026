from fastapi import Response, status
from app.database import database
import traceback


async def register_maintenance(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        # Check if vehicle exists and belongs to the user
        con.execute(
            """
            SELECT id
            FROM vehicles
            WHERE license_plate=%s AND uid=%s
            """,
            (data.license_plate, data.uid)
        )

        if not con.fetchone():
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "Vehicle not found or does not belong to you"}

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


async def get_all_maintenance(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor(dictionary=True)

        query = """
            SELECT
                m.id,
                m.license_plate,
                m.service_name,
                m.cost,
                m.service_date,
                m.status
            FROM maintenance m
            INNER JOIN vehicles v
                ON m.license_plate = v.license_plate
            WHERE v.uid = %s
            ORDER BY m.id DESC
        """

        con.execute(query, (data.uid,))
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