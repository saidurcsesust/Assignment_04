## Travel Search Backend API

├── server.js # Main server file  

├── package.json # Project dependencies and scripts  

├── mydb.sql # PostgreSQL database

### The `mydb.sql` file contains:
- Pre-stored data for flights and attractions

### Tables included:
- `flights`
- `attractions`

## Database Schema

### flights
```sql
CREATE TABLE flights (
  id SERIAL PRIMARY KEY,
  flight_name TEXT,
  arrival_airport TEXT,
  departure_airport TEXT,
  arrival_time TIMESTAMP,
  departure_time TIMESTAMP,
  flight_logo TEXT,
  fare NUMERIC,
  country TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attractions (
  id SERIAL PRIMARY KEY,
  attraction_name TEXT NOT NULL,
  attraction_slug TEXT UNIQUE NOT NULL,
  additional_info TEXT,
  cancellation_policy BOOLEAN,
  images TEXT,
  price NUMERIC,
  whats_included TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Clone the repository
git clone https://github.com/saidurcsesust/Assignment_04.git 

cd Assignment_04

### Install dependencies
```
npm install

```
### Configure PostgreSQL connection in server.js
```
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'postgres',
  port: 5432
});
```


### Start the server
node server.js  

Server runs at:  

http://localhost:3000

## API Endpoints
### Search by Location
GET /search/:locationname
Response
```
{
  "GeoInfo": { "location": "Amsterdam", "country": "Netherlands" },
  "Flights": [ ... ],
  "Attractions": [ ... ]
}

## Details Endpoint
GET /details/:id?searchtype=flight
GET /details/:id?searchtype=attraction

Flight Response
{
  "GeoInfo": { "id": 12, "location": "Amsterdam", "country": "Netherlands" },
  "Flight": { ... }
}

Attraction Response
{
  "GeoInfo": { "id": 3, "location": "Paris", "country": "France" },
  "Attraction": { ... }
}

```
## Testing in Browser
Examples:

http://localhost:3000/search/amsterdam  

http://localhost:3000/details/12?searchtype=flight  

http://localhost:3000/details/4?searchtype=attraction
