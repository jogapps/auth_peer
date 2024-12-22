# Authentication | Relationship | Account Mangement


## Features

- User Authentication: JWT-based authentication.
- Onboarding: Register, Login
- Friends:
    - Get Recommendations, Send Request, Cancel Request.
    - Get Pending Requests, Get Approved Requests
    - Approve a Request
- Postgres Integration: Persistent database storage.
- Secondary Storage: Kafka

### Prerequisites
Before you start, ensure you have the following installed:

- Node.js (v14 or above)
- npm (v6 or above)
- Kafka Setup

## Setup Instructions
1. Clone the Repository


    git clone https://github.com/jogapps/auth_peer
    cd auth_peer


2. Install Dependencies


    npm install


3. Environment Variables


    PORT
    JWT_SECRET
    JWT_EXPIRES_IN
    JWT_AUDIENCE
    JWT_ISSUER
    JWT_ALGORITHM
    KAFKA_BROKERS=

    NODE_ENVIRONMENT=

    DB_HOST=
    DB_PASSWORD=
    DB_USERNAME=
    DB_NAME=
copy .env from .env.example


4. Start the Server


    npm start

The server will start and be accessible at http://localhost:{PORT} and Base_Url at http://localhost:{PORT}/api/v1


## Scripts


    npm start: Starts the server
    npm run dev: Starts the server in development mode



