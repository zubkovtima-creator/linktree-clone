const { Link, User } = require('../models');

function isValidUrl(url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
}

async function getMyLinks(req, res) {
  try {
    const links = await Link.findAll({
      where: { user_id: req.user.id },
      order: [['order_index', 'ASC']],
    });

    return res.json(links);
  } catch (error) {
    console.error('getMyLinks error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function createLink(req, res) {
  try {
    const { title, url } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Title is required.' });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ message: 'URL must start with http:// or https://.' });
    }

    const maxOrder = await Link.max('order_index', {
      where: { user_id: req.user.id },
    });

    const order_index = maxOrder !== null ? maxOrder + 1 : 0;

    const link = await Link.create({
      user_id: req.user.id,
      title: title.trim(),
      url,
      order_index,
    });

    return res.status(201).json(link);
  } catch (error) {
    console.error('createLink error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function updateLink(req, res) {
  try {
    const { id } = req.params;
    const link = await Link.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found.' });
    }

    const { title, url, order_index, is_active } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Title is required.' });
      }
      link.title = title.trim();
    }

    if (url !== undefined) {
      if (!isValidUrl(url)) {
        return res.status(400).json({ message: 'URL must start with http:// or https://.' });
      }
      link.url = url;
    }

    if (order_index !== undefined) {
      link.order_index = order_index;
    }

    if (is_active !== undefined) {
      link.is_active = is_active;
    }

    await link.save();

    return res.json(link);
  } catch (error) {
    console.error('updateLink error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function deleteLink(req, res) {
  try {
    const { id } = req.params;

    const link = await Link.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found.' });
    }

    await link.destroy();

    return res.json({ message: 'Link deleted successfully.' });
  } catch (error) {
    console.error('deleteLink error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function reorderLinks(req, res) {
  try {
    const { links } = req.body;

    if (!Array.isArray(links)) {
      return res.status(400).json({ message: 'Links must be an array of { id, order_index }.' });
    }

    for (const item of links) {
      if (item.id === undefined || item.order_index === undefined) {
        return res.status(400).json({ message: 'Each item must have id and order_index.' });
      }

      const link = await Link.findOne({
        where: { id: item.id, user_id: req.user.id },
      });

      if (link) {
        link.order_index = item.order_index;
        await link.save();
      }
    }

    const updatedLinks = await Link.findAll({
      where: { user_id: req.user.id },
      order: [['order_index', 'ASC']],
    });

    return res.json(updatedLinks);
  } catch (error) {
    console.error('reorderLinks error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

async function getPublicProfile(req, res) {
  try {
    const { username } = req.params;

    const user = await User.findOne({
      where: { username },
      attributes: ['username', 'bio', 'avatar_url'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const links = await Link.findAll({
      where: { user_id: user.id, is_active: true },
      attributes: ['id', 'title', 'url', 'order_index'],
      order: [['order_index', 'ASC']],
    });

    return res.json({
      username: user.username,
      bio: user.bio,
      avatar_url: user.avatar_url,
      links,
    });
  } catch (error) {
    console.error('getPublicProfile error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}

module.exports = {
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  getPublicProfile,
};
