#  PrêtDirect - Plateforme de Prêt en Ligne

Une plateforme de financement moderne et sécurisée qui connecte les emprunteurs à un prêteur unique. 

## Technologies utilisées

### Frontend (Interface utilisateur)
- **React.js** (Vite) - Framework JavaScript
- **Tailwind CSS** - Pour un design moderne et 100% responsive (Mobile/Desktop)
- **Lucide React** - Bibliothèque d'icônes
- **Axios** - Pour les requêtes API
- **HTML2PDF.js** - Pour la génération des contrats en PDF
- **React Router DOM** - Pour la navigation

### Backend (Serveur & Base de données)
- **Node.js & Express.js** - Serveur API REST
- **MySQL** - Base de données relationnelle
- **JWT (JSON Web Tokens)** - Pour l'authentification sécurisée
- **Bcrypt.js** - Pour le hachage des mots de passe
- **CORS & Dotenv** - Sécurité et variables d'environnement
  
##  Fonctionnalités

###  Espace Emprunteur
- Inscription et connexion sécurisées
- Simulation de prêt avec calcul des taux par tranches
- Envoi de demande de financement (Mobile Money / IBAN)
- Suivi en temps réel du statut de la demande (En attente, Acceptée, Refusée)
- Téléchargement du contrat au format PDF
- Suivi de l'échéancier et barre de progression des remboursements
- Envoi du contrat signé via WhatsApp

###  Espace Administrateur (Prêteur)
- Tableau de bord avec statistiques en temps réel (Prêts remboursés, en cours, intérêts perçus)
- Configuration des offres de prêt (Montants min/max, durée, tranches de taux)
- Gestion et validation des demandes de prêt
- Validation des paiements mensuels (mise à jour automatique de la progression)
- Modération des utilisateurs (Bloquer, Débloquer, Supprimer)

##  Design
- Interface utilisateur moderne avec **Tailwind CSS**
- Totalement **Responsive** (adapté aux téléphones mobiles avec menu Burger)
- Devise : **FCFA**
- Animations fluides et expérience utilisateur (UX) optimisée

##  Auteur
Développé par **Bello Adjaho**
- GitHub: [@BelloAdjaho](https://github.com/BelloAdjaho)
