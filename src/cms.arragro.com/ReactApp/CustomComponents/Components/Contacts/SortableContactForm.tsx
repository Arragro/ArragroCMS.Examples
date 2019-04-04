import * as React from 'react'
import { FormikProps } from 'formik'

import MarkdownEditor from '../../MarkdownEditor'
import { IContact } from '../../interfaces'

import { Interfaces, utils } from '@arragro/cms-management'

import AssetPicker from '@arragro/cms-management/dist/src/components/Asset/AssetPicker'
import TextBox from '@arragro/cms-management/dist/src/components/FormikControls/TextBox/async'

const { makeEmptyString } = utils.Helpers

interface SortableContactFormProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<IContact>
    saveStashedIncomplete? (): void
}

const SortableContactForm: React.FunctionComponent<SortableContactFormProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete
    } = props

    return <React.Fragment>

        <TextBox
            type='text'
            name='title'
            label='Title'
            value={makeEmptyString(props.formikBag.values.title)}
        />

        <TextBox
            type='text'
            name='name'
            label='Name'
            value={makeEmptyString(props.formikBag.values.name)}
        />

        <TextBox
            type='text'
            name='phoneNumber'
            label='Phone Number'
            value={makeEmptyString(props.formikBag.values.phoneNumber)}
        />

        <TextBox
            type='email'
            name='phoneNumber'
            label='Email'
            value={makeEmptyString(props.formikBag.values.email)}
        />

        <TextBox
            type='email'
            name='linkedIn'
            label='LinkedIn'
            value={makeEmptyString(props.formikBag.values.linkedIn)}
        />

        <AssetPicker
            name='gravitar'
            label='Gravitar'
            selectedAsset={props.formikBag.values.gravitar}
            contentData={props.contentData}
            dropzoneAccept='image/jpeg,image/pjpeg,image/png,image/gif'
            mimeTypeFilter='image/jpeg,image/pjpeg,image/png,image/gif'
            maxSize={10485760}
            showResize={true}
            onChange={formikBag.setFieldValue}
            value={formikBag.values.gravitar}
            error={formikBag.errors.gravitar}
            submitCount={formikBag.submitCount}
            saveStashedIncomplete={saveStashedIncomplete}
        />

        <MarkdownEditor
            contentData={contentData}
            name='bio'
            label='Bio'
            value={formikBag.values.bio}
            error={formikBag.errors.bio}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            setFieldValue={formikBag.setFieldValue}
            showAssetPicker={false}
            saveStashedIncomplete={props.saveStashedIncomplete}
        />

    </React.Fragment>
}

export default SortableContactForm
