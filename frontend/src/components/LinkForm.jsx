import { useEffect, useState } from 'react';

function isValidUrl(url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'));
}

function LinkForm({ editingLink, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(editingLink);

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
    } else {
      setTitle('');
      setUrl('');
    }
    setErrors({});
  }, [editingLink]);

  const validate = () => {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = 'Название обязательно';
    }

    if (!url.trim()) {
      nextErrors.url = 'URL обязателен';
    } else if (!isValidUrl(url.trim())) {
      nextErrors.url = 'URL должен начинаться с http:// или https://';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ title: title.trim(), url: url.trim() });
  };

  const handleCancel = () => {
    setTitle('');
    setUrl('');
    setErrors({});
    onCancel?.();
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold">
        {isEditing ? 'Редактировать ссылку' : 'Добавить ссылку'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="link-title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="link-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="YouTube"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
          />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="link-url" className="mb-1 block text-sm font-medium">
            URL
          </label>
          <input
            id="link-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtube.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-900"
          />
          {errors.url && <p className="mt-1 text-xs text-red-500">{errors.url}</p>}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : isEditing ? 'Обновить' : 'Добавить'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Отмена
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default LinkForm;
