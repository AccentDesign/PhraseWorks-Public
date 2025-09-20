const DateBlock = ({ post }) => {
  return (
    <div className="text-gray-500 text-sm flex items-center gap-1">
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        height="200px"
        width="200px"
        className="w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm14 226c0 7.7-6.3 14-14 14h-96c-7.7 0-14-6.3-14-14s6.3-14 14-14h82V128c0-7.7 6.3-14 14-14s14 6.3 14 14v146z"></path>
      </svg>
      <p>
        {post?.post_date &&
          new Date(post.post_date).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
      </p>
    </div>
  );
};

export default DateBlock;
