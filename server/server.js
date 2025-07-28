const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Initialize SQLite Database
const db = new sqlite3.Database('./adventure_app.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT,
      location TEXT,
      country TEXT,
      bio TEXT,
      interests TEXT,
      avatar_url TEXT,
      is_admin BOOLEAN DEFAULT 0,
      stats_trails_completed INTEGER DEFAULT 0,
      stats_photos_shared INTEGER DEFAULT 0,
      stats_points INTEGER DEFAULT 0,
      stats_level INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Trails table
  db.run(`
    CREATE TABLE IF NOT EXISTS trails (
      id TEXT PRIMARY KEY,
      name_en TEXT,
      name_lv TEXT,
      name_ru TEXT,
      description_en TEXT,
      description_lv TEXT,
      description_ru TEXT,
      region TEXT,
      difficulty TEXT,
      distance TEXT,
      duration TEXT,
      elevation TEXT,
      latitude REAL,
      longitude REAL,
      image_url TEXT,
      features TEXT, -- JSON string
      accessibility TEXT,
      best_time_to_visit TEXT,
      trail_condition TEXT DEFAULT 'good',
      parking_available BOOLEAN DEFAULT 0,
      guided_tours_available BOOLEAN DEFAULT 0,
      free_entry BOOLEAN DEFAULT 1,
      adult_price REAL DEFAULT 0,
      child_price REAL DEFAULT 0,
      contact_phone TEXT,
      contact_email TEXT,
      contact_website TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Community posts table
  db.run(`
    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      type TEXT,
      content TEXT,
      image_url TEXT,
      location TEXT,
      likes_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Post likes table
  db.run(`
    CREATE TABLE IF NOT EXISTS post_likes (
      id TEXT PRIMARY KEY,
      post_id TEXT,
      user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES community_posts (id),
      FOREIGN KEY (user_id) REFERENCES users (id),
      UNIQUE(post_id, user_id)
    )
  `);

  // Comments table
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      post_id TEXT,
      user_id TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES community_posts (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);

  // Insert sample data
  insertSampleData();
}

function insertSampleData() {
  // Insert admin user
  db.run(`
    INSERT OR IGNORE INTO users (id, name, email, is_admin, location, country, bio, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'admin-1',
    'Admin',
    'emalinovskis@me.com',
    1,
    'Riga',
    'Latvia',
    'Platform administrator and adventure enthusiast',
    'Hiking, Photography, Nature Conservation'
  ]);

  // Insert sample users
  const sampleUsers = [
    ['user-1', 'Adventure Explorer', 'explorer@example.com', 0, 'Riga', 'Latvia', 'Love exploring Latvian nature', 'Hiking, Photography'],
    ['user-2', 'Nature Lover', 'nature@example.com', 0, 'Daugavpils', 'Latvia', 'Passionate about wildlife', 'Wildlife, Camping'],
    ['user-3', 'Trail Master', 'trails@example.com', 0, 'Liepāja', 'Latvia', 'Professional hiking guide', 'Guiding, Mountaineering'],
    ['user-4', 'Photo Hunter', 'photos@example.com', 0, 'Ventspils', 'Latvia', 'Adventure photographer', 'Photography, Travel']
  ];

  sampleUsers.forEach(user => {
    db.run(`
      INSERT OR IGNORE INTO users (id, name, email, is_admin, location, country, bio, interests)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, user);
  });

  // Insert sample trails (from realLatvianData)
  const sampleTrails = [
    {
      id: 'trail-1',
      name_en: 'Gauja National Park Trail',
      name_lv: 'Gaujas Nacionālā parka taka',
      name_ru: 'Тропа Национального парка Гауя',
      description_en: 'Beautiful trail through Latvia\'s oldest national park',
      description_lv: 'Skaista taka cauri Latvijas vecākajam nacionālajam parkam',
      description_ru: 'Красивая тропа через старейший национальный парк Латвии',
      region: 'Gauja National Park',
      difficulty: 'moderate',
      distance: '8.5 km',
      duration: '3-4 hours',
      elevation: '120m',
      latitude: 57.1316,
      longitude: 25.4016,
      image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      features: JSON.stringify(['Scenic views', 'Wildlife', 'Historical sites']),
      accessibility: 'Moderate difficulty, suitable for experienced hikers',
      best_time_to_visit: 'May - October',
      trail_condition: 'good',
      parking_available: 1,
      guided_tours_available: 1,
      free_entry: 1,
      contact_phone: '+371 64781624',
      contact_website: 'https://www.daba.gov.lv/public/lat/gaujas_np/'
    }
  ];

  sampleTrails.forEach(trail => {
    db.run(`
      INSERT OR IGNORE INTO trails (
        id, name_en, name_lv, name_ru, description_en, description_lv, description_ru,
        region, difficulty, distance, duration, elevation, latitude, longitude,
        image_url, features, accessibility, best_time_to_visit, trail_condition,
        parking_available, guided_tours_available, free_entry, contact_phone, contact_website
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      trail.id, trail.name_en, trail.name_lv, trail.name_ru,
      trail.description_en, trail.description_lv, trail.description_ru,
      trail.region, trail.difficulty, trail.distance, trail.duration, trail.elevation,
      trail.latitude, trail.longitude, trail.image_url, trail.features,
      trail.accessibility, trail.best_time_to_visit, trail.trail_condition,
      trail.parking_available, trail.guided_tours_available, trail.free_entry,
      trail.contact_phone, trail.contact_website
    ]);
  });
}

// API Routes

// File upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(row);
    }
  });
});

app.put('/api/users/:id', (req, res) => {
  const { name, email, location, country, bio, interests, avatar_url } = req.body;
  
  db.run(`
    UPDATE users 
    SET name = ?, email = ?, location = ?, country = ?, bio = ?, interests = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [name, email, location, country, bio, interests, avatar_url, req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'User updated successfully' });
    }
  });
});

// Trail routes
app.get('/api/trails', (req, res) => {
  db.all('SELECT * FROM trails ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Parse features JSON for each trail
      const trails = rows.map(trail => ({
        ...trail,
        features: trail.features ? JSON.parse(trail.features) : []
      }));
      res.json(trails);
    }
  });
});

app.post('/api/trails', (req, res) => {
  const trail = req.body;
  const id = uuidv4();
  
  db.run(`
    INSERT INTO trails (
      id, name_en, name_lv, name_ru, description_en, description_lv, description_ru,
      region, difficulty, distance, duration, elevation, latitude, longitude,
      image_url, features, accessibility, best_time_to_visit, trail_condition,
      parking_available, guided_tours_available, free_entry, adult_price, child_price,
      contact_phone, contact_email, contact_website
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    id, trail.name_en, trail.name_lv, trail.name_ru,
    trail.description_en, trail.description_lv, trail.description_ru,
    trail.region, trail.difficulty, trail.distance, trail.duration, trail.elevation,
    trail.latitude, trail.longitude, trail.image_url, JSON.stringify(trail.features || []),
    trail.accessibility, trail.best_time_to_visit, trail.trail_condition,
    trail.parking_available ? 1 : 0, trail.guided_tours_available ? 1 : 0, trail.free_entry ? 1 : 0,
    trail.adult_price || 0, trail.child_price || 0,
    trail.contact_phone, trail.contact_email, trail.contact_website
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id, message: 'Trail created successfully' });
    }
  });
});

app.put('/api/trails/:id', (req, res) => {
  const trail = req.body;
  
  db.run(`
    UPDATE trails SET
      name_en = ?, name_lv = ?, name_ru = ?, description_en = ?, description_lv = ?, description_ru = ?,
      region = ?, difficulty = ?, distance = ?, duration = ?, elevation = ?, latitude = ?, longitude = ?,
      image_url = ?, features = ?, accessibility = ?, best_time_to_visit = ?, trail_condition = ?,
      parking_available = ?, guided_tours_available = ?, free_entry = ?, adult_price = ?, child_price = ?,
      contact_phone = ?, contact_email = ?, contact_website = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    trail.name_en, trail.name_lv, trail.name_ru,
    trail.description_en, trail.description_lv, trail.description_ru,
    trail.region, trail.difficulty, trail.distance, trail.duration, trail.elevation,
    trail.latitude, trail.longitude, trail.image_url, JSON.stringify(trail.features || []),
    trail.accessibility, trail.best_time_to_visit, trail.trail_condition,
    trail.parking_available ? 1 : 0, trail.guided_tours_available ? 1 : 0, trail.free_entry ? 1 : 0,
    trail.adult_price || 0, trail.child_price || 0,
    trail.contact_phone, trail.contact_email, trail.contact_website, req.params.id
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Trail updated successfully' });
    }
  });
});

app.delete('/api/trails/:id', (req, res) => {
  db.run('DELETE FROM trails WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: 'Trail deleted successfully' });
    }
  });
});

// Community posts routes
app.get('/api/community-posts', (req, res) => {
  db.all(`
    SELECT cp.*, u.name as user_name, u.avatar_url as user_avatar,
           (SELECT COUNT(*) FROM post_likes WHERE post_id = cp.id) as likes_count
    FROM community_posts cp
    JOIN users u ON cp.user_id = u.id
    ORDER BY cp.created_at DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/community-posts', (req, res) => {
  const { user_id, type, content, image_url, location } = req.body;
  const id = uuidv4();
  
  db.run(`
    INSERT INTO community_posts (id, user_id, type, content, image_url, location)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, user_id, type, content, image_url, location], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ id, message: 'Post created successfully' });
    }
  });
});

// Statistics endpoint
app.get('/api/stats', (req, res) => {
  const stats = {};
  
  // Get user count
  db.get('SELECT COUNT(*) as count FROM users', (err, userCount) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalUsers = userCount.count;
    
    // Get trail count
    db.get('SELECT COUNT(*) as count FROM trails', (err, trailCount) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.totalTrails = trailCount.count;
      
      // Get post count
      db.get('SELECT COUNT(*) as count FROM community_posts', (err, postCount) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.totalPosts = postCount.count;
        
        // Get online users (mock for now)
        stats.onlineUsers = Math.floor(Math.random() * 5) + 1;
        
        res.json(stats);
      });
    });
  });
});

// Authentication endpoint (simplified)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      // In production, verify password hash
      if (email === 'emalinovskis@me.com' && password === 'Millie1991') {
        res.json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            location: user.location,
            country: user.country,
            bio: user.bio,
            interests: user.interests,
            avatar: user.avatar_url,
            joinDate: user.created_at,
            stats: {
              trailsCompleted: user.stats_trails_completed,
              photosShared: user.stats_photos_shared,
              points: user.stats_points,
              level: user.stats_level
            },
            isAdmin: user.is_admin === 1
          }
        });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});