# 🔐 Fix GitHub Authentication

## 🎯 Masalah

Error:
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
```

**Penyebab:**
- GitHub tidak lagi support password authentication (sejak Agustus 2021)
- Harus menggunakan **Personal Access Token (PAT)** atau **SSH key**

---

## ✅ Solusi: Gunakan Personal Access Token (PAT)

### Step 1: Buat Personal Access Token di GitHub

1. **Login ke GitHub** → https://github.com
2. **Klik profile** (kanan atas) → **Settings**
3. **Scroll down** → **Developer settings** (di sidebar kiri)
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token** → **Generate new token (classic)**
6. **Note**: Isi dengan nama token (misal: "VPS Deployment")
7. **Expiration**: Pilih durasi (misal: 90 days atau No expiration)
8. **Select scopes**: Centang **`repo`** (full control of private repositories)
9. **Generate token**
10. **COPY TOKEN** (hanya muncul sekali, simpan dengan aman!)

### Step 2: Gunakan Token sebagai Password

**Di Server (SSH Terminal):**

```bash
cd /var/www/alumni-site

# Push dengan token
git push origin main
# Username: dikaprilio
# Password: [PASTE TOKEN DI SINI - bukan password GitHub!]
```

**Atau lebih baik, simpan token di Git credential:**

```bash
# Simpan credential (akan diminta username dan password/token)
git config --global credential.helper store

# Atau untuk repo ini saja
git config credential.helper store

# Push sekali dengan token, akan tersimpan
git push origin main
# Username: dikaprilio
# Password: [PASTE TOKEN]
```

---

## 🔄 Alternatif: Ubah Remote ke SSH (Lebih Aman)

### Step 1: Generate SSH Key di Server

**Di Server (SSH Terminal):**

```bash
# Generate SSH key (jika belum ada)
ssh-keygen -t ed25519 -C "your_email@example.com"
# Tekan Enter untuk default location
# Tekan Enter untuk no passphrase (atau isi passphrase jika mau lebih aman)

# Tampilkan public key
cat ~/.ssh/id_ed25519.pub
# COPY output ini!
```

### Step 2: Add SSH Key ke GitHub

1. **Login ke GitHub** → https://github.com
2. **Settings** → **SSH and GPG keys**
3. **New SSH key**
4. **Title**: Isi dengan nama (misal: "VPS Server")
5. **Key**: Paste public key yang sudah di-copy
6. **Add SSH key**

### Step 3: Ubah Remote URL ke SSH

**Di Server:**

```bash
cd /var/www/alumni-site

# Ubah remote URL dari HTTPS ke SSH
git remote set-url origin git@github.com:dikaprilio/alumni-site.git

# Test connection
ssh -T git@github.com
# Akan muncul: "Hi dikaprilio! You've successfully authenticated..."

# Push
git push origin main
```

---

## 🎯 Recommended: Personal Access Token (PAT)

**Kenapa PAT lebih mudah:**
- ✅ Setup cepat (5 menit)
- ✅ Tidak perlu generate SSH key
- ✅ Bisa di-revoke kapan saja
- ✅ Bisa set expiration

**Langkah:**

1. **Buat PAT di GitHub** (lihat Step 1 di atas)
2. **Simpan di Git credential:**

```bash
# Di Server
cd /var/www/alumni-site
git config credential.helper store
git push origin main
# Username: dikaprilio
# Password: [PASTE TOKEN]
```

**Token akan tersimpan di `~/.git-credentials`**

---

## 📋 Quick Setup (Copy-Paste)

### Opsi A: Personal Access Token (RECOMMENDED)

**1. Buat PAT di GitHub:**
- Settings → Developer settings → Personal access tokens → Generate new token
- Select scope: `repo`
- Copy token

**2. Di Server:**
```bash
cd /var/www/alumni-site
git config credential.helper store
git push origin main
# Username: dikaprilio
# Password: [PASTE TOKEN DI SINI]
```

### Opsi B: SSH Key

**1. Generate SSH key di Server:**
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/id_ed25519.pub
# COPY output
```

**2. Add ke GitHub:**
- Settings → SSH and GPG keys → New SSH key
- Paste public key

**3. Ubah remote:**
```bash
cd /var/www/alumni-site
git remote set-url origin git@github.com:dikaprilio/alumni-site.git
git push origin main
```

---

## 🔒 Security Tips

1. **Jangan commit token ke Git**
   - Token hanya untuk authentication
   - Jangan hardcode di code

2. **Set expiration untuk token**
   - Jangan set "No expiration" kecuali benar-benar perlu
   - Set 90 days atau 1 year

3. **Revoke token jika tidak digunakan**
   - Settings → Developer settings → Personal access tokens
   - Klik token → Delete

4. **Gunakan SSH key untuk production**
   - Lebih aman daripada token
   - Tidak perlu input password setiap push

---

## 🆘 Troubleshooting

### Issue: "Permission denied (publickey)"

**Fix:**
```bash
# Test SSH connection
ssh -T git@github.com

# Jika error, pastikan SSH key sudah di-add ke GitHub
cat ~/.ssh/id_ed25519.pub
# Copy dan add ke GitHub
```

### Issue: "Token expired"

**Fix:**
- Buat token baru di GitHub
- Update credential:
  ```bash
  git config --unset credential.helper
  git config credential.helper store
  git push origin main
  # Input token baru
  ```

### Issue: "Repository not found"

**Fix:**
- Pastikan token/SSH key punya akses ke repo
- Cek repository visibility (public/private)
- Pastikan username benar: `dikaprilio`

---

## ✅ Recommended Workflow

**Untuk production server, gunakan SSH key:**

1. Generate SSH key di server
2. Add ke GitHub
3. Ubah remote ke SSH
4. Push tanpa perlu input password

**Untuk development, bisa pakai PAT:**

1. Buat PAT di GitHub
2. Simpan di Git credential
3. Push dengan token

---

**Pilih salah satu metode di atas. PAT lebih cepat, SSH key lebih aman untuk production!** 🔐

