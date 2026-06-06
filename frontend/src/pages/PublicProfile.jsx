import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserIcon } from '@heroicons/react/24/solid';
import api from '../services/api';
import { resetPageMeta, setPageMeta } from '../utils/pageMeta';

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div
          className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
          role="status"
          aria-label="Загрузка"
        />
        <p className="mt-4 text-sm text-gray-500">Загрузка профиля...</p>
      </div>
    </div>
  );
}

function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      setLoading(true);
      setNotFound(false);
      setProfile(null);

      try {
        const { data } = await api.get(`/public/${username}`);
        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        if (!cancelled) {
          if (err.response?.status === 404) {
            setNotFound(true);
          } else {
            setNotFound(true);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    const pageUrl = `${window.location.origin}/${username}`;

    if (profile) {
      const displayName = profile.username || profile.email || username;
      const description =
        profile.bio || `Ссылки пользователя @${displayName} — Linktree Clone`;

      setPageMeta({
        title: `@${displayName} | Linktree Clone`,
        description,
        url: pageUrl,
        image: profile.avatar_url || undefined,
      });
    } else if (notFound) {
      setPageMeta({
        title: '404 - Profile not found | Linktree Clone',
        description: 'Профиль не найден',
        url: pageUrl,
      });
    }

    return () => {
      resetPageMeta();
    };
  }, [profile, notFound, username]);

  if (loading) {
    return <Spinner />;
  }

  if (notFound || !profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <p className="text-6xl font-bold text-gray-300">404</p>
        <h1 className="mt-2 text-xl font-semibold text-gray-800">Profile not found</h1>
        <p className="mt-2 text-gray-500">
          Пользователь <span className="font-medium">@{username}</span> не существует
        </p>
        <Link
          to="/login"
          className="mt-6 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
        >
          На главную
        </Link>
      </div>
    );
  }

  const displayName = profile.username || profile.email;
  const activeLinks = (profile.links || []).sort(
    (a, b) => a.order_index - b.order_index
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md text-center">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-md"
          />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-500 text-white shadow-md ring-4 ring-white">
            {displayName ? (
              <span className="text-3xl font-bold">{displayName[0].toUpperCase()}</span>
            ) : (
              <UserIcon className="h-12 w-12" />
            )}
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          @{displayName}
        </h1>

        {profile.bio && (
          <p className="mt-3 text-base leading-relaxed text-gray-600">{profile.bio}</p>
        )}

        <div className="mt-8">
          {activeLinks.length === 0 ? (
            <p className="text-gray-400">Пока нет активных ссылок</p>
          ) : (
            activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-3 block w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition hover:bg-blue-600 active:scale-[0.98]"
              >
                {link.title}
              </a>
            ))
          )}
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Создано на Linktree Clone
        </p>
      </div>
    </div>
  );
}

export default PublicProfile;
