FROM localhost:50000/cdp/vue:prod as vue-stage

FROM nginx:stable-alpine as production-stage
ADD base /etc/nginx/
COPY --from=vue-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
