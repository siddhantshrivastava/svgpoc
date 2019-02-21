# Stage 1
FROM node:alpine as svg-build
WORKDIR /app
COPY . ./
RUN npm i
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=svg-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]