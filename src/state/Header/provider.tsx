import { ReactNode, useState } from "react";
import { HeaderContext } from "./context";

export default function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>('');
  const [previous, setPrevious] = useState<string>('');

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