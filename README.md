# Travel Map Frontend

## Overview

Full-screen, modern map which lets you see where you and your friends have been or plan to go in the world.

Travel Map (_aka Geornal_) is a hobby project built as part of the [Project-Unicorn](https://projectunicorn.net/) programming group.

## Development

### Getting Started

When working on the application locally:

1. clone this repository to your local environment
2. run `npm install`
3. run `npm run dev`
4. access the app at [http://localhost:3000/](http://localhost:3000/)

This will run the application in development mode, which will ensure the updates you make to your local code are reflected in your locally running application.

### Running the API

In many cases you will need to also run the Travel Map API alongside this project.

Please see [travel-map-api](https://github.com/projectunic0rn/travel-map-api) for more information on how to setup and install the API.

### Testing & Updating Snapshots

We are currently using Jest and Enzyme in our frontend test suite, as well as utilizing [snapshot testing](https://jestjs.io/docs/en/snapshot-testing) in some instances.

The snapshot artifact should be committed alongside code changes, and reviewed as part of your code review process.

To run our test suite, you will run the following command:

```
npm test
```

As you make updates to areas of the code which also utilize snapshots, you may need to also update the snapshots:

```
npm run update-snapshots
```

This can also be done for a specific file by passing the `--updateSnapshot` flag when running the standard test command:

```
npm test src/App.test.js --updateSnapshot
```

Additional infomation on our test strategy can be found in our wiki: **[Testing-Overview](https://github.com/projectunic0rn/travel-map-ui/wiki/Testing-Overview)**

### Production Build

When running the application in "production" mode, you will use the following commands:

1. run `npm install`
2. run `npm run build`
3. run `npm start`
4. if running locally, access the site via [http://localhost:3000/](http://localhost:3000/)

## Core Features

The following is a breakdown of our core features and their status (if applicable):

| Feature | Status |
|---------|--------|
| Allows users to input cities/countries they have visited or plan to visit | ✅ |
| Allows users to see cities/countries their connections/friends have entered | **In Progress** |
| Potentially some sort of "achievement" system based on how many places you and your friends have been. | _Planned_ |

We are actively grooming and pruning our features using the team's internal [project board](https://github.com/orgs/projectunic0rn/projects/10).
