import * as React from 'react'
import * as Yup from 'yup'
import { Formik, Form, FormikProps } from 'formik'
import { Interfaces, Components, utils } from 'arragrocms-management'

const { CustomBubble, TextBox } = Components.FormikControls
const { makeEmptyString } = utils.Helpers

export interface IMarkdownConfigurationState {
    testData: string
    version: number
}

interface IMarkdownConfigurationForm {
    testData: string
}

export default class MarkdownConfiguration extends Components.CustomConfigurationTypeBase {
    constructor (props: Interfaces.ICustomControl) {
        super(props)

        if (this.props.contentData) {
            if (this.props.contentData.configurationJson) {
                const configurationJson = this.props.contentData.configurationJson as any
                const testData = configurationJson.testData !== undefined ? configurationJson.testData : ''
                const version = configurationJson.version !== undefined ? configurationJson.version : -1
                this.state = {
                    testData: testData,
                    version: version
                }
            } else {
                this.state = this.defaultStandardPage
            }
        }
    }

    yup = Yup.object().shape({
        testData: Yup.string()
            .required('Please supply Test Data')
    })

    defaultStandardPage: IMarkdownConfigurationState = {
        testData: '',
        version: -1
    }

    public render () {
        const {
            contentData,
            edit
        } = this.props

        const initialValues: IMarkdownConfigurationForm = {
            testData: makeEmptyString(contentData.configurationJson && contentData.configurationJson.testData)
        }

        const isInitialValid = this.yup.isValidSync(initialValues)

        return <Formik
            ref={(x: Formik<IMarkdownConfigurationForm, any>) => this.formik = x}
            initialValues={initialValues}
            isInitialValid={edit && isInitialValid}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, values, errors, dirty, isValid }: FormikProps<IMarkdownConfigurationForm>) => (
                <Form>
                    <CustomBubble dirty={dirty} isValid={isValid} onChange={this.onCustomBubbleChange} />

                    <TextBox
                        type='text'
                        id={'testData'}
                        label='Test Data'
                        // required
                        value={values.testData}
                        error={errors.testData}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                    />
                </Form>
            )}
        />
    }
}
