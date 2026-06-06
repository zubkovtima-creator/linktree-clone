import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Bars3Icon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

function SortableLinkItem({ link, onEdit, onDelete, onToggle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg border bg-white px-3 py-3 dark:bg-gray-800 ${
        link.is_active
          ? 'border-gray-200 dark:border-gray-600'
          : 'border-gray-200 bg-gray-50 opacity-70 dark:border-gray-700 dark:bg-gray-900'
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-gray-400 hover:text-gray-600 active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label="Перетащить"
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{link.title}</p>
        <p className="truncate text-sm text-gray-500">{link.url}</p>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          checked={link.is_active}
          onChange={() => onToggle(link)}
          className="peer sr-only"
        />
        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </label>

      <button
        type="button"
        onClick={() => onEdit(link)}
        className="rounded p-1.5 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
        aria-label="Редактировать"
      >
        <PencilIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => onDelete(link.id)}
        className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
        aria-label="Удалить"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </li>
  );
}

function LinkList({ links, onEdit, onDelete, onToggle, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((link) => link.id === active.id);
    const newIndex = links.findIndex((link) => link.id === over.id);

    const reordered = arrayMove(links, oldIndex, newIndex).map((link, index) => ({
      ...link,
      order_index: index,
    }));

    onReorder(reordered);
  };

  if (links.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center dark:border-gray-700">
        <p className="text-gray-500">Ссылок пока нет</p>
        <p className="mt-1 text-sm text-gray-400">Добавьте первую ссылку через форму слева</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2">
          {links.map((link) => (
            <SortableLinkItem
              key={link.id}
              link={link}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

export default LinkList;
