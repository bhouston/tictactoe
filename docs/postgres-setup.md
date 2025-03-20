# Setting up PostgreSQL for Production

This guide explains how to set up PostgreSQL for your production environment, which is recommended over SQLite for production deployments.

## Why PostgreSQL for Production?

While SQLite is great for development and testing, PostgreSQL offers several advantages for production:

- Better concurrency handling
- Improved performance for high-traffic applications
- Better data integrity and recovery options
- Supports larger databases
- Designed for multi-user environments

## Option 1: Google Cloud SQL (Recommended for Google Cloud Run)

### 1. Create a PostgreSQL instance:

```bash
# Create a PostgreSQL instance
gcloud sql instances create tictactoe-db \
  --database-version=POSTGRES_14 \
  --cpu=1 \
  --memory=3840MB \
  --region=us-central1

# Create a database
gcloud sql databases create tictactoe \
  --instance=tictactoe-db

# Create a user
gcloud sql users create tictactoe-user \
  --instance=tictactoe-db \
  --password=YOUR_SECURE_PASSWORD
```

### 2. Connect your Cloud Run service to Cloud SQL:

Update your `cloudbuild.yaml` file to include the Cloud SQL connection:

```yaml
# In the args section of the Cloud Run deployment step:
- '--add-cloudsql-instances=$PROJECT_ID:us-central1:tictactoe-db'
```

### 3. Update your database connection string:

```
DATABASE_URL=postgresql://tictactoe-user:YOUR_SECURE_PASSWORD@localhost:5432/tictactoe?host=/cloudsql/$PROJECT_ID:us-central1:tictactoe-db
```

## Option 2: Self-managed PostgreSQL

### 1. Install PostgreSQL:

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# On macOS with Homebrew
brew install postgresql
```

### 2. Create a database and user:

```bash
sudo -u postgres psql

# In the PostgreSQL prompt
CREATE DATABASE tictactoe;
CREATE USER tictactoe_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE tictactoe TO tictactoe_user;
\q
```

### 3. Update your database connection string:

```
DATABASE_URL=postgresql://tictactoe_user:your_secure_password@localhost:5432/tictactoe
```

## Updating Prisma for PostgreSQL

1. Update your Prisma schema (`prisma/schema.prisma`):

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Generate Prisma client:

```bash
npx prisma generate
```

3. Run migrations:

```bash
# For development
npx prisma migrate dev

# For production (safer option)
npx prisma migrate deploy
```

## Security Considerations

- Never commit database credentials to your repository
- Use environment variables for sensitive information
- Consider using a secrets manager like Google Secret Manager
- Implement proper backup strategies for your database
- Restrict network access to your database