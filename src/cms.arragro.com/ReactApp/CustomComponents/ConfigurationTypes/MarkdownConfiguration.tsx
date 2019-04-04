﻿import * as React from 'react'
import * as Yup from 'yup'
import { Formik, Form, FormikProps } from 'formik'
import { Interfaces, utils } from '@arragro/cms-management'

import { CustomConfigurationTypeBase } from '@arragro/cms-management/dist/src/components/ComponentTypeExtentions/CustomTypeBase'
import TextBox from '@arragro/cms-management/dist/src/components/FormikControls/TextBox/async'
import CustomBubble from '@arragro/cms-management/dist/src/components/FormikControls/CustomBubble'

const { makeEmptyString } = utils.Helpers

export interface IMarkdownConfigurationState {
    testData: string
    version: number
}

interface IMarkdownConfigurationForm {
    testData: string,
    version: number
}

export default class MarkdownConfiguration extends CustomConfigurationTypeBase<IMarkdownConfigurationForm> {
    constructor (props: Interfaces.IConfigurationType) {
        super(props)

        if (this.props.contentData) {
            if (this.props.contentData.configurationJson) {
                const configurationJson = this.props.contentData.configurationJson
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
            testData: makeEmptyString(contentData.configurationJson && contentData.configurationJson.testData),
            version: -1
        }

        const isInitialValid = this.yup.isValidSync(initialValues)

        return <Formik
            ref={(x: Formik<IMarkdownConfigurationForm>) => this.formik = x}
            initialValues={initialValues}
            isInitialValid={edit && isInitialValid}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, values, errors, dirty, isValid }: FormikProps<IMarkdownConfigurationForm>) => (
                <Form>
                    <CustomBubble dirty={dirty} isValid={isValid} onChange={this.onCustomBubbleChange} />

                    <TextBox
                        type='text'
                        name='testData'
                        label='Test Data'
                        // required
                        value={values.testData}
                    />
                </Form>
            )}
        />
    }
}
