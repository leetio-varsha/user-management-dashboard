# User Management Dashboard

A full-stack application for managing user data with advanced filtering, sorting, and analytics capabilities.

## Project Structure

- **Frontend**: React application with TypeScript, Vite, and TailwindCSS
- **Backend**: Express.js API with TypeScript, Mongoose ODM, and MongoDB

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or Docker)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB (choose one option):

   **Option 1: Using Docker (Recommended)**
   ```bash
   # Start MongoDB container
   npm run docker:mongo:up
   
   # To stop MongoDB container when done
   npm run docker:mongo:down
   
   # To view MongoDB logs
   npm run docker:mongo:logs
   ```

   **Option 2: Using Local MongoDB Installation**
   - Ensure MongoDB is installed on your machine
   - Start MongoDB service:
     ```bash
     # On macOS/Linux
     mongod --dbpath=/data/db
     
     # On Windows
     "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
     ```
   - The application is configured to connect to MongoDB at `mongodb://localhost:27017/user-dashboard`
   - If your MongoDB is running on a different host/port, update the MONGO_URI in the `.env` file

4. Seed the database with sample data:
   ```bash
   npm run seed
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:5050 by default.

### Frontend Setup

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
   npm run dev
   ```
   The frontend will be available at http://localhost:5173 by default.

## Environment Variables

### Backend (.env)
- `PORT`: The port on which the backend server runs (default: 5050)
- `MONGO_URI`: MongoDB connection string (default: mongodb://localhost:27017/user-dashboard)

## Available Scripts

### Backend
- `npm start`: Start the backend server
- `npm run docker:mongo:up`: Start MongoDB in Docker
- `npm run docker:mongo:down`: Stop MongoDB Docker container
- `npm run seed`: Seed the database with sample data
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report

### Frontend
- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production build
- `npm test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report

## Application Features

- User management with CRUD operations
- Advanced filtering and sorting capabilities
- User analytics and statistics
- Responsive design with TailwindCSS
- RESTful API with Express.js
- MongoDB database with Mongoose ODM

## Testing

Both frontend and backend include comprehensive test suites:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```