import * as React from 'react'
import { FormikProps } from 'formik'
import { Interfaces, utils } from 'arragrocms-management'

const { Aux } = utils

import { ICloudBannerText } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

interface SortableCloudBannerTextFormProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<ICloudBannerText>
    saveStashedIncomplete? (): void
}

const SortableCloudBannerTextForm: React.StatelessComponent<SortableCloudBannerTextFormProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete
    } = props

    return <Aux>

        <MarkdownEditor
            contentData={contentData}
            name='linkText'
            label='Link Text'
            value={formikBag.values.markdown}
            error={formikBag.errors.markdown}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            setFieldValue={formikBag.setFieldValue}
            showAssetPicker={false}
            saveStashedIncomplete={saveStashedIncomplete}
        />

    </Aux>
}

export default SortableCloudBannerTextForm
