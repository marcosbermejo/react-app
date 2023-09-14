import { ReactNode, useState } from "react";
import { HeaderContext } from "./context";

export default function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string>('');

  return (
    <HeaderContext.Provider value={{
      title,
      updateTitle: (newTitle: string) => setTitle(newTitle),      
    }}>
      {children}
    </HeaderContext.Provider>
  );
}