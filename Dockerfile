FROM bitnami/node:18 as builder

ARG VITE_API_BASE
ARG VITE_ENVIRONMENT
ARG VITE_WL_API_KEY

WORKDIR /app
COPY package.json yarn.lock /app/

RUN yarn install --pure-lockfile --non-interactive &&\
    rm -rf /usr/local/share/.cache

COPY . .
RUN npm run build-only

FROM nginx:1.25.2-alpine

RUN apk add --no-cache bash

COPY nginx.conf /etc/nginx/nginx.conf
COPY welearn.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

COPY --from=builder /app/dist/ /usr/share/nginx/html
RUN chown -R nginx:nginx  /usr/share/nginx/html
RUN chown -R nginx:nginx  /etc/nginx/conf.d/

COPY --chown=nginx:nginx interpolate-variables.sh ./interpolate-variables.sh
COPY --chown=nginx:nginx devops-toolbox/scripts/secrets-entrypoint.sh ./secrets-entrypoint.sh
COPY --chown=nginx:nginx ./nginx-entrypoint-interpolate-variables.sh /docker-entrypoint.d/40-interpolate-variables.sh

USER nginx
