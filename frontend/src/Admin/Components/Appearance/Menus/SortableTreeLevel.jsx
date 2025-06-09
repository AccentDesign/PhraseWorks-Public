import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const SortableTreeLevel = ({ items, children }) => {
  return (
    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      {children}
    </SortableContext>
  );
};
export default SortableTreeLevel;
