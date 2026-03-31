FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
RUN npm install -g serve
RUN chmod +x docker-entrypoint.sh
EXPOSE 3000
CMD ["./docker-entrypoint.sh"]
