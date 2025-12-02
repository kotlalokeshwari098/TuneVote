#use an official nodejs runtime as a parent image
FROM node:22-alpine

#set the working directory in the container
WORKDIR /server

#copy the package.json and the package-lock.json to the container
COPY package*.json .

#Install the dependencies
RUN npm install

#Copy the rest of the application code
COPY . .

#Expose the post that app runs on
EXPOSE 5656

# command to run our application
CMD ["node","src/server.js"]