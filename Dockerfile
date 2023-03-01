FROM node:16-alpine3.16
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN rm -rf node_modules
RUN npm install --prod
EXPOSE 4000
CMD ["node", "src/index.js"]
