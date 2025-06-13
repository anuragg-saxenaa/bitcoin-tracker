# Real-Time Bitcoin Tracker

A full-stack application that tracks Bitcoin prices in real-time with a modern, responsive UI.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Chart.js for data visualization
- Axios for API calls
- WebSocket for real-time updates

### Backend
- Spring Boot 3
- Java 17+
- WebSocket support
- REST API
- CoinGecko API integration

## Project Structure

```
demo/
├── frontend/          # React application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── README.md
└── README.md
```

## Features

- Real-time Bitcoin price updates
- Price history charts
- Responsive design
- Modern UI with dark/light mode
- WebSocket connections for live data
- Price alerts and notifications

## Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
mvn spring-boot:run
```

## API Endpoints

- `GET /api/bitcoin/price` - Current Bitcoin price
- `GET /api/bitcoin/history` - Price history
- `WS /ws/bitcoin` - WebSocket for real-time updates

## Environment Variables

### Backend
- `COINGECKO_API_KEY` - CoinGecko API key (optional) # bitcoin-tracker
