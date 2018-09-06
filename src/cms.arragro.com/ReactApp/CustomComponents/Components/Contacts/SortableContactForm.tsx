import * as React from 'react'
import { FormikProps } from 'formik'

import MarkdownEditor from '../../MarkdownEditor'
import { IContact } from '../../interfaces'

import { Components, Interfaces, utils } from 'arragrocms-management'

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
            id='title'
            label='Title'
            value={makeEmptyString(props.formikBag.values.title)}
            error={formikBag.errors.title}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <TextBox
            type='text'
            id='name'
            label='Name'
            value={makeEmptyString(props.formikBag.values.name)}
            error={formikBag.errors.name}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <TextBox
            type='text'
            id='phoneNumber'
            label='Phone Number'
            value={makeEmptyString(props.formikBag.values.phoneNumber)}
            error={formikBag.errors.phoneNumber}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <TextBox
            type='email'
            id='phoneNumber'
            label='Email'
            value={makeEmptyString(props.formikBag.values.email)}
            error={formikBag.errors.email}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <TextBox
            type='email'
            id='linkedIn'
            label='LinkedIn'
            value={makeEmptyString(props.formikBag.values.linkedIn)}
            error={formikBag.errors.linkedIn}
            submitCount={formikBag.submitCount}
            handleBlur={formikBag.handleBlur}
            handleChange={formikBag.handleChange}
        />

        <Components.AssetPicker
            id='gravitar'
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
