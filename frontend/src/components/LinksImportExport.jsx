import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

function LinksImportExport({ links, onImportComplete }) {
  const handleExport = () => {
    const exportData = links.map(({ title, url, order_index, is_active }) => ({
      title,
      url,
      order_index,
      is_active,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `links-export-${Date.now()}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        throw new Error('JSON должен быть массивом ссылок');
      }

      await onImportComplete(parsed);
    } catch {
      alert('Не удалось импортировать файл. Проверьте формат JSON.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleExport}
        disabled={links.length === 0}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      >
        <ArrowDownTrayIcon className="h-4 w-4" />
        Экспорт в JSON
      </button>

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-indigo-600 px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950">
        <ArrowUpTrayIcon className="h-4 w-4" />
        Импорт из JSON
        <input
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default LinksImportExport;
