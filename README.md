# JobTrackr Backend

This is the backend service for **JobTrackr**, a job application management tool. The backend is built with **Express.js**, using **MongoDB** for data storage, and includes features such as **user authentication**, **job management**, **file uploads**, and **profile management** with image and document handling via **Cloudinary**.

## Features

-   User registration and login with JWT-based authentication.
-   Profile and job management for users.
-   File uploads (profile pictures, CVs) stored in **Cloudinary**.
-   CRUD operations on jobs (create, read, update, delete).
-   Secure password handling with **bcrypt**.
-   Auto Wake up scheduled tasks with **Node-Cron** to bypass render free plan limitation.
-   Validation using **Yup** and request body validation middleware.
-   Structured with RESTful API principles.

## Extra

My **Route Registration custom Middleware** dynamically extracts and registers application routes for easy route management and auditing. This **custom** middleware ensures that all registered routes are collected and available for inspection during runtime, which can be especially useful for debugging and documentation.

```js
const extractPaths = require('../utils/paths-extract')
const registratedRoutes = []

function extractRoutes(req, res, next) {
    const extractedPaths = []
    registratedRoutes.forEach((crudRoute) => {
        extractedPaths.push(...extractPaths(crudRoute.stack))
    })
    req.extractedPaths = extractedPaths
    next()
}

module.exports = { registratedRoutes, extractRoutes }
```

## Technologies Used

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web framework for Node.js.
-   **MongoDB & Mongoose**: Database and Object Data Modeling (ODM) tool.
-   **Cloudinary**: For file storage and management.
-   **JWT**: For authentication tokens.
-   **Bcrypt**: For password hashing.
-   **Multer**: Middleware for handling file uploads.
-   **Node-Cron**: Task scheduling library.
-   **Axios**: HTTP client for making requests.
-   **Cross-Env**: For managing environment variables across environments.

## Installation

### Prerequisites

-   [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
-   A MongoDB instance (either locally or via a cloud service like MongoDB Atlas).
-   Cloudinary account for file uploads.

### Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/Rashy-hub/JobTrackr-backend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd JobTrackr-backend
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Create a `.env` file in the root of your project and configure it with the following variables (you can also use `.env.production` for production environments):

```bash
PORT=8080
MONGODB_URI='mongodb+srv://<DB_USER>:<DB_PASSWORD>@cluster0.ri74qko.mongodb.net/<DB_NAME>?retryWrites=true&w=majority&appName=<APP_NAME>'
JWT_SECRET='<YOUR_JWT_SECRET>'
JWT_AUDIENCE='<YOUR_JWT_AUDIENCE>'
JWT_ISSUER='<YOUR_JWT_ISSUER>'
SELF_URL="${RENDER_EXTERNAL_URL}/api/wakeup"
CLOUDINARY_NAME='<YOUR_CLOUDINARY_NAME>'
CLOUDINARY_API_KEY='<YOUR_CLOUDINARY_API_KEY>'
CLOUDINARY_API_SECRET='<YOUR_CLOUDINARY_API_SECRET>'

```

5. Make sure MongoDB and Cloudinary are correctly set up with your credentials.

## Environment Variables

-   `PORT`: The port on which the server will run.
-   `MONGODB_URI`: MongoDB connection string.
-   `JWT_SECRET`: Secret key for JWT authentication.
-   `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Credentials for Cloudinary to handle file uploads.

## Running the Application

You can run the application in development or production modes:

-   **Development**:

```bash
npm run dev
```

This will start the server with **nodemon** for hot-reloading.

-   **Production**:

```bash
npm start
```

This will run the server with **cross-env** for setting environment variables.

## API Endpoints

### Authentication

| Method | Endpoint         | Description         |
| ------ | ---------------- | ------------------- |
| POST   | `/auth/register` | Register a new user |
| POST   | `/auth/login`    | Log in a user       |
| POST   | `/auth/refresh`  | Refresh JWT token   |

### Jobs

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| GET    | `/jobs`          | Retrieve jobs for the user    |
| GET    | `/jobs/:id`      | Retrieve a specific job by ID |
| POST   | `/jobs`          | Create a new job entry        |
| PUT    | `/jobs/:id`      | Update a job entry by ID      |
| DELETE | `/jobs/:id`      | Delete a job entry by ID      |
| GET    | `/jobs/populate` | Populate job data for testing |

### Profile

| Method | Endpoint   | Description                          |
| ------ | ---------- | ------------------------------------ |
| GET    | `/profile` | Retrieve user profile information    |
| PUT    | `/profile` | Update user profile with file upload |

## Main Middlewares

-   **Body Validation**: Validates request bodies using **Yup** schemas.
-   **JWT Authentication**: Protects routes by validating JWT tokens.
-   **Multer**: Handles file uploads for profile pictures and CVs.
-   **Cloudinary**: Manages image and file storage in the cloud.

```

```
