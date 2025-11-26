# ⚡ Quick Fix: GitHub Authentication

## 🎯 Error: Password authentication tidak didukung

GitHub tidak support password lagi. Harus pakai **Personal Access Token (PAT)**.

---

## ✅ Quick Fix (5 Menit)

### Step 1: Buat Token di GitHub

1. Login GitHub → **Settings** → **Developer settings**
2. **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. **Note**: "VPS Server"
5. **Expiration**: 90 days (atau No expiration)
6. **Select scopes**: Centang **`repo`**
7. **Generate token**
8. **COPY TOKEN** (simpan dengan aman!)

### Step 2: Gunakan Token di Server

**Di Server (SSH Terminal):**

```bash
cd /var/www/alumni-site

# Simpan credential
git config credential.helper store

# Push (akan diminta username dan password)
git push origin main
# Username: dikaprilio
# Password: [PASTE TOKEN DI SINI - bukan password GitHub!]
```

**Done!** Token akan tersimpan, tidak perlu input lagi.

---

## 🔄 Alternatif: SSH Key (Lebih Aman)

### Step 1: Generate SSH Key

```bash
# Di Server
ssh-keygen -t ed25519 -C "your_email@example.com"
# Tekan Enter 2x (default location, no passphrase)
cat ~/.ssh/id_ed25519.pub
# COPY output
```

### Step 2: Add ke GitHub

1. GitHub → **Settings** → **SSH and GPG keys**
2. **New SSH key**
3. Paste public key
4. **Add SSH key**

### Step 3: Ubah Remote

```bash
cd /var/www/alumni-site
git remote set-url origin git@github.com:dikaprilio/alumni-site.git
git push origin main
```

---

## 💡 Tips

- **PAT**: Lebih cepat setup, tapi perlu input token pertama kali
- **SSH Key**: Lebih aman, tidak perlu input password lagi
- **Untuk production**: Gunakan SSH key

---

**Pilih salah satu. PAT lebih cepat, SSH key lebih aman!** ✅

