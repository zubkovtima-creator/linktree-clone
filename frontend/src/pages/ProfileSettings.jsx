import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../services/api';
import ProfilePreview from '../components/ProfilePreview';

function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setBio(user?.bio || '');
    setAvatarUrl(user?.avatar_url || '');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await api.put('/user/profile', {
        bio,
        avatar_url: avatarUrl,
      });
      updateUser(data);
      setSuccess('Профиль сохранён');
    } catch (err) {
      setError(getErrorMessage(err, 'Не удалось сохранить профиль'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Профиль</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Настройте внешний вид публичной страницы
          </p>
        </div>
        <Link
          to="/admin"
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          ← К ссылкам
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
          {success}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <div>
            <label htmlFor="avatar" className="mb-1 block text-sm font-medium">
              URL аватара
            </label>
            <input
              id="avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
            <p className="mt-1 text-xs text-gray-400">
              Вставьте ссылку на изображение (Imgur, GitHub и т.д.)
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="mb-1 block text-sm font-medium">
              Биография
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Расскажите о себе..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
            />
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
            Ваша страница:{' '}
            <span className="font-medium text-indigo-600 dark:text-indigo-400">
              /{user?.username}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить профиль'}
          </button>
        </form>

        <ProfilePreview
          user={{ ...user, bio, avatar_url: avatarUrl }}
          links={[]}
        />
      </div>
    </div>
  );
}

export default ProfileSettings;
