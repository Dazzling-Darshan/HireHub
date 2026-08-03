# 🎓 HireHub: Comprehensive MERN Architecture & Interview Guide

This document is your master study guide. It breaks down the entire Job Portal project into logical learning modules. It is designed not just to tell you *what* the code does, but to give you the deep architectural understanding required to ace a full-stack developer interview.

---

## 🗂️ Module 1: Foundation & Server Setup
**Primary File:** `backend/server.js`

This module covers how the backend comes to life and handles incoming HTTP traffic.

### 1.1 The Express Application
```javascript
import express from "express";
const app = express();
```
*   **What is Express?** It is a fast, unopinionated web framework for Node.js. It handles routing (directing URLs to functions) and middleware processing.
*   **ES Modules:** The project uses `import` instead of `require`. This is enabled by `"type": "module"` in your `backend/package.json`. It aligns Node.js with modern browser JavaScript standards.

### 1.2 Global Middlewares
Middlewares are functions that execute *before* your route logic. They intercept the incoming request.
```javascript
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
```
*   **`express.json()`**: When a frontend sends data (like a login form) as a JSON string, this middleware parses it and attaches it to `req.body` so your controllers can read it as a JavaScript object.
*   **`express.urlencoded()`**: Does the same thing but for standard HTML form submissions.
*   **`cookieParser()`**: Parses the `Cookie` header from incoming requests and populates `req.cookies`. This is absolutely crucial for reading the JWT token during authentication.

### 1.3 CORS Security (Cross-Origin Resource Sharing)
```javascript
const corsOptions = {
    origin: ["https://job-portal-8j14.onrender.com", "http://localhost:5173"],
    credentials: true,
}
app.use(cors(corsOptions));
```
*   **The Concept:** Browsers have a "Same-Origin Policy" which blocks a frontend on `localhost:5173` from requesting data from a backend on `localhost:8000` to prevent malicious scripts.
*   **The Fix:** The `cors` middleware adds specific HTTP headers to the backend response telling the browser, "It is safe to let `localhost:5173` read this data."
*   **`credentials: true`**: This is critical. Without it, the browser will refuse to send or receive the HTTP-only cookies containing your JWT tokens across different origins.

---

## 🗃️ Module 2: Database & Data Modeling
**Primary Files:** `backend/utils/db.js`, `backend/models/*.js`

### 2.1 Mongoose & MongoDB Connection
```javascript
// backend/utils/db.js
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');
    } catch (error) { ... }
}
```
*   **Mongoose vs MongoDB:** MongoDB is a schemaless NoSQL database (it stores raw JSON-like BSON documents). Mongoose is an ODM (Object Document Mapper) that forces a strict schema/structure onto MongoDB, ensuring data integrity.
*   **Async/Await:** Database connections take time. `await` halts the function execution until the connection succeeds or fails.

### 2.2 Relational Data in NoSQL (Schemas)
Let's look at how the `Job` model connects to the `Company` and `User` models.
```javascript
// Inside backend/models/job.model.js
company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
},
created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
applications: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }
]
```
*   **`ObjectId` & `ref`**: This is how NoSQL handles relationships. Instead of embedding the entire company object inside the job, we just save the Company's unique 24-character ID. The `ref: 'Company'` tells Mongoose which collection that ID belongs to.
*   **Populate Method:** When you fetch a job, the controller runs `.populate('company')`. Mongoose takes the ObjectId, goes to the Company collection, fetches the full company details, and replaces the ID with the object before sending it to the frontend. It acts like a SQL `JOIN`.

---

## 🔒 Module 3: Authentication & Security
**Primary Files:** `backend/controllers/user.controller.js`, `backend/middlewares/isAuthenticated.js`

### 3.1 The Registration Flow
1.  **Validation:** Ensure email, password, and role are provided.
2.  **Duplicate Check:** `User.findOne({ email })`.
3.  **Password Hashing:** `const hashedPassword = await bcrypt.hash(password, 10);`
    *   *Interview Note:* Never store plain-text passwords. `bcrypt` is a one-way hashing algorithm. The `10` refers to salt rounds, meaning the algorithm runs $2^{10}$ times, making it resistant to brute-force attacks.
4.  **Creation:** Save the user with `User.create()`.

### 3.2 The Login Flow & JWT Generation
1.  **Verification:** Find the user by email, then use `bcrypt.compare(plainPassword, user.password)` to verify.
2.  **JWT Creation:**
    ```javascript
    const tokenData = { userId: user._id }
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
    ```
    *   *Interview Note:* A JWT (JSON Web Token) is a cryptographically signed string. The backend can trust it because if anyone tampers with the payload (`userId`), the signature breaks.
3.  **Cookie Delivery:**
    ```javascript
    return res.status(200).cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: 'lax'
    }).json({ ... })
    ```
    *   **`httpOnly: true`**: Crucial security measure. It means frontend JavaScript (`document.cookie`) cannot read the cookie, making it immune to XSS (Cross-Site Scripting) attacks.

### 3.3 Route Protection (Middleware)
```javascript
// backend/middlewares/isAuthenticated.js
const token = req.cookies.token;
if(!token) return res.status(401).json({ message: "User not authenticated" });

const decode = await jwt.verify(token, process.env.SECRET_KEY);
req.id = decode.userId;
next();
```
When a user tries to create a job, this middleware runs first. It extracts the JWT from the cookie, verifies it, and attaches the user's ID to `req.id`. The `next()` function then passes control to the actual `postJob` controller, which can now use `req.id` to know exactly who is creating the job.

---

## 📁 Module 4: File Upload Architecture
**Primary Files:** `backend/middlewares/multer.js`, `backend/utils/cloudinary.js`, `backend/utils/datauri.js`

This project does not store files on the server's hard drive. It uses cloud storage. Here is the exact data pipeline:

1.  **Multer (`memoryStorage`)**: When the frontend submits a file (e.g., a resume), the `multer` middleware intercepts it. Instead of saving it to disk, it holds the raw binary file in RAM as a Buffer (`req.file.buffer`).
2.  **DataURI Conversion**:
    ```javascript
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
    ```
    Cloudinary's API requires files to be passed as base64-encoded strings if they aren't on a local disk. This utility converts the raw RAM buffer into a base64 string formatted as a Data URI (e.g., `data:image/png;base64,iVBORw0K...`).
3.  **Cloudinary Upload**:
    ```javascript
    const fileUri = getDataUri(req.file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    ```
    The base64 string is pushed to Cloudinary. Cloudinary hosts the file and returns a response containing a `secure_url`.
4.  **Database Save**: We save `cloudResponse.secure_url` in MongoDB, not the file itself.

---

## 🖥️ Module 5: Frontend Architecture (React & Vite)
**Primary Files:** `frontend/src/main.jsx`, `frontend/src/App.jsx`

### 5.1 Vite & Proxying
*   **What is Vite?** A modern, extremely fast build tool and development server. Unlike Create React App (Webpack), Vite doesn't bundle all your files during development; it serves native ES modules directly to the browser.
*   **The Dev Proxy (`vite.config.js`)**:
    ```javascript
    proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } }
    ```
    To avoid CORS errors during local development, Vite intercepts any Axios call starting with `/api` and secretly forwards it to your backend. The browser thinks it's talking to the frontend server, bypassing CORS restrictions.

### 5.2 React Router Setup
```javascript
// frontend/src/App.jsx
const appRouter = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/jobs', element: <Jobs /> },
]);
<RouterProvider router={appRouter} />
```
*   **Client-Side Routing:** When a user clicks a link, the browser does *not* request a new HTML page from the server. Instead, React Router intercepts the URL change and uses JavaScript to instantly swap out the React components on the screen. This makes the app feel like a fast, native application (Single Page Application - SPA).

---

## 🧠 Module 6: Global State Management (Redux)
**Primary Files:** `frontend/src/redux/store.js`, `frontend/src/redux/authSlice.js`

### 6.1 Why Redux?
React relies on passing data down via "props". If the `<Navbar>` needs the user's profile picture, and the `<Profile>` page needs their name, you'd have to pass that data through every component in between (Prop Drilling). Redux creates a global "store" outside the component tree that any component can read from or write to directly.

### 6.2 The Redux Flow (Slices)
```javascript
// authSlice.js
export const authSlice = createSlice({
    name: "auth",
    initialState: { loading: false, user: null },
    reducers: {
        setLoading: (state, action) => { state.loading = action.payload; },
        setUser: (state, action) => { state.user = action.payload; }
    }
});
```
1.  **Component Action:** A component calls `dispatch(setUser(data))`.
2.  **Reducer:** The reducer catches the action and safely updates the `user` state. (Note: Redux Toolkit uses the `Immer` library under the hood, which allows you to write mutating code like `state.user = ...` while safely keeping the state immutable).
3.  **UI Update:** Any component using `const { user } = useSelector(store => store.auth)` will instantly re-render.

### 6.3 Redux Persist
*   **The Problem:** Redux state lives in JavaScript memory. If you hit F5 to refresh the page, the memory is wiped, and the user is logged out.
*   **The Solution (`store.js`):** `redux-persist` is configured to wrap the Redux store. Every time the state changes, it serializes it and saves it to the browser's `localStorage`. When the app reloads, `<PersistGate>` pauses the UI rendering, grabs the data from `localStorage`, and injects it back into Redux (Rehydration), keeping the user logged in.

---

## 🔌 Module 7: API Integration & Custom Hooks
**Primary Files:** `frontend/src/hooks/useGetAllJobs.jsx`

This project uses a clean architectural pattern for data fetching by extracting it into Custom Hooks.

### 7.1 Anatomy of a Custom Hook
```javascript
const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchJobs = async () => {
            const res = await axios.get(`${JOB_API_ENDPOINT}/get?keyword=${searchedQuery}`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAllJobs(res.data.jobs));
            }
        };
        fetchJobs();
    }, [searchedQuery]);
}
```
1.  **Separation of Concerns:** The `<Jobs>` component simply calls `useGetAllJobs()`. It doesn't need to know *how* the data is fetched.
2.  **`useEffect` Dependency Array:** The array `[searchedQuery]` is crucial. It tells React: "Run this effect when the component mounts, AND re-run it anytime the user types a new search query."
3.  **Axios & `withCredentials`:** Whenever Axios makes a request to the backend, `withCredentials: true` forces the browser to attach the HTTP-only JWT cookie to the request headers. Without this, the backend `isAuthenticated` middleware would reject the request.

---

## ⚙️ Module 8: Complex Features Deep Dive

### 8.1 Backend Search and Filtering
```javascript
// backend/controllers/job.controller.js
const keyword = req.query.keyword || "";
const query = {
    $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
    ]
};
const jobs = await Job.find(query);
```
*   **Explanation:** When a user searches for "React", the backend uses MongoDB's `$regex` (Regular Expressions) to find any job where the title OR (`$or`) the description contains "React". The `$options: "i"` makes it case-insensitive (matching "react", "REACT", etc.).

### 8.2 Frontend Filtering (Immediate UI Updates)
```javascript
// frontend/src/components/Browse.jsx
useEffect(() => {
    let result = allJobs;
    if (searchedQuery) {
        result = result.filter(job => job.title.toLowerCase().includes(searchedQuery.toLowerCase()));
    }
    // Update local state to trigger render
}, [searchedQuery, allJobs]);
```
*   **Explanation:** Instead of making a new backend request every time a filter checkbox is clicked, the frontend loads all relevant jobs into Redux once. The UI then uses standard JavaScript `.filter()` methods to instantly hide or show jobs on the screen. This provides a lightning-fast user experience.

### 8.3 Pagination Logic
```javascript
// backend/utils/pagination.js
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const skip = (page - 1) * limit;

const jobs = await Job.find().skip(skip).limit(limit);
```
*   **Explanation:** If a user requests Page 3 with a limit of 10 items per page, the formula calculates `skip = (3 - 1) * 10 = 20`. MongoDB will skip the first 20 records in the database and `limit` the output to the next 10 records.
