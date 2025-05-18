import { useSelector } from "react-redux";

const useLangPath = () => {
  const {language} = useSelector((state) => state.theme);

  const getPath = (path = "") => {
    if (!language) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `/${language}/${cleanPath}`;
  };

  return getPath;
};

export default useLangPath;
