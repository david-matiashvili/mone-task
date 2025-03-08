# Mone App

Mone App is a backend application built with NestJS and PostgreSQL, designed to manage user authentication and friend request functionalities. It uses Docker Compose to orchestrate the application and database services, providing a seamless environment for local and production deployments.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)

## Features
- User registration and login with JWT-based authentication
- Search for users by username
- Send, accept, and decline friend requests
- Secure cookie-based session management
- Dockerized setup for easy deployment

## Prerequisites
Before you begin, ensure you have the following installed:
- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.x recommended)
- **Node.js** (version 18.x or higher, for local development outside Docker)
- **npm** (comes with Node.js)

## Installation

1. Clone the Repository:
    ```bash
    git clone https://github.com/your-username/mone-app.git
    cd mone-app
    ```

2. Set Up Environment Variables:
    - Create a `.env` file in the root directory.
    - Add the following variables to the `.env` file:
      ```text
      DB_USER=postgre
      DB_HOST=localhost
      DB_NAME=mone_task
      DB_PASSWORD=123456
      DB_PORT=5432
      JWT_SECRET=your-secure-jwt-secret-here
      JWT_EXPIRES_IN=1h
      COOKIE_SECRET=your-secure-cookie-secret-here
      ```
    - Replace `your-secure-jwt-secret-here` and `your-secure-cookie-secret-here` with strong, unique secrets.

3. Prepare Initialization SQL (Optional):
    - If you have an `init.sql` file for initializing the PostgreSQL database, place it in the root directory. This file will be executed when the PostgreSQL container starts.

## Configuration

The application uses Docker Compose to manage services. The configuration is defined in `docker-compose.yml`:

- **Postgres Service**: Runs PostgreSQL 15 with persistent data storage.
- **NestJS Service**: Builds and runs the NestJS application, connecting to the Postgres database.

Key configurations:
- **Ports**:
  - PostgreSQL: `${DB_PORT}` (default: 5432)
  - NestJS: 3000
- **Volumes**: Persistent data is stored in `postgres_data`.

## Running the Application

1. Build and Start the Services:
    ```bash
    docker compose up -d --build
    ```

    This command builds the NestJS application and starts both the PostgreSQL and NestJS services in detached mode.

2. Check Logs:
    To verify that the services are running correctly:
    ```bash
    docker compose logs
    ```

3. Stop the Application:
    To stop the services:
    ```bash
    docker compose down
    ```

    To remove volumes as well:
    ```bash
    docker compose down -v
    ```
