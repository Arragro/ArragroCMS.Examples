import * as React from 'react'
import * as Formsy from 'formsy-react'
import * as FRC from 'formsy-react-components'
import { Interfaces, Components, utils } from 'arragrocms-management'

import { IContact } from '../interfaces'
import SortableContacts from '../Components/Contacts/SortableContacts'
import MarkdownEditor from '../MarkdownEditor'

const { Input, Checkbox, Textarea } = FRC

Formsy.addValidationRule('isPhoneNumber', (values: any, value: string) => {
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
            email: '',
            linkedIn: '',
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
    officeEmail: string
    contacts: Array<IContact>
    latitude: number
    longitude: number
    googleMapStyleJson: string
    markdownIntro: string
    markdownOutro: string
    hasContactForm: boolean
}


export default class ContactPage extends Components.StateManagedComponentTypeBase<Interfaces.IComponentTypeBaseProps, IContactPageState> {
    sortableContacts: SortableContacts | null = null

    constructor(props: Interfaces.IComponentTypeBaseProps) {
        super(props)
    }

    public render() {
        if (this.props.culture === null) {
            return null
        }
        const pageData = (this.props.contentData.contentJson as any)[this.props.culture] as IContactPageState
        const contactPage = {
            addressLine1: utils.Helpers.makeEmptyString(pageData.addressLine1),
            addressLine2: utils.Helpers.makeEmptyString(pageData.addressLine2),
            city: utils.Helpers.makeEmptyString(pageData.city),
            district: utils.Helpers.makeEmptyString(pageData.district),
            country: utils.Helpers.makeEmptyString(pageData.country),
            postCode: utils.Helpers.makeEmptyString(pageData.postCode),
            officeTelephone: utils.Helpers.makeEmptyString(pageData.officeTelephone),
            officeEmail: utils.Helpers.makeEmptyString(pageData.officeEmail),
            contacts: pageData.contacts === undefined ? [] : pageData.contacts,
            latitude: pageData.latitude === undefined ? '0.00' :
                pageData.latitude.toString().split('.').length === 1 ? `${pageData.latitude}.00` : pageData.latitude,
            longitude: pageData.longitude === undefined ? '0.00' :
                pageData.longitude.toString().split('.').length === 1 ? `${pageData.longitude}.00` : pageData.longitude,
            googleMapStyleJson: utils.Helpers.makeEmptyString(pageData.googleMapStyleJson),
            markdownIntro: utils.Helpers.makeEmptyString(pageData.markdownIntro),
            markdownOutro: utils.Helpers.makeEmptyString(pageData.markdownOutro),
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
                        type='text'
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
                <div className='col-lg-6'>
                    <Input
                        type='text'
                        name='officeEmail'
                        label='Office Email'
                        onChange={this.onChange}
                        value={contactPage.officeEmail}
                        validations={{
                            isEmail: 1,
                            maxLength: 100,

                        }}
                        validationErrors={{
                            isEmail: 'Please supply a valid Email Address',
                            maxLength: 'There is a 100 character limit to this field'
                        }}
                    />
                </div>
                <hr className='col-12' />
                <div className='col-12 no-gutters full-width-buttons'>
                    <SortableContacts
                        ref={(x: SortableContacts | null) => this.sortableContacts = x}
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
                        value={contactPage.latitude.toString()}
                        validations={{
                            maxLength: 15
                        }}
                        validationErrors={{
                            maxLength: 'There is a 15 character limit to this field'
                        }}
                    />
                </div>
                <div className='col-lg-6'>
                    <Input
                        type='number'
                        name='longitude'
                        label='Longitude'
                        onChange={this.onChange}
                        value={contactPage.longitude.toString()}
                        validations={{
                            maxLength: 15
                        }}
                        validationErrors={{
                            maxLength: 'There is a 15 character limit to this field'
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
