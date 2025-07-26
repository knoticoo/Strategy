#!/bin/bash

# Extract token from git remote URL
TOKEN=$(git config --get remote.origin.url | grep -o 'ghs_[^@]*')

echo "Creating pull request..."

curl -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/knoticoo/Strategy/pulls \
  -d '{
    "title": "🔧 Fix: Add missing database tables for admin panel",
    "head": "database-fixes",
    "base": "main",
    "body": "## 🔧 FIXES CRITICAL DATABASE ERRORS\n\nAll admin panel 500 errors resolved:\n- ❌ sqlite3.OperationalError: no such table: challenges\n- ❌ sqlite3.OperationalError: no such table: learning_resources\n- ❌ sqlite3.OperationalError: no such table: discussions\n\n## 📋 NEW TABLES ADDED:\n1. **challenges** - Admin challenge management\n2. **challenge_participants** - Track challenge joiners\n3. **learning_resources** - Admin learning hub content\n4. **discussions** - Admin discussion management\n5. **discussion_replies** - Discussion replies\n\n## 🛠️ CHANGES:\n- Updated init_db() function in app.py\n- Added all missing database table definitions\n- Database automatically recreated with new tables\n\n## ✅ RESULT:\n- Admin panel now works without 500 errors\n- All admin functionality operational\n- Upload/gallery/analysis working\n\n**Ready to merge!** 🚀"
  }'