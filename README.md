<h1 align="center">Blogosphere - A Blogging Platform</h1>
<p align="center">

  ![demo](./frontend/src/assets/blogospheree.gif)
</p>

<div align="center">
Blogosphere is a dynamic, user-friendly blogging platform that empowers writers to create, manage, and share their content effortlessly. Built with responsiveness in mind, it offers a seamless experience across devices.
<br><br>
<div align="left">

- 📝 Create and edit blog posts
- 🖼️ Upload custom header images via Cloudinary integration
- 📋 Save drafts for future publishing
- 🗑️ Manage and delete your own content
- 👤 User account management, including account deletion
- 📱 Responsive design for optimal viewing on all devices
</div>
</div>

## Technology used: 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Zod Badge](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=fff)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&&logo=postgresql&logoColor=fff)
![Hono Badge](https://img.shields.io/badge/Hono-E36002?logo=hono&style=for-the-badge&&logoColor=fff)
![Prisma Badge](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=fff)
![Cloudinary Badge](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=fff)

## Project Setup

1. **Clone the repository**
```
git clone https://github.com/Thanisha23/Blogosphere.git
```

2. **Navigate to the project directory and install dependencies for the backend**
 ```
cd backend
pnpm install
```

3. **Create a file named `.env` in the root directory of backend and add the following environment variables(Get DATABASE_URL from any postgreSQL DB Provider )**
```plaintext
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
FRONTEND_URL="http://localhost:5173"
```
4. **If you don't have a `wrangler.toml` file, create one in the root directory of your project. Here's an example configuration:**
```
name = "your-project-name"
compatibility_date = "2023-12-01"
[vars]
DATABASE_URL="your-connection-pool-url(from prisma accelerate)"
ALLOWED_ORIGIN = "http://localhost:5173"
JWT_SECRET = "your_jwt_secret"
FRONTEND_URL = "http://localhost:5173"
# [[kv_namespaces]]
# binding = "MY_KV_NAMESPACE"
# id = "your-kv-namespace-id"
```
5. **Set Up Prisma**
    1.Apply migrations to your database
    ```
    pnpx prisma migrate dev --name init_schema
    ```
    2.Generate the prisma client 
    ```
    pnpx prisma generate --no-engine
    ```
6. **Start the Development Server**
```
pnpm run dev
```
7. **In a new terminal, navigate to the frontend directory and install the dependencies**
```
cd frontend
pnpm install
```
8. **Create a file named `.env` in the root directory add the following environment variables**
```
VITE_BACKEND_URL = "YOUR_BACKEND_URL"
VITE_CLOUDINARY_URL = "YOUR_CLOUDINARY_URL"
VITE_CLOUD_NAME = "YOUR_CLOUD_NAME"
```
9. **Start the frontend development server**
```
pnpm run dev
```

<div align="center"><h4>More better projects to come soon!😁👀</h4></div>
<div align="center"><h4>Made by Thanisha Belchada</h4></div>
