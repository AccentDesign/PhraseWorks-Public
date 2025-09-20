import { Link } from 'react-router-dom';

const CategoriesBlock = ({ post }) => {
  return (
    <div className="flex flex-row flex-wrap items-center my-4">
      {post?.categories?.map((category, idx) => (
        <Link
          key={idx}
          to={`/category/${category.slug}`}
          className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};

export default CategoriesBlock;
