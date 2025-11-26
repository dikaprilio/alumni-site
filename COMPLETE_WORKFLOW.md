# ✅ Complete Workflow: Pull from Server to Local

## 🎯 Current Status

- ✅ SSH access: `ssh root@72.61.209.8`
- ✅ Server has latest features
- ✅ Local repo is rolled back
- ⚠️ Need to setup GitHub authentication

---

## 🚀 Complete Steps

### Step 1: Setup GitHub Authentication (Server)

**Connect to server:**
```bash
ssh root@72.61.209.8
```

**Choose one method:**

#### Option A: Personal Access Token (Quick)

1. Create PAT at GitHub:
   - Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Select scope: `repo`
   - Copy token

2. In server:
   ```bash
   cd /var/www/alumni-site
   git config credential.helper store
   git push origin main
   # Username: dikaprilio
   # Password: [PASTE TOKEN]
   ```

#### Option B: SSH Key (Secure)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# Copy and add to GitHub: Settings → SSH and GPG keys

# Change remote
cd /var/www/alumni-site
git remote set-url origin git@github.com:dikaprilio/alumni-site.git
git push origin main
```

---

### Step 2: Push from Server to GitHub

**In server (after authentication setup):**

```bash
cd /var/www/alumni-site

# Check status
git status

# Commit changes
git add .
git commit -m "Sync latest features from server"

# Push to GitHub
git push origin main
```

---

### Step 3: Pull in Local

**In local (PowerShell):**

```bash
cd d:\laragon\www\alumni-site

# Backup (if needed)
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup"
git checkout main

# Pull from GitHub
git pull origin main
```

**Done!** ✅ Latest features from server are now in local.

---

## 🔍 Verify

### Check Differences (Before Pull)

```bash
# In local
git fetch origin main
git log HEAD..origin/main --oneline
git diff HEAD origin/main --name-only
```

### After Pull

```bash
# Check if features are there
git log --oneline -5
git status
```

---

## 🚨 Troubleshooting

### Issue: "Authentication failed"

**Fix**: Setup PAT or SSH key (see Step 1)

### Issue: "Divergent branches"

**Fix**:
```bash
git config pull.rebase false
git pull origin main
```

### Issue: "Merge conflict"

**Fix**:
1. Edit conflicted files
2. Remove conflict markers
3. `git add .`
4. `git commit`

---

## 📋 Checklist

- [ ] Setup GitHub authentication (PAT or SSH key)
- [ ] Push from server to GitHub
- [ ] Backup local repo
- [ ] Pull from GitHub to local
- [ ] Verify features are present
- [ ] Test application

---

## 🎯 Quick Command Summary

**Server:**
```bash
ssh root@72.61.209.8
cd /var/www/alumni-site
git add .
git commit -m "Sync latest features"
git push origin main
```

**Local:**
```bash
cd d:\laragon\www\alumni-site
git pull origin main
```

---

**Follow these steps in order!** ✅

