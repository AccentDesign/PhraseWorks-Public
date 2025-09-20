const NotFound = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="flex flex-col items-center text-center">
      <img
        src="/images/pw.svg"
        width="100"
        height="82"
        srcSet="/images/pw.svg 1x, /images/pw.svg 2x"
        className="w-[250px]"
        alt="Logo Image"
        loading="lazy"
      />
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-lg text-gray-600 mt-4">The page you are looking for does not exist.</p>
    </div>
  </div>
);

export default NotFound;
