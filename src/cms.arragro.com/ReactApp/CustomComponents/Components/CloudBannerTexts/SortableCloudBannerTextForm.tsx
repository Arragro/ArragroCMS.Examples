import * as React from 'react'
import { FormikProps } from 'formik'
import { Interfaces } from '@arragro/cms-management'

import { ICloudBannerText } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

interface SortableCloudBannerTextFormProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<ICloudBannerText>
    saveStashedIncomplete? (): void
}

const SortableCloudBannerTextForm: React.FunctionComponent<SortableCloudBannerTextFormProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete
    } = props

    return <React.Fragment>

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

    </React.Fragment>
}

export default SortableCloudBannerTextForm
