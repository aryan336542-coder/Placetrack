# 🚀 PlaceTrack — Production Deployment Guide

This guide covers everything you need to deploy PlaceTrack to a **VPS / Cloud Server (Ubuntu, Debian, DigitalOcean, AWS EC2, Hetzner, etc.)** using a **Free Cloud MySQL Database**.

---

## 📋 Table of Contents
1. [Step 1: Set Up Free Cloud MySQL](#step-1-set-up-free-cloud-mysql)
2. [Step 2: Method A — Deploy with Docker (Recommended)](#step-2-method-a--deploy-with-docker-recommended)
3. [Step 3: Method B — Deploy with Node.js + PM2 + Nginx](#step-3-method-b--deploy-with-nodejs--pm2--nginx)
4. [Step 4: Enable Free HTTPS (SSL) with Let's Encrypt](#step-4-enable-free-https-ssl-with-lets-encrypt)
5. [Environment Variables Reference](#environment-variables-reference)

---

## Step 1: Set Up Free Cloud MySQL

You can use any cloud MySQL provider. Here are two top free recommendations (no credit card required):

### Option A: TiDB Cloud (Serverless MySQL — Recommended)
1. Go to [https://tidbcloud.com](https://tidbcloud.com) and create a free account.
2. Click **Create Cluster** and select **TiDB Serverless** (Free forever, 5 GB storage).
3. Once created, click **Connect**:
   - Choose **Connect with: General / MySQL CLI**.
   - Note down:
     - `DB_HOST`: (e.g. `gateway01.ap-southeast-1.prod.aws.tidbcloud.com`)
     - `DB_PORT`: `4000`
     - `DB_USER`: (e.g. `xxxx.root`)
     - `DB_PASSWORD`: (your password)
     - `DB_NAME`: `test` (or create `placetrack`)
     - `DB_SSL`: `true`

### Option B: Aiven for MySQL (Free Trial / Tier)
1. Go to [https://aiven.io](https://aiven.io).
2. Create a free MySQL service.
3. Copy the host, port, user, password, and database name from the service overview page.

---

## Step 2: Method A — Deploy with Docker (Recommended)

Docker packages both the React frontend and Express backend into an optimized single container.

### 1. Connect to your VPS
```bash
ssh user@your-server-ip
```

### 2. Install Docker & Docker Compose (if not already installed)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 3. Copy your project to the server
Using Git or SCP/rsync:
```bash
# Example with Git:
git clone <your-repository-url> placetrack
cd placetrack
```

### 4. Create your `.env` file
```bash
cp .env.example .env
nano .env
```
Fill in your database credentials:
```env
PORT=5000
JWT_SECRET=super_secret_random_key_replace_this_with_random_string

# Cloud MySQL (TiDB / Aiven / etc.)
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=test
DB_SSL=true
```

> **Note:** If you want to use the included self-hosted MySQL container instead of cloud MySQL, leave `DB_HOST=mysql` and `DB_SSL=false`.

### 5. Start the Application
```bash
# If using Cloud MySQL:
docker compose up -d --build app

# Or if using the local MySQL container too:
docker compose up -d --build
```

Your app will be live at `http://your-server-ip:5000`!

---

## Step 3: Method B — Deploy with Node.js + PM2 + Nginx

If you prefer running directly on Ubuntu without Docker:

### 1. Install Node.js 20 & PM2
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 process manager
sudo npm install -g pm2
```

### 2. Setup Project & Build Frontend
```bash
cd /var/www/placetrack

# Install root dependencies and compile React frontend
npm install
npm run build

# Install backend dependencies
cd server
npm install
```

### 3. Configure Server `.env`
Inside `/var/www/placetrack/server`:
```bash
nano .env
```
Add your production configuration:
```env
PORT=5000
JWT_SECRET=super_secure_random_production_secret
DB_HOST=your_cloud_mysql_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_SSL=true
```

### 4. Start Server with PM2
```bash
cd /var/www/placetrack
pm2 start server/server.js --name "placetrack"
pm2 save
pm2 startup
```

---

## Step 4: Configure Nginx & Free SSL (Let's Encrypt)

To serve your app on your domain (e.g. `placetrack.example.com`) on port 80/443 with HTTPS:

### 1. Install Nginx
```bash
sudo apt update
sudo apt install -y nginx
```

### 2. Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/placetrack
```
Paste this configuration (replace `yourdomain.com` with your domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/placetrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Enable Free SSL with Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Certbot will automatically obtain and install the SSL certificate.

---

## Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `JWT_SECRET` | Secret key used for signing JWT tokens | `random_32_character_string` |
| `DATABASE_URL` | Full MySQL connection string (optional) | `mysql://user:pass@host:port/db` |
| `DB_HOST` | MySQL hostname | `gateway01.xxx.tidbcloud.com` or `localhost` |
| `DB_PORT` | MySQL port | `3306` (default) or `4000` (TiDB) |
| `DB_USER` | MySQL database user | `root` or cloud user |
| `DB_PASSWORD` | MySQL user password | `your_secret_password` |
| `DB_NAME` | MySQL database name | `placetrack` |
| `DB_SSL` | Enable SSL (`true` for cloud MySQL) | `true` or `false` |
