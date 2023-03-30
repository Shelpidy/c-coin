FROM node:alpine
RUN MKDIR /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD [ "node","./dist/src/index.js"]