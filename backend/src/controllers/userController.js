const { User } = require('../models');

function toSafeUser(user) {
  const { password_hash, ...safeUser } = user.toJSON();
  return safeUser;
}

async function updateProfile(req, res) {
  try {
    const { bio, avatar_url } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (bio !== undefined) {
      user.bio = bio.trim() || null;
    }

    if (avatar_url !== undefined) {
      user.avatar_url = avatar_url.trim() || null;
    }

    await user.save();

    return res.json(toSafeUser(user));
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = {
  updateProfile,
};
