import { useQueryState } from 'nuqs';

const useSearchKeyword = () => {
  const [keyword, setKeyword] = useQueryState('keyword', {
    defaultValue: '',
  });

  return { keyword, setKeyword };
};

export default useSearchKeyword;
