# 🐾 AI Veterinary Assistant

**Professional AI-powered veterinary care for your domestic pets**

A modern web application providing 24/7 veterinary consultations, comprehensive medicine database, and expert advice for pet owners in Latvia and Russia.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 **KEY FEATURES**

### 🤖 **AI Veterinary Consultations**
- **Smart Symptom Analysis**: AI analyzes pet symptoms and provides structured advice
- **Species-Specific Guidance**: Tailored advice for dogs, cats, birds, rabbits, and more
- **Emergency Detection**: Automatically detects emergency situations and provides immediate guidance
- **Multilingual Support**: Full support for Latvian and Russian languages

### 💊 **Comprehensive Medicine Database**
- **10+ Veterinary Medicines**: Antibiotics, painkillers, vitamins, supplements
- **Detailed Information**: Dosage, side effects, contraindications, ingredients
- **Smart Search**: Search by medicine name, ingredients, or symptoms
- **Category Filtering**: Filter by medicine type and suitable pet species
- **Safety Warnings**: Clear prescription requirements and usage warnings

### 🔍 **Advanced Search & Filtering**
- **Real-time Search**: Instant results as you type
- **Multi-filter Support**: Filter by category, pet species, prescription requirements
- **Detailed Medicine Cards**: Complete information including dosage for different pets

### 🌍 **Multilingual Interface**
- **Latvian** (Primary): Complete translation for Latvian users
- **Russian**: Full Russian language support
- **Auto-detection**: Automatically detects user's preferred language

## 🚀 **QUICK START**

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/knoticoo/Strategy.git
cd Strategy

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ **TECHNICAL ARCHITECTURE**

### **Frontend Stack**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with comprehensive interfaces
- **Vite** - Lightning-fast development and build tool
- **Tailwind CSS** - Utility-first CSS framework for modern UI
- **Lucide React** - Beautiful, customizable icons

### **Key Technologies**
- **react-i18next** - Internationalization with language detection
- **Modern CSS** - Custom animations, responsive design, dark mode support
- **TypeScript Interfaces** - Comprehensive type definitions for all data structures

### **Project Structure**
```
src/
├── components/
│   ├── Chat/           # AI consultation interface
│   ├── Layout/         # Header, navigation components  
│   └── Medicines/      # Medicine search and details
├── data/              # Medicine database and mock data
├── i18n/              # Language translations (LV/RU)
├── services/          # AI service and API integrations
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities
```

## 💊 **MEDICINE DATABASE**

### **Categories Covered**
- **Antibiotics**: Amoxicillin, Doxycycline
- **Pain Management**: Meloxicam, NSAIDs
- **Vitamins & Supplements**: B-Complex, Omega-3, Probiotics
- **Specialized Foods**: Royal Canin, Hill's Prescription Diet
- **Parasite Control**: Frontline Plus, antiparasitic treatments
- **Skin Care**: Chlorhexidine shampoos, dermatological treatments

### **Pet Species Supported**
🐕 Dogs | 🐱 Cats | 🐦 Birds | 🐰 Rabbits | 🐹 Hamsters | 🐹 Guinea Pigs | 🐠 Fish | 🦎 Reptiles

## 🤖 **AI CAPABILITIES**

### **Symptom Analysis**
- **Hair Loss Detection**: Identifies potential causes and treatments
- **Appetite Issues**: Analyzes eating problems and dietary solutions  
- **Behavioral Changes**: Recognizes unusual pet behavior patterns
- **Emergency Recognition**: Detects critical symptoms requiring immediate care

### **Response Format**
- **Assessment**: Professional evaluation of described symptoms
- **Possible Causes**: Comprehensive list of potential issues
- **Recommendations**: Step-by-step action plan
- **Medicine Suggestions**: Relevant treatments from database
- **Dietary Advice**: Nutritional recommendations
- **Veterinary Guidance**: When to seek professional help

## 🚨 **SAFETY FEATURES**

### **Emergency Detection**
- **Keyword Recognition**: Detects emergency terms in multiple languages
- **Immediate Alerts**: Shows emergency warning modal
- **Emergency Contacts**: Direct links to veterinary emergency services
- **Critical Symptoms**: Lists signs requiring immediate attention

### **Professional Disclaimers**
- Clear warnings that AI advice doesn't replace veterinary care
- Prescription medicine warnings and safety information
- Dosage guidelines with species-specific recommendations

## 🌐 **LANGUAGE SUPPORT**

### **Latvian (Primary)**
- Complete UI translation
- Veterinary terminology in Latvian
- Local emergency contact information
- Cultural adaptation for Latvian pet owners

### **Russian (Secondary)** 
- Full Russian language interface
- Veterinary terms translated appropriately
- Russian emergency contact information

## 📱 **RESPONSIVE DESIGN**

- **Mobile-First**: Optimized for smartphones and tablets
- **Desktop Experience**: Full-featured desktop interface
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Accessibility**: Screen reader compatible, keyboard navigation

## 🔧 **DEVELOPMENT**

### **Available Scripts**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### **Environment Setup**
- Modern Node.js environment
- TypeScript strict mode enabled
- ESLint with React and TypeScript rules
- Prettier for code formatting

## 🚀 **DEPLOYMENT**

Ready for deployment on:
- **Vercel** (Recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

## ⚠️ **IMPORTANT DISCLAIMERS**

- **Not a Replacement**: This AI assistant does not replace professional veterinary care
- **Emergency Situations**: Always contact a veterinarian immediately for serious symptoms
- **Prescription Medicines**: Only use prescription medications under veterinary supervision
- **Educational Purpose**: Information provided is for educational purposes only

## 🤝 **CONTRIBUTING**

This is a professional veterinary assistance tool. Contributions should maintain high medical accuracy and safety standards.

## 📄 **LICENSE**

MIT License - See LICENSE file for details.

---

**🏥 For veterinary emergencies in Latvia: Call 112**
**💡 This application provides educational information only and does not replace professional veterinary care.**
