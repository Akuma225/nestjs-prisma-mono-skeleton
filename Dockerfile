# Utiliser une image Node.js de base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package*.json ./

ENV NODE_ENV=development

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exécuter la commande Prisma pour générer les clients
RUN npx prisma generate

# Exposer le port de l'application
EXPOSE 3040

# Commande par défaut pour démarrer l'application
CMD ["npm", "run", "start"]