#!/bin/bash

# Exit on error
set -e

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDK (gcloud) is not installed. Please install it from https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "You are not authenticated with gcloud. Please run 'gcloud auth login'"
    exit 1
fi

# Get current project
PROJECT_ID=$(gcloud config get-value project)
if [ -z "$PROJECT_ID" ]; then
    echo "No project selected. Please run 'gcloud config set project YOUR_PROJECT_ID'"
    exit 1
fi

echo "Deploying to project: $PROJECT_ID"

# Check if required APIs are enabled
REQUIRED_APIS=("cloudbuild.googleapis.com" "run.googleapis.com" "containerregistry.googleapis.com")
for api in "${REQUIRED_APIS[@]}"; do
    if ! gcloud services list --enabled --filter="name:$api" --format="value(name)" | grep -q "$api"; then
        echo "Enabling $api..."
        gcloud services enable "$api"
    fi
done

# Prompt for database URL if not provided
if [ -z "$1" ]; then
    read -p "Enter your database connection string (e.g., postgresql://username:password@host:port/database): " DATABASE_URL
else
    DATABASE_URL="$1"
fi

# Validate database URL
if [ -z "$DATABASE_URL" ]; then
    echo "Database URL is required"
    exit 1
fi

echo "Building and deploying application..."

# Submit build to Cloud Build
gcloud builds submit --config=cloudbuild.yaml --substitutions=_DATABASE_URL="$DATABASE_URL"

# Get the deployed URL
DEPLOYED_URL=$(gcloud run services describe tictactoe --platform managed --region us-central1 --format 'value(status.url)' 2>/dev/null || echo "Deployment pending")

echo "Deployment submitted successfully!"
echo "Your application will be available at: $DEPLOYED_URL"
echo "You can check the status with: gcloud run services describe tictactoe --platform managed --region us-central1"