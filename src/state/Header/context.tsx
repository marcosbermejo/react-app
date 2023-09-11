import { createContext } from "react";

interface IHeaderContext {
  previous: string,
  title: string,
  updateTitle: (title: string) => void
  updatePrevious: (path: string) => void
}

export const HeaderContext = createContext<IHeaderContext>({
  previous: '',
  title: '',
  updateTitle: () => {},
  updatePrevious: () => {}
});
