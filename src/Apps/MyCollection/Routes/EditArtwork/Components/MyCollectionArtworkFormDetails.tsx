import {
  Box,
  Clickable,
  Column,
  Flex,
  GridColumns,
  Input,
  LabeledInput,
  Radio,
  RadioGroup,
  Select,
  Text,
  useToasts,
} from "@artsy/palette"
import { ArtworkSidebarClassificationsModalQueryRenderer } from "Apps/Artwork/Components/ArtworkSidebarClassificationsModal"
import { ArtistAutoComplete } from "Apps/Consign/Routes/SubmissionFlow/ArtworkDetails/Components/ArtistAutocomplete"
import { useFormikContext } from "formik"
import { useState } from "react"
import { ArtworkModel } from "../Utils/artworkModel"
import { categoryOptions } from "../Utils/categoryOptions"
import { rarityOptions } from "../Utils/rarityOptions"
import { ProvenanceModal } from "./ProvenanceModal"

export const MyCollectionArtworkFormDetails: React.FC = () => {
  const { sendToast } = useToasts()

  const [isRarityModalOpen, setIsRarityModalOpen] = useState(false)
  const [isProvenanceModalOpen, setIsProvenanceModalOpen] = useState(false)

  const { values, handleChange, setFieldValue, handleBlur } = useFormikContext<
    ArtworkModel
  >()

  const isLimitedEdition = values.attributionClass === "LIMITED_EDITION"

  const handleAutosuggestError = (isError: boolean) => {
    if (isError) {
      sendToast({
        variant: "error",
        message: "An error occurred",
        description: "Please contact support@artsymail.com",
      })

      return
    }

    setFieldValue("artistName", "")
    setFieldValue("artistId", "")
  }

  return (
    <>
      <ArtworkSidebarClassificationsModalQueryRenderer
        onClose={() => setIsRarityModalOpen(false)}
        show={isRarityModalOpen}
        showDisclaimer={false}
      />
      <ProvenanceModal
        onClose={() => setIsProvenanceModalOpen(false)}
        show={isProvenanceModalOpen}
      />

      <GridColumns>
        <Column span={6}>
          <ArtistAutoComplete
            onError={() => handleAutosuggestError(true)}
            required
          />
        </Column>
        <Column span={6} mt={[4, 0]}>
          <Input
            title="Title"
            placeholder="Title"
            name="title"
            required
            maxLength={256}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.title}
          />
        </Column>
      </GridColumns>
      <GridColumns mt={[4, 2]}>
        <Column span={6}>
          <Input
            title="Year"
            maxLength={256}
            placeholder="YYYY"
            name="date"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.date}
          />
        </Column>
        <Column span={6} mt={[4, 0]}>
          <Select
            title="Medium"
            required
            name="category"
            options={categoryOptions}
            selected={values.category}
            onBlur={handleBlur}
            onChange={handleChange}
            onSelect={selected => setFieldValue("category", selected)}
          />
        </Column>
      </GridColumns>
      <GridColumns mt={[4, 2]}>
        <Column span={6}>
          <Input
            title="Materials"
            placeholder="Oil on Canvas, Mixed Media, Lithograph…"
            name="medium"
            maxLength={256}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.medium}
          />
        </Column>
      </GridColumns>
      <GridColumns mt={[4, 2]}>
        <Column span={6}>
          <Flex justifyContent="space-between">
            <Text variant="xs" mb={0.5}>
              Rarity
            </Text>
            <Clickable
              onClick={() => setIsRarityModalOpen(true)}
              data-test-id="open-rarity-modal"
            >
              <Text variant="xs" color="black60">
                <u>What is this?</u>
              </Text>
            </Clickable>
          </Flex>
          <Select
            name="attributionClass"
            options={rarityOptions}
            selected={values.attributionClass}
            onBlur={handleBlur}
            onChange={handleChange}
            onSelect={selected => setFieldValue("attributionClass", selected)}
          />
        </Column>
        <Column span={6}>
          {isLimitedEdition && (
            <Flex alignItems="center" mt={[30, 0]} mb={[1, 0]}>
              <Input
                title="Edition Number"
                placeholder="Your work's #"
                name="editionNumber"
                maxLength={256}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.editionNumber}
              />
              <Box px={[0.5, 2]} mt={2}>
                /
              </Box>
              <Input
                title="Edition Size"
                placeholder="Total # in edition"
                name="editionSize"
                maxLength={256}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.editionSize}
              />
            </Flex>
          )}
        </Column>
      </GridColumns>
      <GridColumns mt={[30, 2]}>
        <Column span={6}>
          <Flex height="100%">
            <Box width="50%" mr={2} height="100%">
              <Text variant="xs" mb={0.5} mr={0.5}>
                Height
              </Text>
              <LabeledInput
                maxLength={256}
                label={values.metric}
                name="height"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.height}
              />
            </Box>
            <Box width="50%" height="100%">
              <Text variant="xs" mb={0.5} mr={0.5}>
                Width
              </Text>
              <LabeledInput
                maxLength={256}
                label={values.metric}
                name="width"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.width}
              />
            </Box>
          </Flex>
        </Column>
        <Column span={6} mt={[4, 0]}>
          <Flex height="100%">
            <Box pr={[0, 1]} width="50%" height="100%">
              <Flex>
                <Text variant="xs" mb={0.5} mr={0.5}>
                  Depth
                </Text>
              </Flex>
              <LabeledInput
                maxLength={256}
                label={values.metric}
                name="depth"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.depth}
              />
            </Box>
            <RadioGroup
              width="50%"
              defaultValue={values.metric}
              flexDirection="row"
              mt={2}
              ml={2}
              pt={0.5}
              alignContent="center"
              onSelect={selected => setFieldValue("metric", selected)}
            >
              <Radio mr={4} value="in" label="in" selected />
              <Radio value="cm" label="cm" />
            </RadioGroup>
          </Flex>
        </Column>
      </GridColumns>
      <GridColumns mt={[30, 2]}>
        <Column span={6}>
          <Flex height="100%">
            <Box mr={2} width="100%" height="100%">
              <Text variant="xs" mb={0.5} mr={0.5}>
                Price Paid
              </Text>
              <LabeledInput
                maxLength={256}
                label={values.pricePaidCurrency}
                name="pricePaidDollars"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.pricePaidDollars}
              />
            </Box>
          </Flex>
        </Column>
        <Column span={6} mt={[4, 0]}>
          <Flex height="100%">
            <RadioGroup
              width="100%"
              defaultValue={values.pricePaidCurrency}
              flexDirection="row"
              mt={2}
              pt={0.5}
              onSelect={selected =>
                setFieldValue("pricePaidCurrency", selected)
              }
            >
              <Radio mr={4} value="USD" label="$&nbsp;USD" selected />
              <Radio mr={4} value="EUR" label="€&nbsp;EUR" />
              <Radio mr={4} value="GBP" label="£&nbsp;GBP" />
            </RadioGroup>
          </Flex>
        </Column>
      </GridColumns>
      <GridColumns mt={[4, 2]}>
        <Column span={6}>
          <Flex justifyContent="space-between">
            <Text variant="xs" mb={0.5}>
              Provenance
            </Text>

            <Clickable
              onClick={() => setIsProvenanceModalOpen(true)}
              data-test-id="open-provenance-modal"
            >
              <Text variant="xs" color="black60">
                <u>What is this?</u>
              </Text>
            </Clickable>
          </Flex>

          <Input
            name="provenance"
            placeholder="Describe how you acquired the work"
            maxLength={256}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.provenance}
          />
        </Column>
        <Column span={6} mt={[4, 0]}>
          <Input
            title="City"
            name="artworkLocation"
            placeholder="City where artwork is located"
            maxLength={256}
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.artworkLocation}
          />
        </Column>

        {/* TODO: Add image uploader */}
      </GridColumns>
    </>
  )
}