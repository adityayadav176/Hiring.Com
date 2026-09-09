import { createContext, useState } from "react";

export const TitleContext = createContext();

function TitleProvider({ children }) {
  const [title, setTitle] = useState("Overview");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export default TitleProvider;