import React, { useCallback } from "react"
import { Box, BoxProps, Button, Text } from "@artsy/palette"
import { useDropzone } from "react-dropzone"
import { useFormikContext } from "formik"
import { Media } from "v2/Utils/Responsive"
import { useSystemContext } from "v2/System"
import { Photo, normalizePhoto, uploadPhoto } from "../../Utils/FileUtils"

export interface UploadPhotosFormModel {
  photos: Photo[]
}

export interface UploadPhotosFormProps extends BoxProps {}

export const UploadPhotosForm: React.FC<UploadPhotosFormProps> = ({
  ...rest
}) => {
  const { relayEnvironment } = useSystemContext()
  const { setFieldValue, values } = useFormikContext<UploadPhotosFormModel>()

  const handlePhotoUploadingProgress = (photo: Photo) => progress => {
    photo.progress = progress

    setFieldValue("photos", values.photos)
  }

  const handlePhotoUploaded = (photo: Photo) => key => {
    photo.s3Key = key

    setFieldValue("photos", values.photos)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const photos = acceptedFiles.map(normalizePhoto)

    if (relayEnvironment) {
      photos.forEach(photo => {
        uploadPhoto(
          relayEnvironment,
          photo,
          handlePhotoUploadingProgress(photo)
        ).then(handlePhotoUploaded(photo))
      })
    }

    setFieldValue("photos", [...values.photos, ...photos])
  }, [])

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: ["image/jpeg", "image/png"],
    noClick: true,
    noKeyboard: true,
    multiple: false,
  })

  return (
    <Box {...rest}>
      <Box
        data-test-id="image-dropzone"
        px={[2, 4]}
        pt={[4, 6]}
        pb={[6, 80]}
        border="1px solid"
        borderColor="black10"
        {...getRootProps()}
      >
        <input {...getInputProps()} />

        <Media greaterThan="xs">
          <Text variant="lg">Drag and drop photos here</Text>
        </Media>
        <Media at="xs">
          <Text variant="lg">Add photos here</Text>
        </Media>

        <Text variant="md" color="black60" mt={1}>
          Files supported: JPG, PNG
        </Text>
        <Text variant="md" color="black60" mt={1}>
          Maximum size: 30 MB
        </Text>
        <Button mt={4} variant="secondaryOutline" onClick={open}>
          Add Photo
        </Button>
      </Box>
    </Box>
  )
}