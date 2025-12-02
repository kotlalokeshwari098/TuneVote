FROM node:22-alpine

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
