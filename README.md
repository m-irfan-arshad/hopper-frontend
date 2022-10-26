# Hopper

This repo contains all the client and API logic for the Hopper (next-gen Surgiscript) application. This is a living document that outlines the standards for contributing to the project.


## Major Dependencies

- [Typescript](https://www.typescriptlang.org/docs/)
- [Next.js](https://nextjs.org/docs), for both client and server logic. Next built in API Routes are used to create our backend endpoints.
- [Prisma](https://www.prisma.io/docs/), a typescript ORM to manage the data model and interaction with Postgres.
- [MUI](https://mui.com/material-ui/getting-started/overview/), a React component library.
- [React-Query](https://tanstack.com/query/v4/docs/overview), for managing server state.

## General Architecture

TODO: Diagram

Hopper integration function, subscribed to healthcare API pub/sub output and writing to Hopper DB:
https://github.com/Medtel/66degrees/tree/main/hopper_project_new/hopper-int-source

Cloud Run instance:
https://console.cloud.google.com/run/detail/us-east4/hopper-frontend/metrics?project=mt-hp-s-dev-b7e1

Cloud SQL instance:
https://console.cloud.google.com/sql/instances/hopper-db-dev/overview?project=mt-hp-s-dev-b7e1

## Front End State Management

We differentiate conceptually between client state and server state. [React-Query](https://tanstack.com/query/v4/docs/overview) gives us a server state solution, and as of now we have not made the decision to introduce a client state management library. For now we are using the tools and patterns out of the box in React, but this can be reassessed if a use case warrants it. 

## Dependency Management

Package dependencies should be pinned to a specific version as of now and updated manually as needed. The package-lock file should always be committed. We're still evaluating the best way to manage depedencies as the application grows.

## UI Design

All UI designs are maintained in Figma. See the "Hopper-Final" tab for the most up to date screens.

Access designs [here](https://www.figma.com/file/o1rBQOftJUvdKmoT0Em5JT/Hopper-MUI?node-id=8778%3A71616). Let the team know if you do not have access.


## Deployment

Deployment is managed via Github Actions. See the dev workflow file [here](https://github.com/Medtel/hopper-frontend/blob/main/.github/workflows/dev-pipeline.yml). Currently only a dev pipeline exists.

- The pipeline runs on pull requests and merges to main.
- The pipeline will need to successfully build, lint, and run unit tests before moving on to the deployment step.
- A docker image is created, uploaded to GCPs container registry, and deployed to Cloud Run.
- After a successful deployment, E2E tests are run against the environment.

Please verify that the pipeline runs successfully after creating a PR.

## Testing

Front End unit tests: [react-testing-library](https://testing-library.com/docs/react-testing-library/intro/) + [jest](https://jestjs.io/docs/getting-started)

API Routes unit tests: [node-mocks-http](https://www.npmjs.com/package/node-mocks-http)

Front End E2E tests: [playwright](https://playwright.dev/docs/intro)

Currently we are not enforcing a certain test coverage, but try to aim for meaningful tests as opposed to blindly pushing coverage forward. This is up to developer discretion, but generally lands somewhere around 80% coverage.

## Getting Started

Make sure that a recent version of node and npm are installed on your machine.

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

By default this runs on localhost:3000.

- TODO: Prisma / local DB setup
- TODO: Branching guidelines
- TODO: Commit guidelines
- TODO: PR guidelines
