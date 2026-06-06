import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import LinkForm from '../components/LinkForm';
import LinkList from '../components/LinkList';
import LinksImportExport from '../components/LinksImportExport';
import ProfilePreview from '../components/ProfilePreview';

function Admin() {
  const { user } = useAuth();
  const [links, setLinks] = useState([]);
  const [editingLink, setEditingLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchLinks = useCallback(async () => {
    try {
      const { data } = await api.get('/links');
      setLinks(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось загрузить ссылки'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAddOrUpdate = async ({ title, url }) => {
    setSubmitting(true);
    setError('');

    try {
      if (editingLink) {
        const { data } = await api.put(`/links/${editingLink.id}`, { title, url });
        setLinks((prev) =>
          prev.map((link) => (link.id === data.id ? data : link))
        );
        setEditingLink(null);
      } else {
        const { data } = await api.post('/links', { title, url });
        setLinks((prev) => [...prev, data].sort((a, b) => a.order_index - b.order_index));
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось сохранить ссылку'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить эту ссылку?')) return;

    setError('');

    try {
      await api.delete(`/links/${id}`);
      setLinks((prev) => prev.filter((link) => link.id !== id));
      if (editingLink?.id === id) {
        setEditingLink(null);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось удалить ссылку'));
    }
  };

  const handleToggle = async (link) => {
    setError('');

    try {
      const { data } = await api.put(`/links/${link.id}`, {
        is_active: !link.is_active,
      });
      setLinks((prev) =>
        prev.map((item) => (item.id === data.id ? data : item))
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось обновить ссылку'));
    }
  };

  const handleReorder = async (reorderedLinks) => {
    const previousLinks = links;
    setLinks(reorderedLinks);
    setError('');

    try {
      await api.put('/links/reorder', {
        links: reorderedLinks.map(({ id, order_index }) => ({ id, order_index })),
      });
    } catch (err) {
      setLinks(previousLinks);
      setError(getErrorMessage(err, 'Не удалось изменить порядок'));
    }
  };

  const handleImport = async (items) => {
    setError('');
    let imported = 0;

    for (const item of items) {
      if (!item?.title?.trim() || !item?.url) continue;

      try {
        await api.post('/links', {
          title: item.title.trim(),
          url: item.url,
        });
        imported += 1;
      } catch {
        // skip invalid items
      }
    }

    if (imported === 0) {
      setError('Не удалось импортировать ссылки. Проверьте поля title и url.');
      return;
    }

    await refreshLinks();
  };

  const refreshLinks = async () => {
    try {
      const { data } = await api.get('/links');
      setLinks(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось загрузить ссылки'));
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Панель управления</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Привет, {user?.username}! Управляйте своими ссылками.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/profile"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          >
            Профиль
          </Link>
          {user?.username && (
            <Link
              to={`/${user.username}`}
              target="_blank"
              className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950"
            >
              Открыть страницу
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Загрузка ссылок...</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <LinkForm
              editingLink={editingLink}
              onSubmit={handleAddOrUpdate}
              onCancel={() => setEditingLink(null)}
              loading={submitting}
            />

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Мои ссылки</h2>
                <LinksImportExport links={links} onImportComplete={handleImport} />
              </div>
              <LinkList
                links={links}
                onEdit={setEditingLink}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onReorder={handleReorder}
              />
            </div>
          </div>

          <ProfilePreview user={user} links={links} />
        </div>
      )}
    </div>
  );
}

export default Admin;
