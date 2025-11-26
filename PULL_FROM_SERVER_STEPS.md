# 📥 Step-by-Step: Pull dari Server ke Local

## ✅ Status: SSH Connection Berhasil!

Sekarang kita bisa pull code dari server.

---

## 🎯 Opsi 1: Via GitHub (RECOMMENDED - Paling Mudah)

### Step 1: Di Server - Push ke GitHub

**Di terminal SSH yang sudah terbuka:**

```bash
# Masuk ke folder project
cd /var/www/alumni-site

# Cek status Git
git status

# Commit perubahan (jika ada)
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

### Step 2: Di Local - Pull dari GitHub

**Di PowerShell (Windows):**

```bash
# Masuk ke folder project
cd d:\laragon\www\alumni-site

# Backup dulu!
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup before pull"
git checkout main

# Pull dari GitHub
git pull origin main
```

**Done!** ✅ Fitur dari server sudah ada di local.

---

## 🎯 Opsi 2: Direct Pull dari Server (Tanpa GitHub)

### Step 1: Di Server - Setup Git Remote

**Di terminal SSH:**

```bash
cd /var/www/alumni-site

# Cek remote yang ada
git remote -v

# Jika belum ada remote, tambahkan GitHub
git remote add origin https://github.com/dikaprilio/alumni-site.git
# Atau jika sudah ada, skip step ini
```

### Step 2: Di Local - Tambahkan Server sebagai Remote

**Di PowerShell:**

```bash
cd d:\laragon\www\alumni-site

# Backup dulu!
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup before pull"
git checkout main

# Tambahkan server sebagai remote
git remote add server ssh://root@72.61.209.8/var/www/alumni-site

# Fetch dari server
git fetch server main

# Lihat perbedaan
git log HEAD..server/main --oneline

# Merge
git merge server/main --no-edit
```

**Jika ada conflict:**
1. Edit file yang conflict
2. `git add .`
3. `git commit -m "Resolve merge conflict"`

---

## 🔍 Cek Perbedaan Sebelum Merge

**Di Local (PowerShell):**

```bash
# Fetch dulu
git fetch server main

# Lihat commit yang berbeda
git log HEAD..server/main --oneline

# Lihat file yang berbeda
git diff HEAD server/main --name-only

# Lihat perbedaan detail (optional)
git diff HEAD server/main
```

---

## ✅ Recommended: Via GitHub (Opsi 1)

**Kenapa via GitHub lebih baik:**
- ✅ Lebih aman (code ter-track)
- ✅ Bisa review perubahan dulu
- ✅ Standard workflow
- ✅ Mudah di-rollback

**Langkah:**

**Di Server (SSH):**
```bash
cd /var/www/alumni-site
git add .
git commit -m "Sync latest features from server"
git push origin main
```

**Di Local (PowerShell):**
```bash
cd d:\laragon\www\alumni-site
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup"
git checkout main
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

## 📋 Checklist

- [x] SSH connection berhasil ✅
- [ ] Backup local repo
- [ ] Commit perubahan di server (jika ada)
- [ ] Push dari server ke GitHub (Opsi 1) atau fetch dari server (Opsi 2)
- [ ] Pull di local
- [ ] Resolve conflict (jika ada)
- [ ] Test di local

---

## 🎯 Quick Command (Copy-Paste)

### Via GitHub (RECOMMENDED):

**Di Server (SSH):**
```bash
cd /var/www/alumni-site
git add .
git commit -m "Sync latest features from server"
git push origin main
```

**Di Local (PowerShell):**
```bash
cd d:\laragon\www\alumni-site
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup"
git checkout main
git pull origin main
```

---

## 💡 Tips

1. **Selalu backup sebelum pull**
2. **Review perbedaan dulu** sebelum merge
3. **Test setelah merge** untuk memastikan tidak ada yang rusak
4. **Commit perubahan di server** sebelum push

---

**Pilih Opsi 1 (via GitHub) untuk yang paling mudah dan aman!** ✅

