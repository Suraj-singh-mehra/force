import React, { FC, useRef, useState } from "react"
import { Formik, FormikHelpers } from "formik"
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Join,
  ModalDialog,
  PhoneInput,
  Separator,
  Spacer,
  Text,
  TextArea,
} from "@artsy/palette"
import * as Yup from "yup"
import { createSavedSearchAlert } from "./Mutations/createSavedSearchAlert"
import { useCreateAdvisoryOpportunity } from "./Mutations/useCreateAdvisoryOpportunity"
import { useSystemContext } from "System/useSystemContext"
import { Aggregations } from "Components/ArtworkFilter/ArtworkFilterContext"
import createLogger from "Utils/logger"
import {
  SavedSearchAlertContextProvider,
  useSavedSearchAlertContext,
} from "./SavedSearchAlertContext"
import {
  FilterPill,
  HearFromArtsyAdvisorFormValues,
  SavedSearchAlertFormValues,
  SavedSearchAlertMutationResult,
  SavedSearchEntity,
  SearchCriteriaAttributeKeys,
  SearchCriteriaAttributes,
} from "./types"
import { SavedSearchAlertPills } from "./Components/SavedSearchAlertPills"
import { Metric } from "Utils/metrics"
import { DEFAULT_FREQUENCY } from "./constants"
import { FrequenceRadioButtons } from "./Components/FrequencyRadioButtons"
import { PriceRangeFilter } from "Components/SavedSearchAlert/Components/PriceRangeFilter"
import { ConfirmationStepModal } from "Components/SavedSearchAlert/ConfirmationStepModal"
import { useFeatureFlag } from "System/useFeatureFlag"
import { SavedSearchAlertNameInputQueryRenderer } from "Components/SavedSearchAlert/Components/SavedSearchAlertNameInput"
import { validatePhoneNumber } from "Components/PhoneNumberInput"
import { useUserPhoneNumber } from "Components/SavedSearchAlert/useUserPhoneNumber"
import { DetailsInput } from "Components/SavedSearchAlert/Components/DetailsInput"
import { countries } from "Utils/countries"

interface SavedSearchAlertFormProps {
  entity: SavedSearchEntity
  initialValues: SavedSearchAlertFormValues
  onClose: () => void
  onCreateAlert?: (result: SavedSearchAlertMutationResult) => void
}

export interface SavedSearchAlertFormContainerProps
  extends SavedSearchAlertFormProps {
  visible?: boolean
  criteria: SearchCriteriaAttributes
  metric?: Metric
  aggregations: Aggregations | undefined
  /** Artwork ID, if the current alert is being set from an artwork */
  currentArtworkID?: string
  onComplete?: () => void
}

const logger = createLogger("Components/SavedSearchAlert/SavedSearchAlertModal")

export const SavedSearchAlertModal: FC<SavedSearchAlertFormProps> = ({
  entity,
  initialValues,
  onClose,
  onCreateAlert,
}) => {
  const { relayEnvironment } = useSystemContext()
  const { pills, criteria, removeCriteriaValue } = useSavedSearchAlertContext()

  const isHearFromArtsyAdvisorEnabled = useFeatureFlag(
    "onyx_advisory-opportunity-in-saved-search"
  )
  const { phone, regionCode } = useUserPhoneNumber()
  const advisoryOpportunitySectionScrollRef = useRef<HTMLDivElement>(null)
  const {
    submitMutation: submitCreateAdvisoryOpportunity,
  } = useCreateAdvisoryOpportunity()

  const handleRemovePillPress = (pill: FilterPill) => {
    if (pill.isDefault) {
      return
    }

    removeCriteriaValue(pill.field as SearchCriteriaAttributeKeys, pill.value)
  }

  const handleSubmit = async (
    values: SavedSearchAlertFormValues & HearFromArtsyAdvisorFormValues,
    helpers: FormikHelpers<
      SavedSearchAlertFormValues & HearFromArtsyAdvisorFormValues
    >
  ) => {
    if (!relayEnvironment) {
      return null
    }

    const userAlertSettings: SavedSearchAlertFormValues = {
      name: values.name || "",
      email: values.email,
      push: values.push,
      frequency: values.push ? values.frequency : DEFAULT_FREQUENCY,
      details: values.details,
    }

    try {
      const response = await createSavedSearchAlert(
        relayEnvironment,
        userAlertSettings,
        criteria
      )

      const result = {
        id: response.createSavedSearch?.savedSearchOrErrors.internalID,
      }

      if (values.hearFromArtsyAdvisor && result.id) {
        await submitCreateAdvisoryOpportunity({
          variables: {
            input: {
              searchCriteriaID: result.id,
              message: values.message,
              phoneNumber: values.phoneNumber,
              phoneCountryCode: values.phoneCountryCode,
            },
          },
          rejectIf: res => {
            if (
              res.createAdvisoryOpportunity?.advisoryOpportunityOrError
                ?.mutationError
            ) {
              const message =
                res.createAdvisoryOpportunity.advisoryOpportunityOrError
                  .mutationError.message

              helpers.setFieldError("phoneNumber", message)

              return true
            }
          },
        })
      }
      onCreateAlert?.(result)
    } catch (error) {
      logger.error(error)
    }
  }

  return (
    <Formik<SavedSearchAlertFormValues & HearFromArtsyAdvisorFormValues>
      initialValues={{
        message: "",
        hearFromArtsyAdvisor: false,
        phoneNumber: phone,
        phoneCountryCode: regionCode,
        ...initialValues,
      }}
      enableReinitialize
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape({
        phoneNumber: Yup.string()
          .test({
            name: "phone-number-is-valid",
            message: "Please enter a valid phone number",
            test: (national, context) => {
              if (!context.parent.hearFromArtsyAdvisor) return true

              if (!national || !national.length) {
                return false
              }

              return validatePhoneNumber({
                national,
                regionCode: `${context.parent.phoneCountryCode || "US"}`,
              })
            },
          })
          .notRequired(),
        phoneCountryCode: Yup.string().notRequired(),
      })}
    >
      {({
        values,
        errors,
        isSubmitting,
        handleSubmit,
        handleChange,
        handleBlur,
        touched,
        setFieldValue,
        isValid: isPhoneValid,
      }) => {
        // Require one method of contact to be selected
        const hasSelectedContactMethod =
          values.email || values.push || values.hearFromArtsyAdvisor

        return (
          <ModalDialog
            onClose={onClose}
            title="Create Alert"
            data-testid="CreateAlertModal"
            footer={
              <Button
                disabled={!hasSelectedContactMethod || !isPhoneValid}
                loading={isSubmitting}
                onClick={() => handleSubmit()}
                width="100%"
              >
                Save Alert
              </Button>
            }
          >
            <Join separator={<Spacer y={2} />}>
              <SavedSearchAlertNameInputQueryRenderer />
              <Box>
                <Text variant="xs">Filters</Text>
                <Spacer y={1} />
                <Flex flexWrap="wrap" gap={1}>
                  <SavedSearchAlertPills
                    items={pills}
                    onDeletePress={handleRemovePillPress}
                  />
                </Flex>
                <Separator my={2} />
                <PriceRangeFilter expanded={false} />
                <Separator my={2} />
                <DetailsInput />
                <Separator my={2} />
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between">
                  <Text variant="sm-display">Email Alerts</Text>
                  <Checkbox
                    onSelect={selected => setFieldValue("email", selected)}
                    selected={values.email}
                  />
                </Box>
                <Spacer y={4} />
                <Box display="flex" justifyContent="space-between">
                  <Text variant="sm-display">Mobile Alerts</Text>
                  <Checkbox
                    onSelect={selected => {
                      setFieldValue("push", selected)

                      // Restore default frequency when "Mobile Alerts" is unselected
                      if (!selected) {
                        setFieldValue("frequency", DEFAULT_FREQUENCY)
                      }
                    }}
                    selected={values.push}
                  />
                </Box>

                {values.push && (
                  <>
                    <Spacer y={2} />
                    <FrequenceRadioButtons
                      defaultFrequence={values.frequency}
                      onSelect={selectedOption =>
                        setFieldValue("frequency", selectedOption)
                      }
                    />
                  </>
                )}

                <Spacer y={2} />

                {isHearFromArtsyAdvisorEnabled && (
                  <>
                    <Spacer y={4} />
                    <Box display="flex" justifyContent="space-between">
                      <Text variant="sm-display">
                        Hear from an Artsy Advisor
                      </Text>
                      <Checkbox
                        onSelect={selected => {
                          setFieldValue("hearFromArtsyAdvisor", selected)
                          // Scroll the newly revealed (or not) section into view.
                          // Use `setTimeout` to ensure the scroll happens after
                          // the section is rendered.
                          setTimeout(() => {
                            if (advisoryOpportunitySectionScrollRef?.current) {
                              advisoryOpportunitySectionScrollRef.current.scrollIntoView(
                                {
                                  behavior: "smooth",
                                }
                              )
                            }
                          })
                        }}
                        selected={values.hearFromArtsyAdvisor}
                      />
                    </Box>

                    {values.hearFromArtsyAdvisor && (
                      <>
                        <Spacer y={2} />

                        <PhoneInput
                          options={countries}
                          mt={4}
                          required
                          name="phoneNumber"
                          placeholder="(000) 000 0000"
                          inputValue={values.phoneNumber}
                          dropdownValue={values.phoneCountryCode}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          onSelect={option => {
                            setFieldValue("phoneCountryCode", option.value)
                          }}
                          error={errors.phoneCountryCode || errors.phoneNumber}
                        />

                        <Spacer y={2} />

                        <TextArea
                          onChange={({ value }) => {
                            setFieldValue("message", value)
                          }}
                          placeholder="Tell us more about what you're looking for."
                          value={values.message}
                        />

                        <Box ref={advisoryOpportunitySectionScrollRef as any} />
                      </>
                    )}
                  </>
                )}
              </Box>
            </Join>
          </ModalDialog>
        )
      }}
    </Formik>
  )
}

export const SavedSearchAlertModalContainer: React.FC<SavedSearchAlertFormContainerProps> = props => {
  const {
    visible,
    entity,
    criteria,
    metric,
    aggregations,
    currentArtworkID,
    onCreateAlert,
    onComplete,
  } = props

  const [searchCriteriaId, setSearchCriteriaId] = useState("")
  const [step, setStep] = useState<"CREATE_ALERT" | "CONFIRMATION">(
    "CREATE_ALERT"
  )

  const handleCreateAlert = (result: SavedSearchAlertMutationResult) => {
    if (result.id) {
      setSearchCriteriaId(result.id)
    }
    onCreateAlert?.(result)
    setStep("CONFIRMATION")
  }

  const handleComplete = () => {
    onComplete?.()
    setStep("CREATE_ALERT")
  }

  if (!visible) return null

  switch (step) {
    case "CREATE_ALERT":
      return (
        <SavedSearchAlertContextProvider
          criteria={criteria}
          aggregations={aggregations}
          entity={entity}
          metric={metric}
          currentArtworkID={currentArtworkID}
        >
          <SavedSearchAlertModal {...props} onCreateAlert={handleCreateAlert} />
        </SavedSearchAlertContextProvider>
      )
    case "CONFIRMATION":
      return (
        <SavedSearchAlertContextProvider
          criteria={criteria}
          aggregations={aggregations}
          entity={entity}
          metric={metric}
          currentArtworkID={currentArtworkID}
        >
          <ConfirmationStepModal
            onClose={handleComplete}
            searchCriteriaId={searchCriteriaId}
          />
        </SavedSearchAlertContextProvider>
      )
  }
}
