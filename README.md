# 🏢 Society Management System

A full-stack web application designed to manage residential society operations such as flats, residents, payments, notifications, and reports. Built with modern technologies, it provides role-based access for admins and residents, along with Google authentication support for guest users.

---

## 🚀 Features

### 👑 Admin Features

* Get a overview of the society
* Manage residents to flats
* Record manual payments
* View financial reports
* Send notifications to all or specific residents
* View pending payments and collection stats
* Update personal profile

---

### 🏠 Resident Features

* View dashboard with payment status
* Pay monthly maintenance (UPI mock)
* View payment history
* Update profile and password
* Receive notifications
* Download payment reciepts

---

### 🌐 Guest (Google Login Users)

* Can login via Google
* Limited access
* Displaying a message about the available choices
* Contact admin for residency purposes

---

## 🛠️ Tech Stack

| Layer          | Technology                                |
| -------------- | ----------------------------------------- |
| Frontend       | Next.js (App Router), React, Tailwind CSS |
| Backend        | Next.js API Routes                        |
| Database       | PostgreSQL                                |
| Authentication | NextAuth (Google OAuth)                   |
| Icons          | Lucide React                              |

---

## 📁 Project Structure

```
src/
 ├── app/
 │    ├── admin/
 │    ├── (resident)/
 │    ├── api/
 │    └── ...
 ├── lib/
 │    └── db.ts
 ├── components/
 ├── types/
middleware.ts
.env.local
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

---

## 🔑 Google OAuth Setup

1. Go to Google Cloud Console
2. Create project
3. Configure OAuth Consent Screen (External)
4. Add credentials:

   * Origin: `http://localhost:3000`
   * Redirect URI:
     `http://localhost:3000/api/auth/callback/google`
5. Publish app (for public login)

---

## 🗄️ Database Overview

### Tables:

* `users`
* `flats`
* `flat_master`
* `monthly_records`
* `payments`
* `notifications`
* `subscription_plans`

---

## 💰 Payment Logic

* Amount is based on flat type:

  * 1BHK → ₹12000
  * 2BHK → ₹16000
  * 3BHK → ₹18000
    محفو
---

## 🔒 Middleware Protection

* `/admin/*` → only admin
* Residents cannot access admin routes
* Guests have restricted UI

---

## 📊 Reports

* Total collection
* Monthly collection
* Yearly collection
* Pending payments
* Payment mode breakdown

---

## 📥 Installation

```bash
git clone <repo-url>
cd project
npm install
npm run dev
```

---

## 🧪 Test Accounts

### Admin

```
email: sameer@gmail.com
password: admin123
```

### Residents

```
current residents (3)
  email : gaurav@gmail.com
  password : gaurav123

  email : gunjan@gmail.com
  password : gunjan123

  email : harshita@gmail.com
  password : harshita123
---
```
## 📌 Summary

A complete society management platform with:

* Role-based access
* Secure authentication
* Financial tracking
* Scalable architecture

---

**Built with ❤️ using Next.js**
