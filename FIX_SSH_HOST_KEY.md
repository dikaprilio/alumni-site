# 🔧 Fix SSH Host Key Verification Failed

## 🎯 Masalah

Error:
```
WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!
Host key for 72.61.209.8 has changed
Host key verification failed.
```

**Penyebab:**
- Host key di server berubah (umum di hPanel/Hostinger setelah reinstall atau IP change)
- SSH client (Windows) masih menyimpan host key lama
- SSH strict checking menolak koneksi karena key tidak match

---

## ✅ Solusi Cepat

### Opsi 1: Remove Old Host Key (RECOMMENDED)

**Windows PowerShell:**
```powershell
# Hapus host key lama dari known_hosts
ssh-keygen -R 72.61.209.8

# Atau hapus manual dari file
notepad C:\Users\MSI\.ssh\known_hosts
# Hapus baris yang mengandung 72.61.209.8 (baris 4)
```

**Setelah itu, coba SSH lagi:**
```powershell
ssh user@72.61.209.8
# Akan muncul prompt untuk accept new host key, ketik: yes
```

---

### Opsi 2: Edit known_hosts Manual

**Step 1: Buka known_hosts file**

```powershell
notepad C:\Users\MSI\.ssh\known_hosts
```

**Step 2: Hapus baris yang mengandung IP 72.61.209.8**

Cari baris yang seperti ini:
```
72.61.209.8 ecdsa-sha2-nistp256 AAAAB3NzaC1yc2EAAAADAQABAAABAQ...
```

Hapus baris tersebut, save file.

**Step 3: Coba SSH lagi**

```powershell
ssh user@72.61.209.8
# Ketik "yes" saat diminta accept new host key
```

---

### Opsi 3: Disable Strict Host Key Checking (TIDAK DISARANKAN)

**Hanya untuk development/testing, tidak untuk production!**

```powershell
# Edit SSH config
notepad C:\Users\MSI\.ssh\config
```

Tambahkan:
```
Host 72.61.209.8
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

**⚠️ PERINGATAN:** Ini mengurangi keamanan, hanya gunakan jika yakin server aman!

---

## 🔍 Verifikasi Host Key

Setelah fix, verifikasi host key:

```powershell
# SSH ke server
ssh user@72.61.209.8

# Akan muncul prompt:
# The authenticity of host '72.61.209.8 (72.61.209.8)' can't be established.
# ED25519 key fingerprint is SHA256:bKW+TNN2OQqHqH3hlYf5B+Kh5Iw47oUWGwJteYUISNM.
# Are you sure you want to continue connecting (yes/no/[fingerprint])? yes

# Ketik: yes
```

**Fingerprint yang muncul harus match dengan yang di hPanel:**
- Login ke hPanel
- Cek server details
- Bandingkan fingerprint

---

## 🎯 Untuk Git Remote

Setelah fix SSH, Git remote akan bekerja:

```powershell
# Test SSH connection
ssh user@72.61.209.8

# Setelah berhasil, coba Git remote lagi
git remote add server ssh://user@72.61.209.8/var/www/alumni-site
git fetch server main
```

---

## 📋 Step-by-Step (Copy-Paste)

```powershell
# 1. Remove old host key
ssh-keygen -R 72.61.209.8

# 2. Test SSH connection
ssh user@72.61.209.8
# Ketik "yes" saat diminta

# 3. Setelah SSH berhasil, test Git remote
cd d:\laragon\www\alumni-site
git remote add server ssh://user@72.61.209.8/var/www/alumni-site
git fetch server main
```

---

## 🚨 Jika Masih Error

### Issue: "Permission denied (publickey)"

**Fix:**
```powershell
# Pastikan SSH key sudah di-setup
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# Copy public key ke server
type C:\Users\MSI\.ssh\id_rsa.pub | ssh user@72.61.209.8 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Issue: "Connection refused"

**Fix:**
- Cek apakah SSH service aktif di server
- Cek firewall settings di hPanel
- Cek port SSH (default 22)

### Issue: "Host key verification failed" masih muncul

**Fix:**
```powershell
# Hapus semua entry untuk IP tersebut
ssh-keygen -R 72.61.209.8

# Hapus manual dari known_hosts jika perlu
notepad C:\Users\MSI\.ssh\known_hosts
# Hapus semua baris yang mengandung 72.61.209.8
```

---

## 💡 Tips

1. **Selalu accept host key yang baru** setelah server reinstall
2. **Verifikasi fingerprint** dengan hPanel untuk memastikan aman
3. **Jangan disable strict checking** kecuali untuk testing
4. **Backup known_hosts** sebelum edit manual

---

## ✅ Quick Fix (One-Liner)

```powershell
ssh-keygen -R 72.61.209.8; ssh user@72.61.209.8
# Ketik "yes" saat diminta
```

---

## 📞 Need Help?

Jika masih error:
1. Cek SSH key di hPanel
2. Cek firewall settings
3. Cek SSH service status di server
4. Contact Hostinger support jika perlu

