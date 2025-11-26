# 📥 Pull dari Server via GitHub (RECOMMENDED)

## 🎯 Cara Termudah: Push dari Server ke GitHub, lalu Pull di Local

Karena ada permission issue dengan Git SSH, kita gunakan cara via GitHub.

---

## ✅ Step-by-Step

### Step 1: Di Server (SSH Terminal)

**Di terminal SSH yang sudah terbuka:**

```bash
# Masuk ke folder project
cd /var/www/alumni-site

# Cek status
git status

# Commit semua perubahan (jika ada)
git add .
git commit -m "Sync latest features from server"

# Push ke GitHub
git push origin main
```

**Jika ada error "divergent branches":**
```bash
# Set merge strategy
git config pull.rebase false

# Pull dulu (jika perlu)
git pull origin main

# Push lagi
git push origin main
```

**Jika ada error "permission denied":**
- Pastikan GitHub credentials sudah di-setup di server
- Atau gunakan Personal Access Token

---

### Step 2: Di Local (PowerShell)

**Di PowerShell (Windows):**

```bash
# Masuk ke folder project
cd d:\laragon\www\alumni-site

# Backup dulu! (kamu sudah di branch backup, jadi OK)
# Tapi pastikan commit perubahan yang ada
git add .
git commit -m "Backup documentation files"

# Kembali ke main branch
git checkout main

# Pull dari GitHub
git pull origin main
```

**Done!** ✅ Fitur dari server sudah ada di local.

---

## 🔍 Cek Perbedaan Sebelum Pull

**Di Local:**

```bash
# Fetch dulu (tanpa merge)
git fetch origin main

# Lihat commit yang berbeda
git log HEAD..origin/main --oneline

# Lihat file yang berbeda
git diff HEAD origin/main --name-only

# Jika OK, pull
git pull origin main
```

---

## 🚨 Jika Ada Conflict

### Resolve Conflict:

1. **Lihat file yang conflict:**
   ```bash
   git status
   ```

2. **Edit file yang conflict:**
   - Buka file di editor
   - Cari marker: `<<<<<<<`, `=======`, `>>>>>>>`
   - Pilih perubahan yang benar (atau gabungkan)
   - Hapus marker conflict

3. **Commit:**
   ```bash
   git add .
   git commit -m "Resolve merge conflict"
   ```

---

## 📋 Quick Command (Copy-Paste)

### Di Server (SSH):
```bash
cd /var/www/alumni-site
git add .
git commit -m "Sync latest features from server"
git push origin main
```

### Di Local (PowerShell):
```bash
cd d:\laragon\www\alumni-site
git checkout main
git pull origin main
```

---

## 💡 Tips

1. **Selalu commit perubahan di server** sebelum push
2. **Backup local** sebelum pull (sudah dilakukan)
3. **Review perbedaan** sebelum merge
4. **Test setelah merge** untuk memastikan tidak ada yang rusak

---

**Ini cara termudah dan paling aman!** ✅

