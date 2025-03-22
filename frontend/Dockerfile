
FROM node:18
WORKDIR /app
COPY package.json ./
COPY .env ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
