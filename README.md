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

## CI/CD and Deployment

This project uses GitHub Actions for CI/CD to automatically build, test, and deploy the application to Google Cloud Run.

### CI/CD Workflow

The CI/CD pipeline performs the following steps:
1. Builds and tests the Next.js application
2. Builds a Docker image
3. Pushes the Docker image to GitHub Container Registry (GHCR)
4. Deploys the image to Google Cloud Run

### Required Secrets

To set up the CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

- `GCP_WORKLOAD_IDENTITY_PROVIDER`: The Workload Identity Provider for Google Cloud authentication
- `GCP_SERVICE_ACCOUNT`: The service account email for Google Cloud authentication
- `DATABASE_URL`: The connection string for your database

### Setting Up Google Cloud for Deployment

1. Create a Google Cloud project
2. Set up Workload Identity Federation for GitHub Actions
3. Create a service account with the necessary permissions (Cloud Run Admin, Storage Admin)
4. Configure the Workload Identity Provider

For more details on setting up Workload Identity Federation with GitHub Actions, see the [Google Cloud documentation](https://cloud.google.com/blog/products/identity-security/enabling-keyless-authentication-from-github-actions).
