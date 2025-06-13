# Bitcoin Tracker Setup Guide

## Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17+** (for Spring Boot backend)
- **Maven 3.6+** (for Spring Boot dependency management)
- **Node.js 18+** (for React frontend)
- **npm** (comes with Node.js)

## Backend Setup (Spring Boot)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies and run the application:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Available Backend Endpoints:
- `GET http://localhost:8080/api/bitcoin/price` - Current Bitcoin price
- `GET http://localhost:8080/api/bitcoin/history?hours=24` - Price history
- `GET http://localhost:8080/api/bitcoin/health` - Health check
- `WS http://localhost:8080/ws` - WebSocket endpoint for real-time updates

## Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## Running Both Applications

1. **Terminal 1** - Start the backend:
```bash
cd backend
mvn spring-boot:run
```

2. **Terminal 2** - Start the frontend:
```bash
cd frontend
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Features

- ✅ Real-time Bitcoin price updates (every 30 seconds)
- ✅ WebSocket connection for live data
- ✅ Price history chart (24 hours)
- ✅ Market statistics (Market Cap, Volume, 24h Change)
- ✅ Dark/Light mode toggle
- ✅ Responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Connection status indicator

## API Data Source

This application uses the **CoinGecko API** to fetch Bitcoin price data. No API key is required for basic usage.

## Development Notes

- The backend uses an H2 in-memory database for storing price history
- Price data is fetched every 30 seconds and stored in the database
- WebSocket connections provide real-time updates to the frontend
- The frontend automatically reconnects if the WebSocket connection is lost

## Troubleshooting

1. **Backend not starting**: Ensure Java 17+ is installed and `JAVA_HOME` is set correctly
2. **Frontend not starting**: Ensure Node.js 18+ is installed and run `npm install` first
3. **WebSocket connection issues**: Make sure both frontend and backend are running and ports are not blocked
4. **API errors**: Check internet connection and CoinGecko API availability

## Production Deployment

For production deployment:

1. **Backend**: Build with `mvn clean package` and deploy the JAR file
2. **Frontend**: Build with `npm run build` and serve the static files
3. **Environment**: Update API URLs in the frontend service to point to your production backend URL 