const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const demandeRoutes = require('./routes/demandeRoutes');
const offreRoutes = require('./routes/offreRoutes');
const contratRoutes = require('./routes/contratRoutes');
const paiementRoutes = require('./routes/paiementRoutes');
const remboursementRoutes = require('./routes/remboursementRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/api/offres', offreRoutes);
app.use('/api/contrats', contratRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/remboursements', remboursementRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => res.json({ message: 'API plateforme prêt OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Serveur sur http://localhost:${PORT}`));