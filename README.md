# Job Portal Application

## Overview
This is a full-stack Job Portal application, named HireHub, designed to connect job seekers with potential employers. It features a robust backend built with Node.js, Express, and MongoDB, and a dynamic frontend developed with React and Vite. The application allows users to browse jobs, apply for positions, manage profiles, and for companies to post and manage job listings.

## Features

### General Features
*   **User Authentication**: Secure signup, login, and logout functionalities for both job seekers and recruiters.
*   **User Profile Management**: Users can create, view, and update their profiles, including personal information, resumes, and saved jobs.
*   **Job Browsing and Search**: Advanced search capabilities with filters for location, job type, salary range, and company.
*   **Job Application Submission**: Seamless application process for job seekers, including resume upload and cover letter submission.
*   **Admin/Recruiter Dashboard**: Dedicated dashboard for recruiters to post new jobs, manage existing listings, view applicants, and track application statuses.
*   **Responsive Design**: The application is fully responsive, providing an optimal viewing experience across various devices (desktops, tablets, and mobile phones).

### Frontend Features
*   **Interactive Job Listings**: Dynamic display of job postings with infinite scrolling or pagination for a smooth browsing experience.
*   **User-Friendly Interface**: Intuitive and modern UI/UX design built with React, ensuring ease of navigation.
*   **State Management**: Utilizes **Redux Toolkit** for predictable and efficient state management across the application.
*   **Dynamic Routing**: Implemented using **React Router DOM** for seamless navigation between different sections of the application.
*   **Shadcn/ui Components**: Leverages a collection of beautifully designed and accessible UI components for a consistent look and feel.
*   **Theme Management**: Supports light and dark modes, allowing users to customize their viewing preference using **Next-themes**.
*   **Toast Notifications**: Provides informative and non-intrusive notifications using **Sonner** for user feedback on actions.
*   **Carousel for Categories**: Features an interactive carousel (**Embla Carousel React**) for showcasing job categories or featured companies.

### Backend Features
*   **RESTful API**: A well-structured RESTful API developed with **Express.js** to handle all interactions between the frontend and the database.
*   **Secure Authentication**: Implements **JWT (JSON Web Tokens)** for stateless authentication and **Bcryptjs** for secure password hashing.
*   **Cloud-based Image Upload**: Integrates **Cloudinary** for efficient storage and management of user avatars, company logos, and resumes, with **Multer** handling file uploads.
*   **MongoDB Database**: Uses **MongoDB** as the NoSQL database for flexible and scalable data storage, managed with **Mongoose** ODM.
*   **Role-Based Authorization**: Ensures that users have appropriate access levels (e.g., job seeker, recruiter, admin) to specific resources and functionalities.
*   **Environment Variable Management**: Securely handles sensitive information and configurations using **Dotenv**.
*   **Cross-Origin Resource Sharing (CORS)**: Configured with the **CORS** middleware to allow controlled access from different origins.

## Tech Stack

### Frontend
*   **React.js**: JavaScript library for building interactive user interfaces.
*   **Vite**: Next-generation frontend tooling that provides an extremely fast development experience.
*   **Redux Toolkit**: The official, opinionated, batteries-included toolset for efficient Redux development.
*   **Axios**: Promise-based HTTP client for the browser and Node.js.
*   **Tailwind CSS**: A highly customizable, utility-first CSS framework.
*   **Shadcn/ui**: A collection of re-usable components built with Radix UI and Tailwind CSS.
*   **Embla Carousel React**: A lightweight, dependency-free, and highly customizable carousel library.
*   **Lucide React**: A clean and consistent icon library for React projects.
*   **Sonner**: An accessible and customizable toast component for React.
*   **Next-themes**: An abstraction for themes in Next.js, handling system theme, localStorage, and more.
*   **React Router DOM**: Declarative routing for React applications.

### Backend
*   **Node.js**: A JavaScript runtime environment for server-side development.
*   **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
*   **MongoDB**: A document-oriented NoSQL database for high performance, high availability, and easy scalability.
*   **Mongoose**: An elegant MongoDB object modeling tool for Node.js.
*   **JWT (JSON Web Tokens)**: A compact, URL-safe means of representing claims to be transferred between two parties.
*   **Bcryptjs**: A library to help hash passwords.
*   **Cloudinary**: A cloud-based image and video management service.
*   **Multer**: Node.js middleware for handling `multipart/form-data`.
*   **Cookie-parser**: Parse Cookie header and populate `req.cookies` with an object keyed by the cookie names.
*   **CORS**: Node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
*   **Dotenv**: Loads environment variables from a `.env` file into `process.env`.

## Modules

### Backend Modules
*   `controllers/`: Contains the business logic for handling various entities: `application.controller.js` (for job applications), `company.controller.js` (for company profiles and job postings), `job.controller.js` (for job listings), and `user.controller.js` (for user management).
*   `middlewares/`: Custom middleware functions to enhance request processing: `isAuthenticated.js` (for JWT verification and user authentication), `multer.js` (for configuring file uploads to Cloudinary).
*   `models/`: Defines the data schemas and models for MongoDB using Mongoose: `application.model.js`, `company.model.js`, `job.model.js`, and `user.model.js`.
*   `routes/`: API endpoint definitions that map URLs to controller functions: `application.route.js`, `company.route.js`, `job.route.js`, and `user.routes.js`.
*   `utils/`: Helper utilities and configurations: `cloudinary.js` (Cloudinary integration), `datauri.js` (converts buffer to data URI), `db.js` (MongoDB connection setup), and `pagination.js` (logic for paginating results).
*   `server.js`: The main entry point of the backend application, responsible for setting up the Express server, connecting to the database, and integrating routes and middleware.

### Frontend Modules
*   `components/`: Houses reusable React components organized into various categories:
    *   **Core Components**: `HeroSection.jsx`, `Browse.jsx`, `Jobs.jsx`, `LatestJobs.jsx`, `Home.jsx`, `Profile.jsx`.
    *   **Job Related**: `Job.jsx`, `JobDescription.jsx`, `LatestJobCards.jsx`, `AppliedJobTable.jsx`, `SavedJobsTable.jsx`, `FilterCard.jsx`.
    *   **Navigation & Layout**: `Footer.jsx`.
    *   **Informational**: `ContactUs.jsx`, `FAQs.jsx`, `HelpCenter.jsx`, `PrivacyPolicy.jsx`, `TermsAndConditions.jsx`.
    *   **Authentication**: `auth/` directory for authentication-related components.
    *   **Recruiter Specific**: `recruiter/` directory for recruiter dashboard components.
    *   **Shared & UI**: `shared/` and `ui/` directories for common and Shadcn/ui components like `UpdateProfileDialog.jsx`.
*   `hooks/`: Contains custom React hooks for encapsulating reusable logic, such as `useGetAllAdminJobs.jsx`, `useGetAllCompanies.jsx`, `useGetAllJobs.jsx`, `useGetApplicants.jsx`, `useGetAppliedJobs.jsx`, and `useGetCompanyById.jsx` for data fetching.
*   `lib/`: Utility functions and helper modules, including `utils.js` for general-purpose functions.
*   `redux/`: Manages the application's global state using Redux Toolkit, with slices for `applicationSlice.js`, `authSlice.js`, `companySlice.js`, `jobSlice.js`, and the main `store.js` configuration.
*   `assets/`: Stores static assets such as `hero.png`, `Logo.png`, `react.svg`, and `vite.svg`.
*   `App.jsx`: The root component of the React application, defining the main structure and routing.
*   `main.jsx`: The entry point for the React application, responsible for rendering the `App` component into the DOM.

## Getting Started

### Prerequisites
*   **Node.js**: Ensure you have the latest LTS version installed.
*   **npm** or **yarn**: A package manager for JavaScript.
*   **MongoDB**: A running instance of MongoDB (either locally or a cloud service like MongoDB Atlas).

### Installation

1.  **Clone the repository:**
    Begin by cloning the project repository to your local machine:
    ```bash
    git clone https://github.com/Dazzling-Darshan/Job-Portal.git
    cd Job-Portal
    ```

2.  **Backend Setup:**
    Navigate to the `backend` directory and install the necessary dependencies:
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` directory and add the following environment variables. Replace the placeholder values with your actual credentials:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key_for_authentication
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

3.  **Frontend Setup:**
    Navigate to the `frontend` directory and install its dependencies:
    ```bash
    cd ../frontend
    npm install
    ```
    Create a `.env` file in the `frontend` directory with the following environment variable, pointing to your backend API:
    ```
    VITE_BACKEND_URL=http://localhost:5000/api
    ```

### Running the Application

1.  **Start the Backend Server:**
    From the `backend` directory, start the Node.js server:
    ```bash
    cd backend
    npm run dev
    ```
    The backend server will typically run on `http://localhost:5000` (or the port specified in your `.env` file).

2.  **Start the Frontend Development Server:**
    From the `frontend` directory, launch the React development server:
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend application will usually be accessible at `http://localhost:5173` (or an alternative port if 5173 is occupied).

## Contributing

We welcome contributions to the Job Portal application! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request with a clear description of your changes.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

This project is licensed under the ISC License. See the `LICENSE` file for more details. (Note: A `LICENSE` file is not currently present, but typically would be here.)
