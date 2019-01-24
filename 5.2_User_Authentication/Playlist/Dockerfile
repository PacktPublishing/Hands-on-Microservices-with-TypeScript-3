FROM node:8.13-slim AS build-env

# Create app directory
RUN mkdir -p /opt/my-musik/
WORKDIR /opt/my-musik/
RUN npm install typescript -g

COPY ./gulpfile.js .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./tslint.json .
COPY ./config.json .
COPY ./Dockerfile .

# Install app dependencies
RUN npm install --no-optional

# Bundle app source
COPY ./src ./src

RUN "node_modules/.bin/gulp"


# final stage
FROM node:8.13-slim
RUN mkdir -p /opt/my-musik/
WORKDIR /opt/my-musik/
COPY --from=build-env /opt/my-musik/dist ./dist
COPY --from=build-env /opt/my-musik/package.json ./
COPY --from=build-env /opt/my-musik/config.json ./
RUN npm install --no-optional --only=prod

EXPOSE 3002

CMD [ "node", "dist/app.js" ]