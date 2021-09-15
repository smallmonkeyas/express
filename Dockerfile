FROM node:slim
WORKDIR /app
COPY . .
RUN npm install ts-node -g
CMD ["npm","start"]
# CMD ["cat","1.txt"]

