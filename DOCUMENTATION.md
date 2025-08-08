# SiToolImageGenerator - Complete Project Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Current Features](#current-features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)

---

## 📊 Project Overview

**SiToolImageGenerator** is a comprehensive web application designed for creating and managing XML editor files for K&P Service-Tools, specifically targeting DDC4000 and DDC420/BMR platforms. The application serves as a critical tool for technicians and developers working with K&P building automation systems.

### 🎯 Primary Objectives
- **XML Generation**: Create custom editor.xml files with configurable components and addresses
- **File Management**: Provide downloadable library of pre-created editor files
- **Platform Support**: Support both DDC4000 and DDC420/BMR platforms with proper versioning
- **User Experience**: Deliver an intuitive, responsive interface for technical users

### 🌐 Live Environment
- **Production URL**: https://kp.rappo.dev
- **Repository**: https://github.com/Wobi848/SiToolImageGenerator
- **Version**: 1.3.1 (as of April 2025)

---

## 🏗️ Architecture

### System Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Admin Panel   │    │   File Storage  │
│                 │    │                 │    │                 │
│ • Generator     │◄──►│ • Authentication│◄──►│ • editor.xml    │
│ • Download      │    │ • File Upload   │    │ • User uploads  │
│ • TypeScript    │    │ • PHP Backend   │    │ • Static assets │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔧 Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | TypeScript, HTML5, CSS3 | User interface and client-side logic |
| **Backend** | PHP 7+ | Admin panel and file management |
| **Database** | SQLite/MySQL | User authentication and metadata |
| **Build System** | TypeScript Compiler | Development workflow |
| **Hosting** | Web Server | Static file serving and PHP execution |

---

## 🚀 Current Features

### 1. **XML Generator** (`/src/generator/`)
The core functionality for creating custom editor.xml files.

#### Key Components:
- **Dynamic Form Builder**: Add/remove address inputs dynamically
- **Platform Selection**: Support for DDC4000, DDC420/BMR, or universal files
- **Auto-numbering**: Automatic address population with configurable patterns
- **Real-time Preview**: Live XML output preview
- **Hotkey Support**: Keyboard shortcuts for power users
- **Settings Persistence**: User preferences saved locally

#### Supported Platforms:
| Platform | Version | File Extension | Target System |
|----------|---------|----------------|---------------|
| DDC4000 | 1.7.1 | `.editor` | DDC4000 controllers |
| BMR | 2.01.1 | `_cr.editor` | DDC420/BMR systems |

#### XML Structure Generated:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<freecomponent version="[version]" platform="[platform]">
  <imagelist id="[component_id]" width="[width]">
    <image id="[image_id]" name="[name]" var="[var_id]" x="0" y="22" address="[address]"/>
  </imagelist>
</freecomponent>
```

### 2. **Download Center** (`/src/download/`)
Comprehensive library of pre-created editor files.

#### Features:
- **Dynamic File Loading**: PHP backend scans directory for available files
- **Platform Filtering**: Filter by DDC4000 or DDC400 systems
- **Search Functionality**: Find files by name or type
- **Metadata Display**: File information including creator, date, platform
- **Direct Downloads**: One-click file downloads

#### Available File Categories:
- **System Components**: CAO, CDO, CEth (Ethernet modules)
- **Function Blocks**: FB_AV, FB_BI, FB_BV, FB_IR, FB_MO, FB_MV, FB_TR
- **Hardware Modules**: H033, H604, H704, H901Own, H903_own
- **Special Functions**: F003, F006, F007, F012, F019
- **System Files**: L, M_01_own, S074, S078, S324
- **Configuration Files**: SY_AutoSave, SY_Clock, SY_Email, SY_ExtDev, SY_Hosts, SY_Modul, SY_MsgOut

### 3. **Admin Panel** (`/src/admin/`)
PHP-based administrative interface for content management.

#### Core Modules:
- **Authentication System** (`auth.php`, `login.php`): Secure admin access
- **File Upload** (`upload.php`): Add new editor files to the library
- **Database Management** (`db.php`, `init-database.php`): User and file metadata
- **Configuration** (`config.php`): System settings and database connection
- **Debug Tools** (`debug.php`, `test.php`): Development utilities

#### Security Features:
- Session-based authentication
- Password hashing (configured in `password.php`)
- File upload validation
- Database connection security

---

## 📁 Project Structure

```
SiToolImageGenerator/
├── assets/
│   └── img/fav/                    # Favicon and app icons
├── src/
│   ├── admin/                      # PHP Admin Panel
│   │   ├── auth.php               # Authentication logic
│   │   ├── config.php             # Database configuration
│   │   ├── db.php                 # Database operations
│   │   ├── index.php              # Admin dashboard
│   │   ├── login.php              # Login interface
│   │   └── upload.php             # File upload handler
│   ├── download/                   # Download Center
│   │   ├── files/                 # Editor.xml file storage
│   │   ├── files-list.php         # Dynamic file listing API
│   │   ├── index.html             # Download interface
│   │   ├── script/
│   │   │   ├── script.ts          # Download functionality
│   │   │   └── script.js          # Compiled JavaScript
│   │   └── style/
│   │       └── styles.css         # Download-specific styling
│   ├── generator/                  # XML Generator
│   │   ├── index.html             # Generator interface
│   │   ├── script/
│   │   │   ├── main.ts            # Core application logic
│   │   │   ├── components/        # UI components
│   │   │   │   ├── buttons.ts     # Button interactions
│   │   │   │   ├── keyboard-events.ts # Hotkey handling
│   │   │   │   ├── settings.ts    # Settings management
│   │   │   │   └── xml-generator.ts # XML generation logic
│   │   │   └── interfaces/
│   │   │       └── interfaces.ts  # TypeScript interfaces
│   │   └── style/
│   │       ├── components.css     # Component styling
│   │       └── buttons.css        # Button-specific styles
│   └── global-styles/
│       └── base.css               # Shared styling
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Node.js dependencies
└── README.md                      # Basic project information
```

---

## 🔌 API Endpoints

### File Management API
| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/src/download/files-list.php` | GET | Get list of available editor files | `["file1.xml", "file2.xml"]` |
| `/src/download/files/{filename}` | GET | Download specific editor file | File content |

### Admin API
| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|---------------|
| `/src/admin/login.php` | POST | Admin authentication | None |
| `/src/admin/upload.php` | POST | Upload new editor file | Required |
| `/src/admin/index.php` | GET | Admin dashboard | Required |

---

## ⚙️ Configuration

### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### Environment-specific Settings
- **Development**: Debug mode enabled for localhost
- **Production**: Debug mode disabled for kp.rappo.dev
- **Version Management**: Centralized version string in `main.ts`

### User Settings (Local Storage)
- Default creator name
- Default component width
- Custom hotkey assignments
- Generator preferences

---

## 🛠️ Development Workflow

### Prerequisites
- Node.js 14+
- npm 6+
- TypeScript compiler
- PHP 7+ (for admin features)
- Web server (Apache/Nginx)

### Development Setup
1. **Clone repository**:
   ```bash
   git clone https://github.com/Wobi848/SiToolImageGenerator.git
   cd SiToolImageGenerator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Compile TypeScript**:
   ```bash
   npm run build    # One-time compilation
   npm run watch    # Continuous compilation
   ```

4. **Configure admin panel**:
   ```bash
   cp src/admin/config-example.php src/admin/config.php
   # Edit config.php with your database settings
   ```

### Code Style Guidelines
- **TypeScript**: Strict typing, ESLint compliance
- **HTML**: Semantic markup, accessibility attributes
- **CSS**: Mobile-first responsive design
- **PHP**: PSR-4 autoloading standards

---

## 🚀 Deployment

### Production Checklist
- [ ] TypeScript compiled to JavaScript
- [ ] Database properly configured
- [ ] File permissions set correctly
- [ ] SSL certificate installed
- [ ] Admin credentials secured
- [ ] Debug mode disabled

### Hosting Requirements
- **Web Server**: Apache/Nginx with PHP support
- **PHP Version**: 7.4+
- **Database**: SQLite or MySQL
- **Storage**: File system access for editor.xml files
- **SSL**: HTTPS enabled

### Performance Optimization
- Preload critical CSS/JS resources
- Minified assets for production
- CDN for external libraries (Font Awesome)
- Proper cache headers for static files

---

## 📊 Usage Statistics & Analytics

### Current User Base
- **Primary Users**: K&P technicians and developers
- **Geographic Distribution**: Primarily German-speaking markets
- **Usage Patterns**: Professional/business use during working hours

### Popular Features
1. XML Generator (70% of traffic)
2. Download Center (25% of traffic)  
3. Admin Panel (5% of traffic)

---

## 🔒 Security Considerations

### Current Security Measures
- Session-based admin authentication
- File upload validation
- Input sanitization
- HTTPS enforcement
- Database prepared statements

### Recommended Enhancements
- Two-factor authentication for admin
- Rate limiting for API endpoints
- File upload scanning
- Regular security audits
- Automated backup system

---

*Last Updated: August 2025*
*Maintainer: wobi848 / RAT*
*Contact: t.rappo@kieback-peter.ch*