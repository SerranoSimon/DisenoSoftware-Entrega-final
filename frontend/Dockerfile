# Etapa 1: Construcción
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# --- AÑADE ESTAS DOS LÍNEAS ANTES DEL BUILD ---
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# ---------------------------------------------

RUN npm run build

# Etapa 2: Servidor Web
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]