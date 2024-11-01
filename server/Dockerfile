# Базовый образ Node.js
FROM node:14

RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .


EXPOSE 3000

# Настраиваем точку входа для обеих служб (api и worker)
CMD ["node", "app.js"]
