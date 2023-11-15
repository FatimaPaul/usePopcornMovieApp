import { useState } from "react";

export function useLocalStorage(key) {
  const [value, setValue] = useState(function () {
    const stored = localStorage.getItem(key);
    return JSON.parse(stored);
  });

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return [value, setValue];
}
