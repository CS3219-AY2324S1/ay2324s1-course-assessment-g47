# ==== CONFIGURE =====
FROM node:18

WORKDIR /frontend

# copy package.json and package-lock.json to /app
COPY package*.json ./

# ==== BUILD =====
# install dependencies
RUN npm install

# for production
# RUN npm ci --omit=dev

# copy the rest of the files to /app
COPY . .

EXPOSE 3000

# ==== RUN =======
CMD [ "npm", "run", "start" ]