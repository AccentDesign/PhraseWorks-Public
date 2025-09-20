import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ item, children, className }) => {
  if (!item.id) {
    console.error('SortableItem: `id` is undefined. Each item must have a unique ID.');
    return null;
  }
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
    data: {
      ...item,
      data: { ...item, isHandle: false },
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={className}>
      <div className="flex-1">
        {typeof children === 'function' ? children({ listeners, attributes }) : children}
      </div>
    </div>
  );
};
export default SortableItem;
