import * as React from 'react'
import { FormikProps } from 'formik'

import { ICarousel } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

import { Components, Interfaces, utils } from 'arragrocms-management'

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
                    id='href'
                    label='Href'
                    value={makeEmptyString(formikBag.values.href)}
                    error={formikBag.errors.href}
                    submitCount={formikBag.submitCount}
                    handleBlur={formikBag.handleBlur}
                    handleChange={formikBag.handleChange}
                />

            </Aux>
        }
        return null
    }

    return <Aux>

        <TextBox
            type='text'
            id='name'
            label='Name'
            value={makeEmptyString(formikBag.values.name)}
            error={formikBag.errors.name}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <Components.AssetPicker
            id='imageUrl'
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
            id='imageAlt'
            label='Image Alt Text'
            value={makeEmptyString(formikBag.values.imageAlt)}
            error={formikBag.errors.imageAlt}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <CheckBox
            id='hasLink'
            label='Has Link'
            checked={formikBag.values.hasLink}
            value={formikBag.values.hasLink.toString()}
            error={formikBag.errors.hasLink}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        {getHasLinkInputs()}

    </Aux>
}

export default SortableCarousel
