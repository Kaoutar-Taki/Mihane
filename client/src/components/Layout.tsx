import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div
      className="
        min-h-screen
        text-gray-800
        bg-gray-50
      "
    >
      <header
        className="  p-4 mb-10 bg-white shadow justify-between items-center flex
        "
      >
        <div />
        <h2
          className="
            text-3xl font-extrabold text-gray-800 text-center
          "
        >
          <Link to="/"> Digital Business Cards</Link>
        </h2>
        <Link to="/upload">
          <img
            src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"
            alt="Profile"
            className="
              object-cover
              w-12 h-12
              rounded-full
              shadow-lg
            "
          />
        </Link>
      </header>
      <main
        className="
          p-6
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
