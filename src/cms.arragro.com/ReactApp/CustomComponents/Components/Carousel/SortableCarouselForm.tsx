import * as React from 'react'
import { FormikProps } from 'formik'

import { ICarousel } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

import { Components, Interfaces, utils } from '@arragro/cms-management'

const { TextBox, CheckBox } = Components.FormikControls
const { makeEmptyString } = utils.Helpers
const { Aux } = utils

interface SortableListProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<ICarousel>
    saveStashedIncomplete? (): void
}

const SortableCarousel: React.StatelessComponent<SortableListProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete
    } = props

    const getHasLinkInputs = () => {
        if (formikBag.values.hasLink) {
            return <Aux>
                <MarkdownEditor
                    contentData={contentData}
                    name='linkText'
                    label='Link Text'
                    value={formikBag.values.linkText}
                    error={formikBag.errors.linkText}
                    submitCount={formikBag.submitCount}
                    handleBlur={formikBag.handleBlur}
                    setFieldValue={formikBag.setFieldValue}
                    showAssetPicker={false}
                    saveStashedIncomplete={saveStashedIncomplete}
                />

                <TextBox
                    type='text'
                    name='href'
                    label='Href'
                    value={makeEmptyString(formikBag.values.href)}
                />

            </Aux>
        }
        return null
    }

    return <Aux>

        <TextBox
            type='text'
            name='name'
            label='Name'
            value={makeEmptyString(formikBag.values.name)}
        />

        <Components.AssetPicker
            name='imageUrl'
            label='Slide Image'
            contentData={contentData}
            selectedAsset={formikBag.values.imageUrl}
            dropzoneAccept='image/*'
            mimeTypeFilter='image/*'
            maxSize={10485760}
            showResize={true}
            onChange={formikBag.setFieldValue}
            value={formikBag.values.imageUrl}
            error={formikBag.errors.imageUrl}
            submitCount={formikBag.submitCount}
            saveStashedIncomplete={saveStashedIncomplete}
        />

        <TextBox
            type='text'
            name='imageAlt'
            label='Image Alt Text'
            value={makeEmptyString(formikBag.values.imageAlt)}
        />

        <CheckBox
            name='hasLink'
            label='Has Link'
            checked={formikBag.values.hasLink}
            value={formikBag.values.hasLink.toString()}
        />

        {getHasLinkInputs()}

    </Aux>
}

export default SortableCarousel
