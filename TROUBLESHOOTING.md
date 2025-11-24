# Troubleshooting Guide

## 500 Error on Admin API

### Symptoms
- POST request to `/api/admin/downloads/movie` returns 500 error
- Error message: "Error updating download links"

### Root Causes

#### 1. Firebase Admin SDK Not Initialized
**Check:**
```bash
node scripts/test-firebase-admin.js
```

**If it fails:**
- Verify `.env` file exists in project root
- Check `FIREBASE_SERVICE_ACCOUNT_KEY` is set correctly
- Ensure the JSON is properly formatted (no extra quotes)

#### 2. Invalid Service Account Key Format
The `.env` file should have:
```
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

NOT:
```
FIREBASE_SERVICE_ACCOUNT_KEY='\'{"type":"service_account",...}\''
```

**Fix:**
1. Open `.env` file
2. Find the `FIREBASE_SERVICE_ACCOUNT_KEY` line
3. Make sure it's a valid JSON string wrapped in single quotes
4. Remove any extra quotes or escaping

#### 3. Missing Environment Variables
**Check all these are set in `.env`:**
```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smovies-9d6d3
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
```

#### 4. Token Verification Failed
**Check:**
- Are you logged in? (Check browser console for token)
- Is the token valid? (Check Firebase Console > Authentication)
- Is the Authorization header being sent correctly?

### Solutions

#### Solution 1: Verify Firebase Admin Setup
```bash
# Test Firebase Admin initialization
node scripts/test-firebase-admin.js

# Expected output:
# ✅ Service account key parsed successfully
# ✅ Firebase Admin SDK initialized successfully
# ✅ Firestore instance created
# ✅ Firebase Auth instance created
```

#### Solution 2: Check Server Logs
Look at the terminal where `npm run dev` is running:
- Look for error messages starting with `❌`
- Check for "Failed to initialize Firebase Admin"
- Look for Firestore connection errors

#### Solution 3: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Clear cache
rm -rf .next

# Restart
npm run dev
```

#### Solution 4: Verify .env Format
The `FIREBASE_SERVICE_ACCOUNT_KEY` should be a single-line JSON string:

**Correct:**
```
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"smovies-9d6d3","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",...}'
```

**Incorrect (multi-line):**
```
FIREBASE_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  ...
}'
```

### Debugging Steps

1. **Check browser console** (F12)
   - Look for the actual error message
   - Check Network tab > admin/downloads/movie > Response

2. **Check server console**
   - Look for Firebase initialization errors
   - Look for Firestore errors
   - Look for authentication errors

3. **Verify authentication**
   - Open browser DevTools > Application > Local Storage
   - Look for `adminToken` key
   - If missing, you're not logged in

4. **Test API directly**
   ```bash
   # Get your token from browser console
   # Then test the API
   curl -X POST http://localhost:3000/api/admin/downloads/movie \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{"movieId":"550","title":"Fight Club","links":[{"quality":"720p","url":"https://example.com","size":"1.2GB"}]}'
   ```

## Common Error Messages

### "FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set"
- **Cause:** `.env` file missing or not loaded
- **Fix:** Create `.env` file with all Firebase credentials

### "Failed to initialize Firebase Admin"
- **Cause:** Invalid service account key format
- **Fix:** Check `.env` file format (see Solution 4 above)

### "Unauthorized"
- **Cause:** Token is missing or invalid
- **Fix:** 
  1. Login again at `/admin/login`
  2. Check token is stored in localStorage
  3. Verify token is being sent in Authorization header

### "Missing required fields: movieId, title, links"
- **Cause:** Form data not sent correctly
- **Fix:** 
  1. Fill in all required fields
  2. Add at least one download link with URL
  3. Check browser console for the actual request body

## Testing Checklist

- [ ] `.env` file exists in project root
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` is set
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` is set
- [ ] `npm run dev` shows no Firebase initialization errors
- [ ] Can login at `/admin/login`
- [ ] Token appears in browser localStorage
- [ ] Can fill and submit the form
- [ ] Movie data appears in Firestore

## Need More Help?

1. Run the test script: `node scripts/test-firebase-admin.js`
2. Check server console for errors
3. Check browser console (F12) for error details
4. Verify `.env` file format
5. Restart dev server: `npm run dev`
