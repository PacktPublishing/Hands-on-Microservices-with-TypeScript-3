FROM node:8.13-slim AS build-env

# Create app directory
RUN mkdir -p /opt/my-musik/
WORKDIR /opt/my-musik/

COPY ./package.json .
COPY ./tsconfig.json .
COPY ./tslint.json .

# Install app dependencies
RUN npm install typescript -g
RUN npm install --no-optional
RUN npm install -g @vue/cli

# Bundle app source
COPY ./src ./src
COPY ./public ./public

RUN npm run build


# final stage
FROM node:8.13-slim
RUN npm install npm -g
RUN mkdir -p /opt/my-musik/
WORKDIR /opt/my-musik/
COPY --from=build-env /opt/my-musik/dist ./dist
COPY --from=build-env /opt/my-musik/package.json ./

RUN npm install --no-optional --only=prod
RUN npm install node-static -g
EXPOSE 3001

CMD [ "static", "./dist", "-a", "0.0.0.0", "-p", "3001" ]