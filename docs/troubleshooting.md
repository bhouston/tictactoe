# Troubleshooting Docker and Google Cloud Run

This guide provides solutions to common issues you might encounter when working with Docker and Google Cloud Run.

## Docker Issues

### Container fails to start

**Symptoms:**
- Docker container exits immediately after starting
- You see error messages in Docker logs

**Solutions:**
1. Check logs:
   ```bash
   docker logs $(docker ps -a -q --filter "ancestor=tictactoe" --latest)
   ```

2. Verify your DATABASE_URL environment variable:
   ```bash
   docker run -p 3000:3000 -e DATABASE_URL=file:./prisma/dev.db tictactoe
   ```

3. Try running in interactive mode:
   ```bash
   docker run -it -p 3000:3000 tictactoe /bin/sh
   ```

### Database connection issues

**Symptoms:**
- Application starts but can't connect to the database
- You see Prisma connection errors

**Solutions:**
1. Make sure your SQLite database is mounted correctly:
   ```bash
   docker run -p 3000:3000 -v $(pwd)/prisma:/app/prisma tictactoe
   ```

2. For PostgreSQL, verify connection string and network access:
   ```bash
   docker run -p 3000:3000 -e DATABASE_URL="postgresql://username:password@host:port/database" tictactoe
   ```

### Docker build fails

**Symptoms:**
- Docker build process fails with errors

**Solutions:**
1. Clear Docker cache and rebuild:
   ```bash
   docker build --no-cache -t tictactoe .
   ```

2. Check for syntax errors in Dockerfile:
   ```bash
   docker build -t tictactoe . 2>&1 | grep -i error
   ```

## Google Cloud Run Issues

### Deployment fails

**Symptoms:**
- Cloud Build fails
- Deployment doesn't complete

**Solutions:**
1. Check Cloud Build logs:
   ```bash
   gcloud builds list
   gcloud builds log [BUILD_ID]
   ```

2. Verify your substitution variables:
   ```bash
   gcloud builds submit --config=cloudbuild.yaml --substitutions=_DATABASE_URL="your-connection-string"
   ```

3. Make sure all required APIs are enabled:
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com
   ```

### Service starts but crashes

**Symptoms:**
- Service deploys but crashes or returns errors

**Solutions:**
1. Check Cloud Run logs:
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=tictactoe" --limit=10
   ```

2. Verify environment variables:
   ```bash
   gcloud run services describe tictactoe --format="yaml(spec.template.spec.containers[0].env)"
   ```

3. Test with a simple health check endpoint:
   ```bash
   # Add a simple /api/health endpoint to your Next.js app that returns a 200 status
   # Then test it with:
   curl $(gcloud run services describe tictactoe --format="value(status.url)")/api/health
   ```

### Database connection issues

**Symptoms:**
- Service starts but can't connect to the database

**Solutions:**
1. For Cloud SQL, verify connection configuration:
   ```bash
   gcloud run services describe tictactoe --format="yaml(spec.template.spec.containers[0].env,spec.template.metadata.annotations)"
   ```

2. Check if Cloud SQL instance is running:
   ```bash
   gcloud sql instances describe tictactoe-db --format="value(state)"
   ```

3. Verify network connectivity:
   ```bash
   # For Cloud SQL, make sure the Cloud Run service has the proper connection
   gcloud run services update tictactoe --add-cloudsql-instances=PROJECT_ID:REGION:INSTANCE_NAME
   ```

## Common Prisma Issues

### Prisma Client not generated

**Symptoms:**
- Error: "PrismaClient is not defined" or similar

**Solutions:**
1. Make sure Prisma client is generated during build:
   ```
   # In your Dockerfile
   RUN npx prisma generate
   ```

2. Verify Prisma client is included in the Docker image:
   ```bash
   docker run -it tictactoe /bin/sh -c "ls -la node_modules/.prisma"
   ```

### Migration issues

**Symptoms:**
- Database schema doesn't match Prisma schema

**Solutions:**
1. For development, run migrations:
   ```bash
   npx prisma migrate dev
   ```

2. For production, use deploy command:
   ```bash
   npx prisma migrate deploy
   ```

3. If all else fails, reset the database (development only):
   ```bash
   npx prisma migrate reset
   ```

## Getting Help

If you continue to experience issues:

1. Check the [Next.js documentation](https://nextjs.org/docs)
2. Refer to the [Prisma documentation](https://www.prisma.io/docs/)
3. Review the [Google Cloud Run documentation](https://cloud.google.com/run/docs)
4. Search for similar issues on [Stack Overflow](https://stackoverflow.com/)