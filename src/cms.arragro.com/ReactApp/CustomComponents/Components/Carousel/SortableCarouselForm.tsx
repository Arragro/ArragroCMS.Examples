import * as React from 'react'
import { FormikProps } from 'formik'

import { ICarousel } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

import { Interfaces, utils } from '@arragro/cms-management'

import { AssetPicker } from '@arragro/cms-management/dist/src/components/Asset'
import TextBox from '@arragro/cms-management/dist/src/components/FormikControls/TextBox/async'
import CheckBox from '@arragro/cms-management/dist/src/components/FormikControls/CheckBox/async'

const { makeEmptyString } = utils.Helpers

interface SortableListProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<ICarousel>
    saveStashedIncomplete? (): void
}

const SortableCarousel: React.FunctionComponent<SortableListProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete
    } = props

    const getHasLinkInputs = () => {
        if (formikBag.values.hasLink) {
            return <React.Fragment>
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

            </React.Fragment>
        }
        return null
    }

    return <React.Fragment>

        <TextBox
            type='text'
            name='name'
            label='Name'
            value={makeEmptyString(formikBag.values.name)}
        />

        <AssetPicker
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

    </React.Fragment>
}

export default SortableCarousel
