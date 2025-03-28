This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Docker

You can build and run the application using Docker:

```bash
# Build the Docker image
npm run docker:build

# Run the Docker container
npm run docker:run

# Or use Docker Compose
npm run docker:compose
```

### Google Cloud Run

This project is configured for deployment to Google Cloud Run:

```bash
# Deploy to Google Cloud Run
npm run deploy
```

For detailed setup instructions, see the documentation in the `docs` directory.

### CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

1. When a pull request is opened against the `main` branch, the workflow will:
   - Build the application
   - Run linting and tests

2. When changes are pushed to the `main` branch, the workflow will:
   - Build the application
   - Run linting and tests
   - Build and push a Docker image to GitHub Container Registry
   - Deploy the application to Google Cloud Run

#### Required Secrets

To enable the CI/CD pipeline, add the following secrets to your GitHub repository:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`: The Workload Identity Provider for Google Cloud authentication
- `GCP_SERVICE_ACCOUNT`: The service account email for Google Cloud authentication
- `DATABASE_URL`: The connection string for your database

For setting up Workload Identity Federation, follow the [Google Cloud documentation](https://cloud.google.com/iam/docs/workload-identity-federation).
