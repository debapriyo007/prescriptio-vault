<div align="center">

# 💊 Medical Prescription Portal

**A secure, full-stack platform for digital prescription exchange between doctors and patients.**

Say goodbye to lost paper prescriptions — doctors upload, patients retrieve, OTP verifies. Simple, secure, always accessible.

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" /></a>
  <a href="https://spring.io/projects/spring-boot"><img src="https://img.shields.io/badge/Backend-SpringBoot-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="SpringBoot" /></a>
  <a href="https://www.oracle.com/java/"><img src="https://img.shields.io/badge/Language-Java-orange?style=flat-square&logo=java&logoColor=white" alt="Java" /></a>
  <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/Database-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" /></a>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square" alt="Status" />
</p>

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [User Roles](#-user-roles)
- [Features](#-features)
- [Prescription Retrieval Flow](#-prescription-retrieval-flow)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Security Considerations](#-security-considerations)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Contact](#-contact)
- [License](#-license)

---

## 🧭 Overview

The **Medical Prescription Portal** digitizes and simplifies the prescription-sharing workflow between healthcare providers and patients.

Patients frequently lose or misplace physical prescriptions, creating friction when refilling medication or consulting another provider. This platform solves that problem by letting **doctors upload prescriptions digitally** and giving **patients secure, login-free access** to retrieve them on demand — authenticated via **email-based OTP verification**.

### Highlights

| Highlight | Description |
| :--- | :--- |
| 🩺 **Doctor Dashboard** | Fast, structured prescription uploads linked to patient records |
| 🔐 **OTP Authentication** | Passwordless, time-bound identity verification for patients |
| 📥 **Patient Portal** | Simple, login-free gateway to retrieve prescriptions anytime |
| 🗄️ **Secure Storage** | Reliable, access-controlled storage of prescription files |

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React, Tailwind CSS |
| Backend | Spring Boot (Java) |
| Database | MySQL |
| Auth | Email-based OTP |
| File Storage | Local / cloud object storage (configurable) |

---

## 🏗️ System Architecture

```
┌───────────────┐        ┌──────────────────┐        ┌───────────────┐
│   Doctor UI   │───────▶│  Spring Boot API │───────▶│  MySQL DB     │
│ (React/Tailwind)│      │  (REST Services) │        │ (Patients,    │
└───────────────┘        │                  │        │  Prescriptions)│
                          │                  │        └───────────────┘
┌───────────────┐        │                  │        ┌───────────────┐
│  Patient UI   │───────▶│  OTP Service ─────────────▶│  Email Provider│
│ (React/Tailwind)│      │  (Generate/Verify)│        │  (SMTP)        │
└───────────────┘        └──────────────────┘        └───────────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │  File Storage     │
                          │ (Prescriptions)   │
                          └──────────────────┘
```

---

## 👥 User Roles

### 🩺 Doctor

Doctors use the platform to:
- Upload prescription files (PDF/Image) for a patient.
- Associate uploads with the patient's registered email address.
- Maintain a history of issued prescriptions per patient.
- Ensure patients retain long-term access without needing physical copies.

### 🧑‍⚕️ Patient

Patients can:
- Enter their registered email address to initiate a request.
- Receive a secure, time-limited One-Time Password (OTP) via email.
- Verify their identity by submitting the correct OTP.
- Instantly download their prescription upon successful verification.

---

## ✨ Features

| Component | Feature | Description |
| :--- | :--- | :--- |
| **Doctor Features** | Upload Prescription | Upload PDF/Image prescription files |
| | Patient Records | Manage and associate patient records |
| | Secure Storage | Encrypted / access-controlled file repository |
| **Patient Features** | Request OTP | Request a temporary token via email |
| | Verify OTP | Authenticate the token securely |
| | Download Prescription | Retrieve and download the file instantly |

---

## 🔄 Prescription Retrieval Flow

1. **Patient** enters their registered email on the portal.
2. System generates a time-bound **OTP** and sends it to the email.
3. **Patient** submits the OTP for verification.
4. On success, the system authorizes a **one-time secure download link**.
5. **Patient** downloads the prescription instantly.

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Maven

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```sql
CREATE DATABASE prescription_portal;
```
Update your database credentials in `application.properties` before starting the backend.

---

## 🔑 Environment Variables

| Variable | Description |
| :--- | :--- |
| `DB_URL` | MySQL connection string |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `MAIL_HOST` | SMTP host for sending OTP emails |
| `MAIL_USERNAME` | SMTP account username |
| `MAIL_PASSWORD` | SMTP account password |
| `OTP_EXPIRY_MINUTES` | OTP validity duration |

---

## 🔒 Security Considerations

- OTPs are time-bound and single-use to prevent replay attacks.
- Prescription files are stored in an access-controlled repository, never publicly indexed.
- Email is used as the sole identifier to minimize the attack surface — no passwords are stored for patients.
- All sensitive endpoints should be served over HTTPS in production.

---

## 🗺️ Roadmap

- [ ] Two-factor authentication for doctors
- [ ] Patient prescription history dashboard
- [ ] Mobile-responsive UI enhancements
- [ ] Audit logs for prescription access
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## 📬 Contact

Feel free to reach out for inquiries, feedback, or collaboration:

- **Email:** [debapriyo00@gmail.com](mailto:debapriyo00@gmail.com)
- **GitHub:** [@debapriyo007](https://github.com/debapriyo007)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Built with the goal of making prescription management **simple, secure, and always accessible**.

</div>