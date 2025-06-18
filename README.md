# 📁 DriveClone - Google Drive-like Authorization System

A secure, scalable, and flexible file management and sharing system inspired by Google Drive. It supports user-based and link-based sharing, role-based access control, and hierarchical file/folder organization.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT, bcrypt)
- 👤 **Role-Based Access Control** (OWNER, EDITOR, VIEWER)
- 📂 **Hierarchical File/Folder Management**
- 📤 **Upload, Download, Move, Delete Files**
- 🔗 **User-based and Public Link Sharing**
- 🧾 **Permission Inheritance**
- 📊 **Activity Logging** (optional)
- ☁️ **Cloud-Ready File Storage**

---

## 🛠️ Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Frontend    | React / Next.js (optional)    |
| Backend     | Node.js, Express.js           |
| Auth        | JWT, bcrypt, Passport.js      |
| DB          | PostgreSQL or MySQL + Sequelize |
| File Storage| AWS S3 / Cloudinary / Local FS |

---

## 📦 Installation

```bash
git clone https://github.com/your-username/driveclone-backend.git
cd driveclone-backend
npm install
Create a .env file:

env
Copy
Edit
PORT=5000
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=youruser
DB_PASS=yourpassword
DB_NAME=driveclone
▶️ Run the Project
bash
Copy
Edit
npm run dev
🧩 Project Structure
pgsql
Copy
Edit~
.
├── controllers
│   └── authController.js
│   └── fileController.js
│   └── permissionController.js
├── models
│   └── user.js
│   └── resource.js
│   └── permission.js
├── routes
│   └── authRoutes.js
│   └── fileRoutes.js
│   └── permissionRoutes.js
├── middlewares
│   └── authMiddleware.js
│   └── roleMiddleware.js
├── utils
│   └── fileUpload.js
│   └── jwt.js
├── config
│   └── db.js
├── .env
├── app.js
└── server.js
📄 API Endpoints (Sample)
Auth
POST /auth/register

POST /auth/login

Files/Folders
GET /resources/:id

POST /resources - create file/folder

PUT /resources/:id - rename/move

DELETE /resources/:id

Sharing & Permissions
POST /share/:resourceId

GET /permissions/:resourceId

DELETE /share/:resourceId/:userId

✅ User Roles
Role	Capabilities
OWNER	Full access + manage permissions
EDITOR	View, edit, delete
VIEWER	View/download only

🔐 Security
Passwords hashed using bcrypt

JWT for session management

Role middleware for endpoint protection

Public link sharing has expiration option (optional)

📚 License
MIT © 2025 Vinod Vadla

🤝 Contributing
Pull requests and stars are welcome! For major changes, please open an issue first.