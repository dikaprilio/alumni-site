# ⚡ Quick Guide: Upload Script ke VPS

## 🎯 Cara Termudah (RECOMMENDED)

### Step 1: Push ke Git (di Local/Windows)

```bash
# Di folder project
git add scripts/
git add *.md
git add .github/workflows/deploy.yml
git commit -m "Add deployment diagnostic and fix scripts"
git push origin main
```

### Step 2: Pull di VPS (via SSH)

```bash
# SSH ke VPS
ssh user@your-vps-ip

# Masuk ke folder project
cd /var/www/alumni-site

# Pull latest code
git pull origin main

# Set permissions
chmod +x scripts/*.sh

# Jalankan diagnostic
bash scripts/diagnose-deployment.sh
```

**Done!** Script sudah tersedia dan siap digunakan.

---

## 🔄 Alternatif: Upload Langsung (Tanpa Git)

### Via SCP (Windows PowerShell):

```powershell
# Upload folder scripts
scp -r scripts/ user@your-vps-ip:/var/www/alumni-site/
```

### Via WinSCP (GUI):

1. Download WinSCP: https://winscp.net/
2. Connect ke VPS
3. Drag & drop folder `scripts/` ke `/var/www/alumni-site/`
4. Set permissions di VPS: `chmod +x scripts/*.sh`

---

## ✅ Setelah Upload

```bash
# Di VPS
cd /var/www/alumni-site
chmod +x scripts/*.sh
bash scripts/diagnose-deployment.sh
```

---

Lihat `UPLOAD_SCRIPTS_TO_VPS.md` untuk panduan lengkap dengan troubleshooting.

