# FastAPI Backend

This is the backend for the FastAPI + React Starter.

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend runs on `http://localhost:8000`.


CREATE DATABASE TransitOps;

CREATE TABLE `user` (    id INT AUTO_INCREMENT UNIQUE,    email VARCHAR(255) NOT NULL,    pass VARCHAR(255) NOT NULL,    role VARCHAR(50) NOT NULL);

CREATE TABLE vehicles (    id INT AUTO_INCREMENT UNIQUE,    uid INT NOT NULL,    Vname VARCHAR(100) NOT NULL,    type VARCHAR(50) NOT NULL,    capacity INT NOT NULL,    odometer DECIMAL(10,2) DEFAULT 0,    acquisition_cost DECIMAL(10,2) DEFAULT 0,    status VARCHAR(50));


CREATE TABLE drivers (    id INT AUTO_INCREMENT UNIQUE,    uid INT NOT NULL,    name VARCHAR(100) NOT NULL,    category VARCHAR(50) NOT NULL,    license_number VARCHAR(50) NOT NULL UNIQUE,    license_expiry_date DATE NOT NULL,    contact VARCHAR(15) NOT NULL,    trip_complete INT DEFAULT 0,    status VARCHAR(50) NOT NULL);