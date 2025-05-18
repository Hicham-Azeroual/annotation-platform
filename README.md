<!-- Header with animated gradient -->
<div align="center">
  <img src="https://github.com/Hicham-Azeroual/annotation-platform/blob/main/assets/data-waves.gif?raw=true" alt="Annatopia Header" width="100%">
  <h1 align="center">✨ Annatopia - AI/ML Annotation Platform</h1>
  <h3 align="center">The Future of Data Annotation</h3>
  <div align="center">
    <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
  </div>
</div>

<br>

<!-- Project Overview Card -->
<div align="center" style="background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); border-radius: 15px; padding: 25px; margin: 20px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 1px solid rgba(138, 43, 226, 0.3);">
  <p style="font-size: 1.1rem; line-height: 1.6; color: #e0e0e0;">
    Annatopia is a full-stack web platform that revolutionizes data annotation for AI and machine learning. 
    It provides administrators with powerful tools to manage annotators, datasets, and real-time analytics 
    through an intuitive, responsive interface.
  </p>
</div>

## 🚀 Key Features

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0;">

### 🔐 Secure Access
![Security](https://img.shields.io/badge/Security-100%25-brightgreen)
- JWT authentication with role-based permissions
- Admin/annotator separation
- Activity logging

### 📊 Dashboard Analytics
![Analytics](https://img.shields.io/badge/Analytics-Realtime-blue)
- Interactive charts and metrics
- Progress tracking
- Quality control indicators

### 🏷️ Annotation Tools
![Annotation](https://img.shields.io/badge/Tools-Multiformat-orange)
-  text Paire
- Custom labeling schemas
- Collaborative features

### 🔄 Data Management
![Data](https://img.shields.io/badge/Data-Versioned-yellow)
- Dataset version control
- Bulk import/export
- Automated validation

</div>

## 🛠️ Technology Stack

### Backend
![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-lightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Redis](https://img.shields.io/badge/Redis-7.0-red)

### Frontend
![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-yellow)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-blueviolet)
![Zustand](https://img.shields.io/badge/State-Zustand-purple)



## 📦 Installation

### Prerequisites
- Java 21
- Node.js 18+
- MySQL 8.0
- Redis 7.0

### Backend Setup
```bash
git clone https://github.com/Hicham-Azeroual/annotation-platform.git
cd annotation-platform/annotation-platform-back-end

# Configure application.properties
cp src/main/resources/application.example.properties src/main/resources/application.properties

mvn clean install
mvn spring-boot:run
```
### Frontend Setup
```bash
cd ../annotation-platform-front-end
npm install
npm run dev
```
