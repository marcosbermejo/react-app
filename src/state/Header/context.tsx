import { createContext } from "react";

interface IHeaderContext {
  title: string,
  updateTitle: (title: string) => void
}

export const HeaderContext = createContext<IHeaderContext>({
  title: '',
  updateTitle: () => {},
});
