import { MyCollectionArtworkFormImagesProps } from "Apps/MyCollection/Routes/EditArtwork/Components/MyCollectionArtworkFormImages"
import { createContext, Ref, useContext } from "react"

interface MyCollectionArtworkFormContextProps {
  artworkFormImagesRef: Ref<MyCollectionArtworkFormImagesProps> | undefined
  onBack: () => void
}

export const MyCollectionArtworkFormContext = createContext<
  MyCollectionArtworkFormContextProps
>({
  artworkFormImagesRef: undefined,
  onBack: () => {},
})

export const MyCollectionArtworkFormContextProvider: React.FC<MyCollectionArtworkFormContextProps> = ({
  children,
  ...rest
}) => {
  return (
    <MyCollectionArtworkFormContext.Provider value={rest}>
      {children}
    </MyCollectionArtworkFormContext.Provider>
  )
}

export const useMyCollectionArtworkFormContext = () => {
  const myCollectionArtworkFormContext =
    useContext(MyCollectionArtworkFormContext) ?? {}
  return myCollectionArtworkFormContext
}