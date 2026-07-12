
from fastapi import Response, status
from app.database import database
import traceback


from fastapi import Response, status
from app.database import database
import traceback


async def create_trip(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor()

        # Check vehicle availability
        if data.vehicle_id is not None:
            con.execute(
                "SELECT status FROM vehicles WHERE id=%s",
                (data.vehicle_id,)
            )
            vehicle = con.fetchone()

            if not vehicle:
                response.status_code = status.HTTP_404_NOT_FOUND
                return {"msg": "Vehicle not found"}

            if vehicle[0] != "Available":
                response.status_code = status.HTTP_409_CONFLICT
                return {"msg": "Vehicle is not available. Please reload."}

        # Check driver availability
        if data.driver_id is not None:
            con.execute(
                "SELECT status FROM drivers WHERE id=%s",
                (data.driver_id,)
            )
            driver = con.fetchone()

            if not driver:
                response.status_code = status.HTTP_404_NOT_FOUND
                return {"msg": "Driver not found"}

            if driver[0] != "Available":
                response.status_code = status.HTTP_409_CONFLICT
                return {"msg": "Driver is not available. Please reload."}

        # Create trip
        con.execute(
            """
            INSERT INTO trip
            (
                uid,
                source,
                destination,
                vehicle_id,
                driver_id,
                cargo_weight,
                distance,
                status
            )
            VALUES
            (%s,%s,%s,%s,%s,%s,%s,%s)
            """,
            (
                data.uid,
                data.source,
                data.destination,
                data.vehicle_id,
                data.driver_id,
                data.cargo_weight,
                data.distance,
                data.status
            )
        )

        trip_id = con.lastrowid

# If trip is dispatched, mark driver and vehicle as on trip
        if data.status == "Dispatched":
            if data.vehicle_id is not None:
                con.execute(
            "UPDATE vehicles SET status=%s WHERE id=%s",
            ("On Trip", data.vehicle_id)
            )

            if data.driver_id is not None:
                con.execute(
                "UPDATE drivers SET status=%s WHERE id=%s",
                ("On Trip", data.driver_id)
            )

        db.commit()

        response.status_code = status.HTTP_201_CREATED
        return {
            "msg": "Trip saved successfully",
            "trip_id": con.lastrowid
        }

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()

async def get_available_vehicles(response: Response):
    db = database()
    con = None

    try:
        con = db.cursor(dictionary=True)

        con.execute(
            "SELECT * FROM vehicles WHERE status=%s",
            ("Available",)
        )

        vehicles = con.fetchall()

        response.status_code = status.HTTP_200_OK
        return vehicles

    except Exception as e:
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()



async def get_available_drivers(response: Response):
    db = database()
    con = None

    try:
        con = db.cursor(dictionary=True)

        con.execute("UPDATE drivers SET status='Expired' WHERE license_expiry_date < CURDATE() AND status != 'Expired'")
        db.commit()

        con.execute(
            "SELECT * FROM drivers WHERE status=%s",
            ("Available",)
        )

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

async def get_all_trips(response: Response, data):
    db = database()
    con = None

    try:
        con = db.cursor(dictionary=True)

        query = """
            SELECT
                t.id,
                t.source,
                t.destination,
                t.status,
                v.Vname AS vehicle_name,
                d.name AS driver_name
            FROM trip t
            LEFT JOIN vehicles v ON t.vehicle_id = v.id
            LEFT JOIN drivers d ON t.driver_id = d.id
        """
        
        if data.uid != 0:
            query += " WHERE t.uid = %s "
            query += " ORDER BY t.id DESC "
            con.execute(query, (data.uid,))
        else:
            query += " ORDER BY t.id DESC "
            con.execute(query)
        trips = con.fetchall()

        response.status_code = status.HTTP_200_OK
        return trips

    except Exception as e:
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}

    finally:
        if con:
            con.close()
        db.close()

async def update_trip_status(response: Response, data):
    db = database()
    con = None
    try:
        con = db.cursor(dictionary=True)
        
        # 1. Get the trip details
        con.execute("SELECT * FROM trip WHERE id=%s", (data.trip_id,))
        trip = con.fetchone()
        
        if not trip:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"msg": "Trip not found"}
            
        # 2. Update trip status
        con.execute(
            "UPDATE trip SET status=%s WHERE id=%s",
            (data.status, data.trip_id)
        )
        
        # 3. If status is Completed or Cancelled, free up vehicle and driver
        if data.status in ["Completed", "Cancelled"]:
            if trip['vehicle_id']:
                con.execute(
                    "UPDATE vehicles SET status=%s WHERE id=%s",
                    ("Available", trip['vehicle_id'])
                )
            if trip['driver_id']:
                con.execute(
                    "UPDATE drivers SET status=%s WHERE id=%s",
                    ("Available", trip['driver_id'])
                )
                
        db.commit()
        response.status_code = status.HTTP_200_OK
        return {"msg": "Trip status updated successfully"}
        
    except Exception as e:
        db.rollback()
        traceback.print_exc()
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"msg": str(e)}
    finally:
        if con:
            con.close()
        db.close()
