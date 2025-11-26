# 📤 Cara Upload Script ke VPS

Ada beberapa cara untuk upload script ke VPS. Pilih yang paling sesuai dengan setup Anda.

---

## 🎯 Opsi 1: Via Git (RECOMMENDED - Paling Mudah)

Karena project sudah menggunakan Git dan GitHub Actions, cara termudah adalah push ke repo lalu pull di VPS.

### Langkah:

1. **Commit dan push script ke Git:**
   ```bash
   # Di local (Windows)
   git add scripts/
   git add DEBUGGING_GUIDE.md QUICK_FIX.md SUMMARY.md
   git commit -m "Add deployment diagnostic and fix scripts"
   git push origin main
   ```

2. **Pull di VPS:**
   ```bash
   # SSH ke VPS
   ssh user@your-vps-ip
   
   # Masuk ke folder project
   cd /var/www/alumni-site
   
   # Pull latest code
   git pull origin main
   
   # Script sudah tersedia di scripts/
   ls -la scripts/
   ```

3. **Jalankan script:**
   ```bash
   bash scripts/diagnose-deployment.sh
   ```

**Keuntungan:**
- ✅ Paling mudah dan aman
- ✅ Script ter-track di Git
- ✅ Bisa di-reuse untuk deployment berikutnya
- ✅ Tidak perlu setup tambahan

---

## 🎯 Opsi 2: Via SCP (Direct Upload)

Jika ingin upload langsung tanpa Git, gunakan SCP.

### Windows (PowerShell):

```powershell
# Upload single file
scp scripts/diagnose-deployment.sh user@your-vps-ip:/var/www/alumni-site/scripts/

# Upload entire scripts folder
scp -r scripts/ user@your-vps-ip:/var/www/alumni-site/
```

### Windows (Command Prompt):

```cmd
# Upload single file
scp scripts\diagnose-deployment.sh user@your-vps-ip:/var/www/alumni-site/scripts/

# Upload entire scripts folder
scp -r scripts\ user@your-vps-ip:/var/www/alumni-site/
```

### Linux/Mac:

```bash
# Upload single file
scp scripts/diagnose-deployment.sh user@your-vps-ip:/var/www/alumni-site/scripts/

# Upload entire scripts folder
scp -r scripts/ user@your-vps-ip:/var/www/alumni-site/
```

**Catatan:**
- Ganti `user@your-vps-ip` dengan credentials SSH Anda
- Jika menggunakan key file: `scp -i /path/to/key.pem scripts/ user@vps:/var/www/alumni-site/`

---

## 🎯 Opsi 3: Via SFTP Client (GUI)

Jika lebih suka GUI, gunakan SFTP client seperti:

### Windows:
- **WinSCP** (Free): https://winscp.net/
- **FileZilla** (Free): https://filezilla-project.org/
- **PuTTY PSCP** (Command line)

### Mac:
- **Cyberduck** (Free): https://cyberduck.io/
- **FileZilla** (Free)

### Langkah dengan WinSCP:

1. Download dan install WinSCP
2. Connect ke VPS:
   - Host: `your-vps-ip`
   - Username: `your-username`
   - Password: `your-password` (atau use key file)
3. Navigate ke `/var/www/alumni-site/`
4. Buat folder `scripts/` jika belum ada
5. Drag & drop file dari local ke VPS
6. Set permissions (jika perlu):
   ```bash
   chmod +x scripts/*.sh
   ```

---

## 🎯 Opsi 4: Copy-Paste via SSH (Quick & Dirty)

Untuk script kecil, bisa copy-paste langsung via SSH.

### Langkah:

1. **SSH ke VPS:**
   ```bash
   ssh user@your-vps-ip
   cd /var/www/alumni-site
   ```

2. **Buat folder scripts:**
   ```bash
   mkdir -p scripts
   ```

3. **Buat file dan paste isinya:**
   ```bash
   nano scripts/diagnose-deployment.sh
   # Paste isi file, lalu Ctrl+X, Y, Enter untuk save
   ```

4. **Set permissions:**
   ```bash
   chmod +x scripts/*.sh
   ```

**Catatan:** 
- Tidak praktis untuk file besar
- Rentan typo saat copy-paste
- Hanya untuk quick fix

---

## 🎯 Opsi 5: Via GitHub Actions (Automated)

Jika ingin otomatis upload script saat push, bisa tambahkan step di workflow.

**Tidak direkomendasikan** karena:
- Script sudah ada di repo (Opsi 1 lebih baik)
- Menambah kompleksitas workflow
- Tidak perlu karena script bisa di-pull via Git

---

## ✅ Recommended Workflow

**Untuk kasus ini, gunakan Opsi 1 (Via Git):**

1. **Di local (Windows):**
   ```bash
   # Pastikan semua file sudah di-commit
   git status
   
   # Add files
   git add scripts/
   git add *.md
   git add .github/workflows/deploy.yml
   
   # Commit
   git commit -m "Add deployment diagnostic and fix scripts"
   
   # Push
   git push origin main
   ```

2. **Di VPS (via SSH):**
   ```bash
   ssh user@your-vps-ip
   cd /var/www/alumni-site
   git pull origin main
   
   # Verify scripts exist
   ls -la scripts/
   
   # Make executable (jika belum)
   chmod +x scripts/*.sh
   
   # Run diagnostic
   bash scripts/diagnose-deployment.sh
   ```

---

## 🔧 Troubleshooting

### Issue: "Permission denied" saat jalankan script

**Fix:**
```bash
chmod +x scripts/diagnose-deployment.sh
chmod +x scripts/fix-database-sync.sh
```

### Issue: "No such file or directory"

**Fix:**
```bash
# Pastikan di folder yang benar
cd /var/www/alumni-site

# Cek apakah file ada
ls -la scripts/

# Jika tidak ada, pull dari Git
git pull origin main
```

### Issue: "bash: scripts/diagnose-deployment.sh: /bin/bash^M: bad interpreter"

**Fix:** File memiliki Windows line endings (CRLF). Convert ke Unix (LF):
```bash
# Di VPS
sed -i 's/\r$//' scripts/diagnose-deployment.sh
sed -i 's/\r$//' scripts/fix-database-sync.sh
```

Atau di local sebelum push, set Git untuk auto-convert:
```bash
git config core.autocrlf true
```

### Issue: SCP "Permission denied"

**Fix:**
- Pastikan user punya write permission di `/var/www/alumni-site`
- Atau upload ke `/tmp/` lalu move:
  ```bash
  scp scripts/diagnose-deployment.sh user@vps:/tmp/
  ssh user@vps
  sudo mv /tmp/diagnose-deployment.sh /var/www/alumni-site/scripts/
  ```

---

## 📋 Checklist

- [ ] Script sudah di-commit ke Git
- [ ] Script sudah di-push ke GitHub
- [ ] SSH ke VPS berhasil
- [ ] Git pull di VPS berhasil
- [ ] Script ada di folder `scripts/`
- [ ] Script sudah executable (`chmod +x`)
- [ ] Script bisa dijalankan (`bash scripts/diagnose-deployment.sh`)

---

## 🚀 Quick Start (Recommended)

```bash
# 1. Di local - Commit & push
git add scripts/ *.md .github/workflows/deploy.yml
git commit -m "Add deployment scripts"
git push origin main

# 2. Di VPS - Pull & run
ssh user@your-vps-ip
cd /var/www/alumni-site
git pull origin main
chmod +x scripts/*.sh
bash scripts/diagnose-deployment.sh
```

---

## 💡 Tips

1. **Gunakan Git** - Paling aman dan ter-track
2. **Set executable permissions** - Jangan lupa `chmod +x`
3. **Test di local dulu** - Pastikan script tidak ada syntax error
4. **Backup dulu** - Sebelum jalankan fix script, backup database
5. **Monitor logs** - Setelah jalankan script, cek apakah ada error

---

## 📞 Need Help?

Jika masih ada masalah:
1. Cek SSH connection: `ssh user@vps-ip`
2. Cek Git access: `git pull origin main`
3. Cek file permissions: `ls -la scripts/`
4. Cek script syntax: `bash -n scripts/diagnose-deployment.sh`

