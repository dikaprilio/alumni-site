# 🔐 SSH Access Information

## 📋 Server Details

- **Host**: `72.61.209.8`
- **User**: `root`
- **Command**: `ssh root@72.61.209.8`
- **Location**: `/var/www/alumni-site`

---

## 🚀 Quick Commands

### Connect to Server

```bash
ssh root@72.61.209.8
# Enter password when prompted
```

### Navigate to Project

```bash
# After SSH connection
cd /var/www/alumni-site
```

### Common Git Operations

```bash
# Check status
git status

# Commit changes
git add .
git commit -m "Your commit message"

# Push to GitHub (requires PAT or SSH key)
git push origin main
```

---

## 🔑 Authentication Setup

### Option 1: Personal Access Token (PAT)

1. Create PAT at GitHub: Settings → Developer settings → Personal access tokens
2. In server:
   ```bash
   git config credential.helper store
   git push origin main
   # Username: dikaprilio
   # Password: [PASTE TOKEN]
   ```

### Option 2: SSH Key (Recommended for Production)

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Show public key
cat ~/.ssh/id_ed25519.pub
# Add to GitHub: Settings → SSH and GPG keys

# Change remote to SSH
git remote set-url origin git@github.com:dikaprilio/alumni-site.git
```

---

## 📥 Pull Code from Server to Local

### Step 1: Push from Server to GitHub

```bash
# In server (SSH)
cd /var/www/alumni-site
git add .
git commit -m "Sync latest features from server"
git push origin main
```

### Step 2: Pull in Local

```bash
# In local (PowerShell)
cd d:\laragon\www\alumni-site
git pull origin main
```

---

## 🛠️ Useful Server Commands

### Check Git Status

```bash
cd /var/www/alumni-site
git status
git log --oneline -5
```

### Check Laravel

```bash
# Check Laravel version
php artisan --version

# Check migration status
php artisan migrate:status

# Clear cache
php artisan optimize:clear
```

### Check System

```bash
# Disk usage
df -h

# Memory usage
free -h

# System info
uname -a
```

---

## 🔒 Security Notes

1. **Root access**: Be careful with root access, use with caution
2. **SSH key**: More secure than password authentication
3. **Backup**: Always backup before making changes
4. **GitHub token**: Keep PAT secure, don't commit to Git

---

## 📞 Quick Reference

- **SSH**: `ssh root@72.61.209.8`
- **Project**: `/var/www/alumni-site`
- **GitHub**: `https://github.com/dikaprilio/alumni-site`
- **Remote**: `origin` (GitHub), `server` (SSH - if configured)

---

**Keep this information secure!** 🔐

