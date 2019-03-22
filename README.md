# Smart Bot

Small micro-service to manipulate robots and enable iteration between users and robots
![AWS Design](/public/architecture.png "AWS Design")

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them
* NPM (Package manager for JavaScript) v.5.6.0
* Node.js (JavaScript runtime built on Chrome's V8 JavaScript engine) v.8.10.0
* Docker (Docker provides a way to run applications securely isolated in a container) v.18.06.1

### Usage

`First of all configure the project in ./deployment-config/ file.`

```sh
$ docker-compose run --service-ports --rm smartbot-development-local
```
#### The above command will generate the following output

```sh
$ Sending build context to Docker daemon  286.2kB
$ Step 1/4 : FROM node:8.10 AS build
$  ---> 41a1f5b81103
$ Step 2/4 : LABEL AUTHOR="Rodrigo Melgar"
$  ---> 4b19bbe1dc7b
$ Step 3/4 : LABEL VERSION="0.0.2"
$  ---> acd4f84ff463
$ Step 4/4 : RUN npm i -g npm && npm install -g serverless && npm install -g typescript && echo "Installation completed!"
$ ---> c018a986983e
$ Successfully built c018a986983e
$ Successfully tagged smartbot-development-local:latest
```
After installing the dependencies execute the command below inside the container:
```sh
/opt/app$ npm install --verbose
```

## For local development

After any change in the code execute the command below to transpilar the project
```sh
/opt/app$ npm run build
```
Then start the REST server that will group all the functions
```sh
/opt/app$ npm run start:local
```

## Running the tests

Generate the test package inside the container used for development
```sh
/opt/app$ npm run pack:dev
```

Run the tests outside the container used for development
```sh
$ npm run test
```

## Deployment

`First of all insert your credentials into the ./deployment-config/aws/credentials file.`

### For deploy enter with commands outside container: 

## For Development Environment
```sh
$ docker build -f Dockerfile -t smartbot:build-dev .
```

## For Production Environment
```sh
$ docker build -e STAGE=prod -f Dockerfile -t smartbot:build-prod .
```

## For deploy enter with commands inside container: 

### For Development Environment
```sh
/opt/app$ npm run deploy:dev
```
### For Production Environment
```sh
/opt/app$ npm run deploy:prod
```

## Built With
* [NPM](https://npmjs.com/) - Package manager 
* [SERVERLESS](https://serverless.com) - Serverless Framework

