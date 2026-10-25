const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET lue=1 WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    res.json({ message: 'Notification lue' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};