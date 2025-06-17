# pull base image
FROM node:20-alpine3.20

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm -g npm@latest expo-cli@latest

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
RUN mkdir /opt/react_native_app && chown node:node /opt/react_native_app
WORKDIR /opt/react_native_app
ENV PATH /opt/react_native_app/.bin:$PATH
USER node
COPY --chown=node:node docker/web/package.json tsconfig.json ./
RUN npm install && chmod -R 755 /opt/react_native_app 

# copy in our source code last, as it changes the most
WORKDIR /opt/react_native_app
# for development, we bind mount volumes; comment out for production

COPY --chown=node:node app app
COPY --chown=node:node hooks hooks
COPY --chown=node:node assets assets
COPY --chown=node:node constants constants
COPY --chown=node:node components components
COPY --chown=node:node api api

ENTRYPOINT ["npm", "run"]
CMD ["web"]