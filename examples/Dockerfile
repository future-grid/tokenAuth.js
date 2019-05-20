FROM node:10-alpine
# Maintainer
# ----------
MAINTAINER Futuregrid <team@futuregrid.com.au>
RUN npm install -g http-server
WORKDIR /usr/apps/webapp/
COPY . /usr/apps/webapp/
CMD ["npm","run","serve"]