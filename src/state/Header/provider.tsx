import { ReactNode, useState } from "react";
import { HeaderContext } from "./context";

export default function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>('');
  const [previous, setPrevious] = useState<string>('');

  return (
    <HeaderContext.Provider value={{
      title,
      previous,
      updateTitle: (newTitle: string) => setTitle(newTitle),
      updatePrevious: (newPath: string) => setPrevious(newPath)
    }}>
      {children}
    </HeaderContext.Provider>
  );
}