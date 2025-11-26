# 🔧 Fix Git Divergent Branches di VPS

## 🎯 Masalah

Saat `git pull` di VPS, muncul error:
```
fatal: Need to specify how to reconcile divergent branches.
```

Ini terjadi karena ada perubahan di VPS dan di GitHub yang berbeda.

---

## ✅ Solusi (Pilih Salah Satu)

### Opsi 1: Merge Strategy (RECOMMENDED untuk Production)

**Aman untuk production, tidak akan kehilangan perubahan lokal:**

```bash
# Di VPS
cd /var/www/alumni-site

# Set merge strategy
git config pull.rebase false

# Pull dengan merge
git pull origin main

# Jika ada conflict, resolve dulu, lalu:
git add .
git commit -m "Merge remote changes"
```

**Keuntungan:**
- ✅ Tidak kehilangan perubahan lokal
- ✅ Aman untuk production
- ✅ History tetap lengkap

---

### Opsi 2: Rebase Strategy

**Membuat history lebih linear, tapi bisa overwrite perubahan lokal:**

```bash
# Di VPS
cd /var/www/alumni-site

# Set rebase strategy
git config pull.rebase true

# Pull dengan rebase
git pull origin main

# Jika ada conflict, resolve dulu, lalu:
git add .
git rebase --continue
```

**Catatan:**
- ⚠️ Bisa overwrite perubahan lokal
- ⚠️ Hanya gunakan jika yakin tidak ada perubahan penting di VPS

---

### Opsi 3: Force Pull (HATI-HATI!)

**Overwrite semua perubahan lokal dengan versi dari GitHub:**

```bash
# Di VPS
cd /var/www/alumni-site

# Backup perubahan lokal dulu (jika ada yang penting)
git stash

# Force pull (overwrite local dengan remote)
git fetch origin
git reset --hard origin/main

# Atau lebih aman, backup dulu:
cp -r . ../alumni-site-backup-$(date +%Y%m%d_%H%M%S)
git fetch origin
git reset --hard origin/main
```

**PERINGATAN:**
- ⚠️ **Akan menghapus semua perubahan lokal di VPS**
- ⚠️ Hanya gunakan jika yakin tidak ada perubahan penting di VPS
- ✅ Backup dulu sebelum force pull

---

## 🔍 Cek Perubahan Lokal Sebelum Pull

Sebelum memutuskan strategy, cek dulu apa yang berbeda:

```bash
# Di VPS
cd /var/www/alumni-site

# Cek status
git status

# Cek perubahan lokal
git diff

# Cek file yang berbeda
git diff --name-only

# Cek commit yang berbeda
git log HEAD..origin/main --oneline  # Commits di remote yang belum di local
git log origin/main..HEAD --oneline  # Commits di local yang belum di remote
```

---

## 🎯 Recommended Workflow untuk Production

### Step 1: Cek Perubahan

```bash
cd /var/www/alumni-site
git status
git diff --name-only
```

### Step 2: Backup (Jika Ada Perubahan Penting)

```bash
# Backup folder (jika ada perubahan yang perlu disimpan)
cp -r . ../alumni-site-backup-$(date +%Y%m%d_%H%M%S)
```

### Step 3: Stash Perubahan Lokal (Jika Ada)

```bash
# Simpan perubahan lokal sementara
git stash

# Lihat apa yang di-stash
git stash list
```

### Step 4: Pull dengan Merge

```bash
# Set merge strategy
git config pull.rebase false

# Pull
git pull origin main
```

### Step 5: Restore Perubahan Lokal (Jika Perlu)

```bash
# Jika ada perubahan yang perlu di-restore
git stash pop
```

---

## 🚨 Jika Ada Conflict

Jika muncul conflict saat merge:

```bash
# Git akan menunjukkan file yang conflict
# Edit file tersebut, cari tanda:
# <<<<<<< HEAD
# (perubahan lokal)
# =======
# (perubahan dari remote)
# >>>>>>> origin/main

# Setelah resolve conflict:
git add .
git commit -m "Resolve merge conflict"
```

---

## 💡 Untuk Kasus Ini (Upload Script)

Karena tujuan kita adalah upload script dari GitHub ke VPS, dan kemungkinan tidak ada perubahan penting di VPS:

### Quick Fix:

```bash
# Di VPS
cd /var/www/alumni-site

# Set merge strategy (default)
git config pull.rebase false

# Pull
git pull origin main
```

**Jika masih error atau ada conflict:**
```bash
# Backup dulu (safety first!)
cp -r . ../alumni-site-backup-$(date +%Y%m%d_%H%M%S)

# Force pull (overwrite dengan versi GitHub)
git fetch origin
git reset --hard origin/main

# Set permissions untuk script
chmod +x scripts/*.sh
```

---

## 📋 Checklist

- [ ] Cek `git status` untuk lihat perubahan lokal
- [ ] Backup jika ada perubahan penting
- [ ] Set pull strategy (`git config pull.rebase false`)
- [ ] Pull dari GitHub (`git pull origin main`)
- [ ] Resolve conflict jika ada
- [ ] Set permissions script (`chmod +x scripts/*.sh`)
- [ ] Test script (`bash scripts/diagnose-deployment.sh`)

---

## 🔍 Troubleshooting

### Issue: "Your local changes would be overwritten by merge"

**Fix:**
```bash
# Stash perubahan lokal
git stash

# Pull
git pull origin main

# Restore jika perlu
git stash pop
```

### Issue: "Merge conflict in file X"

**Fix:**
1. Edit file yang conflict
2. Hapus marker conflict (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Pilih perubahan yang benar (atau gabungkan)
4. `git add .`
5. `git commit -m "Resolve conflict"`

### Issue: "Permission denied" setelah pull

**Fix:**
```bash
# Set permissions
chmod +x scripts/*.sh
chmod -R 775 storage bootstrap/cache
```

---

## ✅ Quick Command (Copy-Paste)

```bash
# Di VPS - Quick fix untuk pull script
cd /var/www/alumni-site
git config pull.rebase false
git pull origin main
chmod +x scripts/*.sh
bash scripts/diagnose-deployment.sh
```

Jika masih error:
```bash
# Force pull (backup dulu!)
cp -r . ../alumni-site-backup-$(date +%Y%m%d_%H%M%S)
git fetch origin
git reset --hard origin/main
chmod +x scripts/*.sh
```

