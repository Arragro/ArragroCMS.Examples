import * as React from 'react'
import * as Formsy from 'formsy-react'
import * as FRC from 'formsy-react-components'
import { Components, utils } from 'arragrocms-management'

import MarkdownEditor from '../../MarkdownEditor'
import { IContact } from '../../interfaces'

const { Input } = FRC

interface SortableContactFormProps {
    contentUrlRouteId: string
    index: number
    item: IContact
    onChange (name: string, value: string): void
}

Formsy.addValidationRule('isPhoneNumber', (values: any, value: string) => {
    if (value !== null) {
        if (value.length === 0) {
            return true
        }
        return /^\+?\d{7,13}$/i.test(value)
    }
    return true
});

utils.LoadCustomValidationRules();

const SortableContactForm: React.StatelessComponent<SortableContactFormProps> = (props) => {
    
    return <div>
        <Input
            type='text'
            name='title'
            label='Title'
            onChange={props.onChange}
            value={utils.Helpers.makeEmptyString(props.item.title)}
            required
            validations={{
                maxLength: 100
            }}
            validationErrors={{
                maxLength: 'There is a 100 character limit to this field.'
            }}
        />

        <Input
            type='text'
            name='name'
            label='Name'
            onChange={props.onChange}
            value={utils.Helpers.makeEmptyString(props.item.name)}
            required
            validations={{
                maxLength: 100
            }}
            validationErrors={{
                maxLength: 'There is a 100 character limit to this field.'
            }}
        />

        <Input
            type='text'
            name='phoneNumber'
            label='Phone Number'
            onChange={props.onChange}
            value={utils.Helpers.makeEmptyString(props.item.phoneNumber)}
            required
            validations={{
                maxLength: 20
            }}
            validationErrors={{
                maxLength: 'There is a 20 character limit to this field.'
            }}
        />
        
        <Input
            type='text'
            name='email'
            label='Email'
            onChange={props.onChange}
            value={utils.Helpers.makeEmptyString(props.item.email)}
            validations={{
                isEmail: 1,
                maxLength: 100,

            }}
            validationErrors={{
                isEmail: 'Please supply a valid Email Address',
                maxLength: 'There is a 100 character limit to this field'
            }}
        />

        <Input
            type='text'
            name='linkedIn'
            label='LinkedIn'
            onChange={props.onChange}
            value={utils.Helpers.makeEmptyString(props.item.linkedIn)}
            required
            validations={{
                isValidUrl: 1,
                maxLength: 255
            }}
            validationErrors={{
                isValidUrl: 'Please supply a valid Url',
                maxLength: 'There is a 255 character limit to this field.'
            }}
        />

        <Components.AssetPicker
            name='gravitar'
            label='Gravitar'
            selectedAsset={props.item.gravitar}
            contentUrlRouteId={props.contentUrlRouteId}
            dropzoneAccept='image/jpeg,image/pjpeg,image/png,image/gif'
            mimeTypeFilter='image/jpeg,image/pjpeg,image/png,image/gif'
            maxSize={10485760}
            showResize={true}
            onChange={props.onChange}
            value={props.item.gravitar}
        />

        <MarkdownEditor
            contentDataUrlRouteId={props.contentUrlRouteId}
            name='bio'
            label='Bio'
            value={utils.Helpers.makeEmptyString(props.item.bio)}
            onChange={props.onChange}
            showAssetPicker={true}
        />

    </div>
}

export default SortableContactForm
