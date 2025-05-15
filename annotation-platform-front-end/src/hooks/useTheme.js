import useThemeStore from '../store/themeStore';

const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();
  return { theme, toggleTheme };
};

export default useTheme;