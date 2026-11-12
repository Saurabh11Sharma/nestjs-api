# NestJS API

A NestJS + TypeScript REST API codebase demonstrating session-based authentication, user endpoints, report workflows, DTO validation / serialization and TypeORM persistence.

## Implemented areas

### Authentication and users

- Sign-up, sign-in and sign-out through cookie-backed sessions.
- Authenticated current-user endpoint.
- User lookup and user update / delete endpoints.
- Guarded route handling and response serialization through DTOs.

Routes visible in the current controller:

| Method | Route | Access |
|---|---|---|
| POST | /auth/signup | Public |
| POST | /auth/signin | Public |
| POST | /auth/signout | Session |
| GET | /auth/whoami | Authenticated |
| GET | /auth/:id | Controller-defined |
| GET | /auth?email=... | Controller-defined |
| PUT | /auth/:id | Controller-defined |
| DELETE | /auth/:id | Controller-defined |

Review and strengthen authorisation on user-management routes before exposing this code as a production service.

### Reports

- Authenticated report creation linked to the current user.
- Admin-guarded approval updates.
- Estimate calculation based on approved reports with matching make / model, nearby model year and geographic coordinates, ordered by mileage proximity.
- DTO validation and response serialization.

| Method | Route | Access |
|---|---|---|
| POST | /reports/create | Authenticated |
| PATCH | /reports/:id | Admin guard |
| GET | /reports/estimate | Authenticated |

## Technology

- NestJS 10 and TypeScript
- TypeORM
- SQLite in the current checked-in configuration
- class-validator and class-transformer
- cookie-session
- Jest and Supertest dependencies

This repository currently uses SQLite. PostgreSQL is part of my broader engineering stack and learning roadmap, but is not the database configured by this codebase today.

## Run locally

Requirements: Node.js 20 or compatible LTS, npm.

1. Install packages:

       npm ci

2. Create a local environment file:

       copy .env.example .env.dev

   On macOS / Linux, use:

       cp .env.example .env.dev

3. Keep COOKIE_KEY as a local-only secret and change it to a long random value. Never commit .env.dev or production credentials.

4. Start the app:

       npm run start:dev

## Useful commands

    npm run build
    npm test
    npm run test:e2e
    npm run test:cov

## Environment variables

| Variable | Purpose | Local example |
|---|---|---|
| DB_NAME | SQLite database file | dev.sqlite |
| SYNCHRONIZE | TypeORM schema sync; keep disabled when using migrations | false |
| COOKIE_KEY | Cookie-session signing key | replace with a random local value |
| MIGRATIONS_RUN | Run migrations automatically at startup | false |
| KEEP_CONNECTION_ALIVE | TypeORM connection lifecycle option | false |

The app selects an environment file named .env.<NODE_ENV>. The start:dev script sets NODE_ENV=dev. Configure production values through the deployment environment or a secret manager; do not add a production .env file to Git.

## Database migrations

Migration scripts are stored in the migrations directory and TypeORM CLI configuration is in src/data-source.ts. Review the target database and migration before executing it.

## Engineering notes

- Runtime environment values are strings; boolean configuration is parsed explicitly.
- Schema synchronisation defaults to false.
- The estimate query filters using the report's make, model, year, latitude, longitude and approval fields, then averages up to ten reports closest by mileage.
- This is a learning / portfolio codebase. Review route-level authorisation, cookie settings, production database configuration, error handling and operational controls before using it for production workloads.

## Roadmap

- Add complete HTTP e2e coverage for authentication and reports.
- Review object-level access rules on user routes.
- Add PostgreSQL as an explicit persistence option with integration tests.
- Add OpenAPI documentation and a reproducible Docker development environment.
- Add CI for lint, type-check, test and build.

## Contact

Saurabh Sharma · https://github.com/Saurabh11Sharma
