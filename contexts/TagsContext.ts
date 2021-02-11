import { createContext, Dispatch, SetStateAction } from "react";
type tagContextState = {
  tagsContext: string[];
  setTagsContext: Dispatch<SetStateAction<string[]>>;
};

const TagsContext = createContext<tagContextState>(null);

export default TagsContext;
