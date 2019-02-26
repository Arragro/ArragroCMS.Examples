import * as React from 'react'
import { Grid } from '@material-ui/core'
import { Formik, FormikProps, Form } from 'formik'
import * as Yup from 'yup'
import { Components, Interfaces, utils } from '@arragro/cms-management'

import { IContact } from '../interfaces'
import SortableContacts from '../Components/Contacts/SortableContacts'
import MarkdownEditor from '../MarkdownEditor'
import { isValidPhoneNumber, contactYup } from '../../utils'
import { Hr } from '../../helpers'

const { CustomContentTypeBase } = Components
const { CustomBubble, TextBox, TextArea, CheckBox } = Components.FormikControls
const { makeEmptyString, makeDefaultString } = utils.Helpers

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

export interface IContactForm {
    addressLine1: string
    addressLine2: string
    city: string
    district: string
    country: string
    postCode: string
    officeTelephone: string
    officeEmail: string
    contacts: Array<IContact>
    latitude: string
    longitude: string
    googleMapStyleJson: string
    markdownIntro: string
    markdownOutro: string
    hasContactForm: boolean
}

export default class ContactPage extends CustomContentTypeBase {

    constructor (props: Interfaces.IComponentType) {
        super(props)

        this.onOfficeTelephoneChange = this.onOfficeTelephoneChange.bind(this)
    }

    onOfficeTelephoneChange (event: React.ChangeEvent<HTMLInputElement>) {
        const {
            name,
            value
        } = event.target

        if (value.length === 0) {
            this.onChange(name, null)
        } else {
            this.onChange(name, value)
        }
    }

    yup = Yup.object().shape({
        addressLine1: Yup.string()
            .max(100, 'Address Line 1 has a 100 character limit.')
            .required('Please supply Address Line 1.'),
        addressLine2: Yup.string()
            .max(100, 'Address Line 2 has 100 character limit.'),
        city: Yup.string()
            .max(100, 'City has a 100 character limit.')
            .required('Please supply a City.'),
        district: Yup.string()
            .max(100, 'District has a 100 character limit.'),
        county: Yup.string()
            .max(100, 'County has a 100 character limit.'),
        postCode: Yup.string()
            .max(10, 'Post Code has a 10 character limit.'),
        officeTelephone: Yup.string()
            .nullable(true)
            .max(20, 'Post Code has a 10 character limit.')
            .matches(isValidPhoneNumber, { message: 'Please supply a valid telephone number.', excludeEmptyString: true }),
        officeEmail: Yup.string()
            .max(100, 'Office Email has a 100 character limit.')
            .required('Please supply an Office Email.')
            .email('Please supple a valid Office Email.'),
        contacts: Yup.array(contactYup),
        latitude: Yup.number(),
        longitude: Yup.number(),
        googleMapStyleJson: Yup.string(),
        markdownIntro: Yup.string().max(2000, 'Markdown Intro has a 2000 character limit.'),
        markdownOutro: Yup.string().max(2000, 'Markdown Outro has a 2000 character limit.'),
        hasContactForm: Yup.bool()
    })

    public render () {
        const {
            culture,
            contentData
        } = this.props
        const contentJson = contentData.contentJson

        const getInitialValues = (): IContactForm => {
            if (contentJson && contentJson[culture] !== undefined) {
                return {
                    addressLine1: makeEmptyString(contentJson[culture].addressLine1),
                    addressLine2: makeEmptyString(contentJson[culture].addressLine2),
                    city: makeEmptyString(contentJson[culture].city),
                    district: makeEmptyString(contentJson[culture].district),
                    country: makeEmptyString(contentJson[culture].country),
                    postCode: makeEmptyString(contentJson[culture].postCode),
                    officeTelephone: makeEmptyString(contentJson[culture].officeTelephone),
                    officeEmail: makeEmptyString(contentJson[culture].officeEmail),
                    contacts: !contentJson[culture].contacts ? [] : contentJson[culture].contacts,
                    latitude: makeDefaultString(contentJson[culture].latitude, '0.00'),
                    longitude: makeDefaultString(contentJson[culture].longitude, '0.00'),
                    googleMapStyleJson: makeEmptyString(contentJson[culture].googleMapStyleJson),
                    markdownIntro: makeEmptyString(contentJson[culture].markdownIntro),
                    markdownOutro: makeEmptyString(contentJson[culture].markdownOutro),
                    hasContactForm: !contentJson[culture] ? false : contentJson[culture].hasContactForm
                }
            }
            return {
                addressLine1: '',
                addressLine2: '',
                city: '',
                district: '',
                country: '',
                postCode: '',
                officeTelephone: '',
                officeEmail: '',
                contacts: [],
                latitude: '0.00',
                longitude: '0.00',
                googleMapStyleJson: '',
                markdownIntro: '',
                markdownOutro: '',
                hasContactForm: false
            }
        }

        const initialValues = getInitialValues()
        const contentRulesExceptionListContainers = this.getContentRulesExceptionListContainers()

        return <Formik
            ref={(x: Formik<IContactForm>) => this.formik = x}
            initialValues={getInitialValues()}
            isInitialValid={this.yup.isValidSync(initialValues)}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, values, errors, dirty, isValid, setFieldValue }: FormikProps<IContactForm>) => (
                <Form>
                    <CustomBubble dirty={dirty} isValid={isValid} onChange={this.onCustomBubbleChange} />

                    <Grid container>
                        <Grid item xs={12} md={6}>

                            <TextBox
                                type='text'
                                name='addressLine1'
                                label='Address line 1'
                                value={values.addressLine1}
                            />

                            <TextBox
                                type='text'
                                name='addressLine1'
                                label='Address line 2'
                                value={values.addressLine2}
                            />

                            <TextBox
                                type='text'
                                name='city'
                                label='City'
                                value={values.city}
                            />

                            <TextBox
                                type='text'
                                name='district'
                                label='District'
                                value={values.district}
                            />

                            <TextBox
                                type='text'
                                name='country'
                                label='Country'
                                value={values.country}
                            />

                            <TextBox
                                type='text'
                                name='postCode'
                                label='Post Code'
                                value={values.postCode}
                            />

                            <TextBox
                                type='text'
                                name='officeTelephone'
                                label='Office Telephone'
                                value={values.officeTelephone}
                            />

                            <TextBox
                                type='text'
                                name='officeEmail'
                                label='Office Email'
                                value={values.officeEmail}
                            />

                            <Hr />

                            <SortableContacts
                                name='contacts'
                                typeName='Contact'
                                contentData={this.props.contentData}
                                items={values.contacts}
                                newItem={contactPageHelper.newContact()}
                                rulesExceptionListContainers={contentRulesExceptionListContainers}
                                onChange={setFieldValue}
                                getName={(item: IContact) => item.name}
                                maxNumberOfItems={5}
                            />

                            <Hr />

                            <TextBox
                                type='number'
                                name='latitude'
                                label='Latitude'
                                value={values.latitude}
                            />

                            <TextBox
                                type='number'
                                name='longitude'
                                label='Longitude'
                                value={values.longitude}
                            />

                            <TextArea
                                name='googleMapStyleJson'
                                label='Google Map Json'
                                value={values.googleMapStyleJson}
                            />

                        </Grid>
                    </Grid>

                    <MarkdownEditor
                        contentData={this.props.contentData}
                        name='markdownIntro'
                        label='Markdown Intro'
                        value={makeEmptyString(values.markdownIntro)}
                        showAssetPicker={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                    <MarkdownEditor
                        contentData={this.props.contentData}
                        name='markdownOutro'
                        label='Markdown Outro'
                        value={makeEmptyString(values.markdownOutro)}
                        showAssetPicker={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                    <CheckBox
                        name='hasContactForm'
                        label='Has Contact Form'
                        checked={values.hasContactForm}
                        value='hasContactForm'
                    />

                </Form>
            )}>
            </Formik>
    }
}
