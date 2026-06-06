import { LinkIcon } from '@heroicons/react/24/solid';

function ProfilePreview({ user, links }) {
  const activeLinks = links
    .filter((link) => link.is_active)
    .sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="sticky top-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Превью страницы</h2>

      <div className="mx-auto max-w-sm overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-b from-indigo-50 to-white shadow-lg dark:border-gray-600 dark:from-gray-800 dark:to-gray-900">
        <div className="px-6 py-10 text-center">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.username}
              className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-white"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-2xl font-bold text-white ring-4 ring-white">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
          )}

          <h3 className="text-xl font-bold">@{user?.username || 'username'}</h3>

          {user?.bio && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{user.bio}</p>}

          <div className="mt-6 space-y-2.5">
            {activeLinks.length === 0 ? (
              <p className="text-sm text-gray-400">Активных ссылок нет</p>
            ) : (
              activeLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                >
                  <LinkIcon className="h-4 w-4 shrink-0 text-indigo-500" />
                  <span className="truncate">{link.title}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-gray-400">
        Обновляется в реальном времени
      </p>
    </div>
  );
}

export default ProfilePreview;
