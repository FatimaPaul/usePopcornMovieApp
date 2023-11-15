import { useEffect, useRef } from "react";

export default function Navbar({ children, query, setQuery, onClose }) {
  //  useRef
  const myRefInp = useRef(null);
  // console.log(myRefInp);

  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === myRefInp.current) return;
        if (e.code === "Enter") {
          myRefInp.current.focus();
          onClose();
          setQuery("");
        }
      }
      myRefInp.current.focus();

      document.addEventListener("keydown", callback);
      // myRefInp.current.addEventListener("click", () => console.log("clicked"));

      // cleanup function
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [setQuery]
  );

  // Not react way of selecting dom elements
  // useEffect(
  //   function () {
  //     const s = document.querySelector(".search");
  //     console.log(s);
  //     s.focus();
  //   },
  //   [query]
  // );

  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1 ref={myRefInp}>usePopcorn</h1>
      </div>
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={myRefInp}
      />
      {children}
    </nav>
  );
}
