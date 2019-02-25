import * as React from 'react'
import { FormikProps } from 'formik'

import MarkdownEditor from '../../MarkdownEditor'
import { IContact } from '../../interfaces'

import { Components, Interfaces, utils } from '@arragro/cms-management'

const { TextBox } = Components.FormikControls
const { makeEmptyString } = utils.Helpers
const { Aux } = utils

interface SortableContactFormProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<IContact>
    saveStashedIncomplete? (): void
}

const SortableContactForm: React.StatelessComponent<SortableContactFormProps> = (props) => {
    const {
        contentData,
        formikBag,
        saveStashedIncomplete
    } = props

    return <Aux>

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

        <Components.AssetPicker
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

    </Aux>
}

export default SortableContactForm
