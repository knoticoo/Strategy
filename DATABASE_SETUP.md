# 🗄️ Database Integration Setup Guide

## 🚀 **NEW FEATURES IMPLEMENTED**

### ✅ **Real Database Integration**
- **SQLite Database**: All data now stored in `adventure_app.db`
- **User Management**: Real user profiles with database persistence
- **Trail Management**: Admin can CRUD trails with full details
- **Community Posts**: Real posts from database with user attribution
- **Statistics**: Live platform statistics from database

### ✅ **File Upload System**
- **Profile Pictures**: Upload from device gallery (not just URLs)
- **Trail Images**: Upload trail photos directly from device
- **Community Posts**: Upload photos from gallery for posts
- **5MB File Limit**: Optimized for web performance
- **Automatic File Naming**: Unique filenames to prevent conflicts

### ✅ **Admin Panel Enhancement**
- **Real User Data**: Shows actual users from database
- **Live Statistics**: Real-time platform metrics
- **Trail CRUD**: Full create, read, update, delete operations
- **Multi-language Support**: Edit trails in EN/LV/RU
- **Image Management**: Upload and preview trail images

## 📋 **SETUP INSTRUCTIONS**

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Start the Application**
```bash
npm start
```
This will automatically start:
- **Backend Server** on `http://localhost:5000`
- **React Frontend** on `http://localhost:3000`

### 3. **Database Initialization**
The SQLite database will be automatically created with:
- **Sample Users**: Including admin account
- **Sample Trails**: Real Latvian trail data
- **Database Tables**: Users, trails, community posts, likes, comments

### 4. **Admin Access**
- **Email**: `emalinovskis@me.com`
- **Password**: `Millie1991`

## 🔧 **API Endpoints**

### **Authentication**
- `POST /api/auth/login` - User login

### **Users**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile

### **Trails**
- `GET /api/trails` - Get all trails
- `POST /api/trails` - Create new trail (admin)
- `PUT /api/trails/:id` - Update trail (admin)
- `DELETE /api/trails/:id` - Delete trail (admin)

### **Community Posts**
- `GET /api/community-posts` - Get all posts
- `POST /api/community-posts` - Create new post

### **File Upload**
- `POST /api/upload` - Upload image file

### **Statistics**
- `GET /api/stats` - Get platform statistics

## 📁 **File Structure**
```
├── server/
│   └── server.js          # Express server with SQLite
├── uploads/               # Uploaded images storage
├── adventure_app.db       # SQLite database file
├── src/
│   ├── services/
│   │   └── api.ts         # API service layer
│   └── components/
│       ├── AuthTab.tsx    # Admin panel + profiles
│       └── CommunityTab.tsx # Community with uploads
```

## 🎯 **Key Features**

### **For Users:**
- ✅ Upload profile pictures from device
- ✅ Create community posts with photos
- ✅ Edit full profile (bio, interests, location)
- ✅ Real-time data from database

### **For Admins:**
- ✅ Comprehensive trail management
- ✅ User monitoring and statistics
- ✅ Image upload for trails
- ✅ Multi-language content editing
- ✅ Real-time platform metrics

## 🔐 **Security Features**
- **File Type Validation**: Only images allowed
- **File Size Limits**: 5MB maximum
- **Admin Authentication**: Secure admin access
- **SQL Injection Protection**: Parameterized queries

## 📊 **Database Schema**

### **Users Table**
- Profile data, stats, admin flags
- Avatar URLs, bio, interests
- Trail completion tracking

### **Trails Table**
- Multi-language names/descriptions
- GPS coordinates, difficulty, features
- Pricing, contact info, accessibility

### **Community Posts Table**
- User attribution, content, images
- Post types, locations, timestamps

## 🚀 **Next Steps**
1. **Production Database**: Migrate to PostgreSQL/MySQL
2. **Authentication**: JWT tokens, password hashing
3. **Real-time Features**: WebSocket integration
4. **CDN Integration**: AWS S3/CloudFront for images
5. **Push Notifications**: PWA notifications

## 🐛 **Troubleshooting**

### **Port Conflicts**
If port 5000 is busy:
```bash
PORT=5001 npm run server
```

### **Database Issues**
Delete and recreate database:
```bash
rm adventure_app.db
npm start
```

### **Upload Directory**
Create manually if needed:
```bash
mkdir uploads
```

## 📱 **Testing the Features**

### **Admin Panel**
1. Login with admin credentials
2. Go to Profile → Admin Panel
3. Test trail creation/editing
4. Upload trail images
5. Monitor user statistics

### **Community Posts**
1. Create account or login
2. Go to Community tab
3. Create post with photo upload
4. Test image gallery selection

### **Profile Management**
1. Edit profile information
2. Upload profile picture
3. Add bio and interests
4. Save changes to database

---

🎉 **The app now has full database integration with real file uploads!** All data persists between sessions, and admins have complete control over content management.