import * as React from 'react'
import * as Formsy from 'formsy-react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components, htmlHelper, helpers } from 'arragrocms-management'

import { IContact } from '../interfaces'
import SortableContacts from '../Components/Contacts/SortableContacts'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Checkbox, Textarea } = FRC

Formsy.addValidationRule('isPhoneNumber', (values, value) => {
    if (value !== null) {
        if (value.length === 0) {
            return true
        }
        return /^\+?\d{7,13}$/i.test(value)
    }
    return true
});

const contactPageHelper = {
    newContact: (): IContact => {
        return {
            title: '',
            name: '',
            phoneNumber: '',
            gravitar: '',
            bio: ''
        }
    },

    newContacts: (): Array<IContact> => {
        return new Array<IContact>()
    }
}


export interface IContactPageState {
    addressLine1: string
    addressLine2: string
    city: string
    district: string
    country: string
    postCode: string
    officeTelephone: string
    contacts: Array<IContact>
    latitude: number
    longitude: number
    googleMapStyleJson: string
    markdownIntro: string
    markdownOutro: string
    hasContactForm: boolean
}


export default class ContactPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, IContactPageState> {
    constructor(props) {
        super(props)
    }

    sortableContacts: SortableContacts

    public render() {

        const pageData = this.props.contentData.contentJson[this.props.culture] as IContactPageState
        const contactPage = {
            addressLine1: helpers.makeNullEmptyString(pageData.addressLine1),
            addressLine2: helpers.makeNullEmptyString(pageData.addressLine2),
            city: helpers.makeNullEmptyString(pageData.city),
            district: helpers.makeNullEmptyString(pageData.district),
            country: helpers.makeNullEmptyString(pageData.country),
            postCode: helpers.makeNullEmptyString(pageData.postCode),
            officeTelephone: helpers.makeNullEmptyString(pageData.officeTelephone),
            contacts: pageData.contacts === undefined ? [] : pageData.contacts,
            latitude: pageData.latitude === undefined ? '0.00' :
                pageData.latitude.toString().split('.').length === 1 ? `${pageData.latitude}.00` : pageData.latitude,
            longitude: pageData.longitude === undefined ? '0.00' :
                pageData.longitude.toString().split('.').length === 1 ? `${pageData.longitude}.00` : pageData.longitude,
            googleMapStyleJson: helpers.makeNullEmptyString(pageData.googleMapStyleJson),
            markdownIntro: helpers.makeNullEmptyString(pageData.markdownIntro),
            markdownOutro: helpers.makeNullEmptyString(pageData.markdownOutro),
            hasContactForm: pageData.hasContactForm === undefined ? false : pageData.hasContactForm
        }

        return (
            <div className='row col-12'>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='addressLine1'
                        label='Address line 1'
                        required
                        onChange={this.onChange}
                        value={contactPage.addressLine1}
                        validations={{
                            maxLength: 100
                        }}
                        validationErrors={{
                            maxLength: 'There is a 100 character limit to this field'
                        }}
                    />
                </div>  
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='addressLine2'
                        label='Address line 2'
                        onChange={this.onChange}
                        value={contactPage.addressLine2}
                        validations={{
                            maxLength: 100
                        }}
                        validationErrors={{
                            maxLength: 'There is a 100 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='city'
                        label='City'
                        required
                        onChange={this.onChange}
                        value={contactPage.city}
                        validations={{
                            maxLength: 100
                        }}
                        validationErrors={{
                            maxLength: 'There is a 100 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='district'
                        label='District'
                        onChange={this.onChange}
                        value={contactPage.district}
                        validations={{
                            maxLength: 100
                        }}
                        validationErrors={{
                            maxLength: 'There is a 100 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='country'
                        label='Country'
                        onChange={this.onChange}
                        value={contactPage.country}
                        validations={{
                            maxLength: 100
                        }}
                        validationErrors={{
                            maxLength: 'There is a 100 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='postCode'
                        label='Post Code'
                        onChange={this.onChange}
                        value={contactPage.postCode}
                        required
                        validations={{
                            maxLength: 10
                        }}
                        validationErrors={{
                            maxLength: 'There is a 10 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-6'>
                    <Input
                        type='number'
                        name='officeTelephone'
                        label='Office Telephone'
                        onChange={this.onChange}
                        value={contactPage.officeTelephone}
                        validations={{
                            maxLength: 20
                        }}
                        validationErrors={{
                            maxLength: 'There is a 20 character limit to this field'
                        }}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters full-width-buttons'>
                    <SortableContacts
                        ref={x => this.sortableContacts = x}
                        contentUrlRouteId={this.props.contentData.urlRouteId}
                        name='contacts'
                        label="Contacts"
                        contacts={contactPage.contacts}
                        newItem={contactPageHelper.newContact()}
                        onChange={this.onChange}
                        maxContacts={5}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-lg-6'>
                    <Input
                        type='number'
                        name='latitude'
                        label='Latitude'
                        onChange={this.onChange}
                        value={contactPage.latitude}
                        validations={{
                            maxLength: 10
                        }}
                        validationErrors={{
                            maxLength: 'There is a 10 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-6'>
                    <Input
                        type='number'
                        name='longitude'
                        label='Longitude'
                        onChange={this.onChange}
                        value={contactPage.longitude}
                        validations={{
                            maxLength: 10
                        }}
                        validationErrors={{
                            maxLength: 'There is a 10 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-12'>
                    <Textarea
                        name='googleMapStyleJson'
                        label='Google Map Json'
                        onChange={this.onChange}
                        value={contactPage.googleMapStyleJson}
                        rows={8}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-lg-12'>
                    <MarkdownEditor
                        contentDataUrlRouteId={this.props.contentData.urlRouteId}
                        name='markdownIntro'
                        label='Markdown Intro'
                        value={contactPage.markdownIntro}
                        onChange={this.onChange}
                        showAssetPicker={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-lg-12'>
                    <MarkdownEditor
                        contentDataUrlRouteId={this.props.contentData.urlRouteId}
                        name='markdownOutro'
                        label='Markdown Outro'
                        value={contactPage.markdownOutro}
                        onChange={this.onChange}
                        showAssetPicker={true}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters'>
                    <Checkbox
                        name='hasContactForm'
                        label='Has Contact Form'
                        onChange={this.onChange}
                        value={contactPage.hasContactForm}
                    />
                </div>
            </div>
        )
    }
}