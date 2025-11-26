# ⚡ Quick Guide: Pull dari Server ke Local

## 🎯 Situasi
Server punya fitur lebih lengkap, local sudah di-rollback.

---

## ✅ Cara Termudah (RECOMMENDED)

### Step 1: Backup Local

```bash
# Di local
cd d:\laragon\www\alumni-site
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup before pull from server"
git checkout main
```

### Step 2: Push dari Server ke GitHub

**Di Server (via SSH):**
```bash
cd /var/www/alumni-site
git add .
git commit -m "Sync latest features from server"
git push origin main
```

### Step 3: Pull di Local

```bash
# Di local
cd d:\laragon\www\alumni-site
git pull origin main
```

**Done!** ✅

---

## 🔄 Alternatif: Direct Pull dari Server

### Step 1: Backup Local

```bash
cd d:\laragon\www\alumni-site
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup"
git checkout main
```

### Step 2: Tambahkan Server sebagai Remote

```bash
git remote add server ssh://user@your-vps-ip/var/www/alumni-site
```

### Step 3: Fetch & Merge

```bash
git fetch server main
git merge server/main --no-edit
```

**Jika ada conflict:**
1. Edit file yang conflict
2. `git add .`
3. `git commit`

---

## 🚨 PENTING

- ✅ **Backup dulu!** Jangan skip step backup
- ✅ **Commit perubahan local** sebelum merge
- ✅ **Test setelah merge** untuk memastikan tidak ada yang rusak

---

Lihat `PULL_FROM_SERVER.md` untuk panduan lengkap dengan troubleshooting.

