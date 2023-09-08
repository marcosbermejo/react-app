import { ReactNode, createContext, useState } from "react";

interface IHeaderContext {
  previous?: string,
  title: string,
  updateTitle: (title: string) => void
  updatePrevious: (path: string) => void
}

export const HeaderContext = createContext<IHeaderContext>({
  title: '',
  updateTitle: () => {},
  updatePrevious: () => {}
});

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>('');
  const [previous, setPrevious] = useState<string | undefined>();

  return (
    <HeaderContext.Provider value={{
      title,
      previous,
      updateTitle: (title: string) => setTitle(title),
      updatePrevious: (path: string) => setPrevious(path)
    }}>
      {children}
    </HeaderContext.Provider>
  );
}