# ==== CONFIGURE =====
FROM node:18

WORKDIR /backend

# copy package.json and package-lock.json to /app
COPY package*.json ./

# ==== BUILD =====
# install dependencies
RUN npm install
# RUN npm install -g nodemon

# for production
# RUN npm ci --omit=dev

# copy the rest of the files to /app
COPY . .

EXPOSE 8080 27017 5432

# ==== RUN =======
CMD [ "npm", "run", "dev" ]