# 📥 Pull Code dari Server ke Local

## 🎯 Situasi

- Server (VPS) punya code yang lebih lengkap
- Local repo sudah di-rollback, jadi fiturnya lebih sedikit
- Ingin sync local dengan server (reverse sync)

---

## ⚠️ PERINGATAN PENTING

**Sebelum pull dari server, BACKUP dulu!**

1. **Backup local repo** (jika ada perubahan penting)
2. **Commit atau stash** perubahan local yang belum di-commit
3. **Buat branch backup** untuk jaga-jaga

---

## 🚀 Cara Pull dari Server ke Local

### Opsi 1: Via Git (RECOMMENDED)

#### Step 1: Backup Local Repo

```bash
# Di local (Windows)
cd d:\laragon\www\alumni-site

# Buat branch backup
git checkout -b backup-before-pull-$(date +%Y%m%d)

# Commit atau stash perubahan yang belum di-commit
git add .
git commit -m "Backup before pulling from server"
# Atau
git stash
```

#### Step 2: Tambahkan Server sebagai Remote

```bash
# Tambahkan server sebagai remote (jika belum ada)
git remote add server ssh://user@your-vps-ip/var/www/alumni-site

# Atau jika sudah ada, cek remote
git remote -v
```

#### Step 3: Fetch dari Server

```bash
# Fetch code dari server
git fetch server main

# Lihat apa yang berbeda
git log HEAD..server/main --oneline
```

#### Step 4: Merge atau Rebase

**Opsi A: Merge (Aman, Recommended)**
```bash
# Merge code dari server ke local
git merge server/main --no-edit

# Jika ada conflict, resolve dulu:
# 1. Edit file yang conflict
# 2. git add .
# 3. git commit
```

**Opsi B: Rebase (History lebih clean)**
```bash
# Rebase code dari server ke local
git rebase server/main

# Jika ada conflict, resolve dulu:
# 1. Edit file yang conflict
# 2. git add .
# 3. git rebase --continue
```

---

### Opsi 2: Via SCP (Direct Copy)

Jika Git terlalu kompleks, bisa copy langsung:

#### Step 1: Backup Local

```bash
# Di local
cd d:\laragon\www\alumni-site
# Buat backup folder
xcopy . ..\alumni-site-backup-$(Get-Date -Format "yyyyMMdd_HHmmss") /E /I
```

#### Step 2: Copy dari Server ke Local

**Windows PowerShell:**
```powershell
# Copy seluruh folder (HATI-HATI: akan overwrite!)
scp -r user@your-vps-ip:/var/www/alumni-site/* d:\laragon\www\alumni-site\

# Atau copy file tertentu saja (lebih aman)
scp -r user@your-vps-ip:/var/www/alumni-site/app d:\laragon\www\alumni-site\
scp -r user@your-vps-ip:/var/www/alumni-site/resources d:\laragon\www\alumni-site\
scp -r user@your-vps-ip:/var/www/alumni-site/routes d:\laragon\www\alumni-site\
```

**Via WinSCP (GUI):**
1. Connect ke server
2. Navigate ke `/var/www/alumni-site`
3. Select folder/file yang ingin di-copy
4. Drag & drop ke local folder

---

### Opsi 3: Via Git Patch (Selective)

Jika hanya ingin beberapa file tertentu:

#### Step 1: Buat Patch di Server

```bash
# Di server (via SSH)
cd /var/www/alumni-site
git diff HEAD origin/main > /tmp/changes.patch
# Atau untuk file tertentu
git diff HEAD origin/main -- app/Http/Controllers/ > /tmp/controllers.patch
```

#### Step 2: Download Patch ke Local

```bash
# Di local (Windows PowerShell)
scp user@your-vps-ip:/tmp/changes.patch d:\laragon\www\alumni-site\
```

#### Step 3: Apply Patch di Local

```bash
# Di local
cd d:\laragon\www\alumni-site
git apply changes.patch
# Atau jika ada conflict
git apply --3way changes.patch
```

---

## 🔍 Identifikasi Perbedaan

Sebelum pull, cek dulu apa yang berbeda:

### Di Server (via SSH):

```bash
cd /var/www/alumni-site
git status
git log --oneline -10
git diff HEAD origin/main --name-only
```

### Di Local:

```bash
cd d:\laragon\www\alumni-site
git fetch origin
git log HEAD..origin/main --oneline
git diff HEAD origin/main --name-only
```

---

## ✅ Recommended Workflow

### Step 1: Backup & Prepare

```bash
# Di local
cd d:\laragon\www\alumni-site

# Buat branch backup
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup before pulling from server"
git checkout main
```

### Step 2: Fetch dari Server

```bash
# Tambahkan server sebagai remote (jika belum)
git remote add server ssh://user@your-vps-ip/var/www/alumni-site

# Fetch
git fetch server main
```

### Step 3: Merge dengan Hati-Hati

```bash
# Lihat perbedaan dulu
git log HEAD..server/main --oneline
git diff HEAD server/main --stat

# Merge
git merge server/main --no-edit

# Jika ada conflict, resolve:
# 1. Buka file yang conflict
# 2. Pilih perubahan yang benar (atau gabungkan)
# 3. git add .
# 4. git commit
```

### Step 4: Test & Verify

```bash
# Test di local
php artisan serve
npm run dev

# Cek apakah fitur-fitur yang di server sudah ada
```

### Step 5: Push ke GitHub

```bash
# Setelah merge dan test, push ke GitHub
git push origin main
```

---

## 🚨 Handling Conflicts

Jika ada conflict saat merge:

### 1. Lihat File yang Conflict

```bash
git status
# Akan muncul file dengan "both modified"
```

### 2. Edit File yang Conflict

Buka file, cari marker:
```
<<<<<<< HEAD
(perubahan di local)
=======
(perubahan di server)
>>>>>>> server/main
```

### 3. Resolve Conflict

Pilih salah satu:
- **Keep local**: Hapus marker, keep perubahan local
- **Keep server**: Hapus marker, keep perubahan server
- **Merge both**: Gabungkan kedua perubahan

### 4. Commit

```bash
git add .
git commit -m "Merge changes from server"
```

---

## 💡 Tips & Best Practices

### 1. **Selalu Backup Sebelum Pull**

```bash
# Buat backup folder
xcopy . ..\alumni-site-backup /E /I
```

### 2. **Gunakan Branch untuk Testing**

```bash
# Buat branch baru untuk merge
git checkout -b merge-from-server
git merge server/main

# Test di branch ini dulu
# Jika OK, merge ke main
git checkout main
git merge merge-from-server
```

### 3. **Selective Merge (File Tertentu)**

Jika hanya ingin beberapa file:

```bash
# Checkout file tertentu dari server
git checkout server/main -- app/Http/Controllers/AdminNewsController.php
git add app/Http/Controllers/AdminNewsController.php
git commit -m "Update AdminNewsController from server"
```

### 4. **Compare Before Merge**

```bash
# Lihat perbedaan detail
git diff HEAD server/main

# Lihat file yang berbeda
git diff HEAD server/main --name-only

# Lihat commit yang berbeda
git log HEAD..server/main --oneline
```

---

## 🔄 Alternative: Sync via GitHub

Jika lebih mudah, bisa push dari server ke GitHub dulu:

### Di Server:

```bash
cd /var/www/alumni-site
git add .
git commit -m "Sync from server - latest features"
git push origin main
```

### Di Local:

```bash
cd d:\laragon\www\alumni-site
git pull origin main
```

**Keuntungan:**
- ✅ Lebih mudah (standard workflow)
- ✅ Code ter-track di GitHub
- ✅ Bisa review perubahan dulu

---

## 📋 Checklist

- [ ] Backup local repo
- [ ] Commit atau stash perubahan local
- [ ] Fetch code dari server
- [ ] Review perbedaan (git diff, git log)
- [ ] Merge dengan hati-hati
- [ ] Resolve conflicts (jika ada)
- [ ] Test di local
- [ ] Push ke GitHub (jika perlu)

---

## 🆘 Troubleshooting

### Issue: "Refusing to merge unrelated histories"

**Fix:**
```bash
git merge server/main --allow-unrelated-histories
```

### Issue: "Too many conflicts"

**Fix:**
- Gunakan selective merge (file tertentu saja)
- Atau gunakan `git checkout server/main -- <file>` untuk file tertentu

### Issue: "Lost changes after merge"

**Fix:**
- Cek backup branch
- `git checkout backup-YYYYMMDD -- <file>`

---

## ✅ Quick Command (Copy-Paste)

```bash
# Di local - Quick sync dari server
cd d:\laragon\www\alumni-site

# Backup
git checkout -b backup-$(Get-Date -Format "yyyyMMdd")
git add .
git commit -m "Backup"
git checkout main

# Fetch dari server
git remote add server ssh://user@your-vps-ip/var/www/alumni-site
git fetch server main

# Merge
git merge server/main --no-edit

# Test & push
git push origin main
```

---

**PENTING:** Selalu backup dulu sebelum pull dari server! 🛡️

