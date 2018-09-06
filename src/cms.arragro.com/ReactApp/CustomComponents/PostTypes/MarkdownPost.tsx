import * as React from 'react'
import { Grid } from '@material-ui/core'
import { Formik, Form, FormikProps } from 'formik'
import * as Yup from 'yup'

import MarkdownEditor from '../MarkdownEditor'

import { Components, Interfaces, utils } from 'arragrocms-management'

const { CustomContentTypeBase } = Components
const { CustomBubble, TextBox } = Components.FormikControls
const { makeEmptyString } = utils.Helpers

interface IMarkdownPostForm {
    title: string
    markdown: string
}

export default class MarkdownPost extends CustomContentTypeBase {
    constructor (props: Interfaces.IComponentType) {
        super(props)
    }

    yup = Yup.object().shape({
        title: Yup.string()
            .required('Please supply Title')
            .max(255),
        markdown: Yup.string()
    })

    public render () {
        const {
            edit,
            culture,
            contentData
        } = this.props

        const getInitialValues = () => {
            if (contentData[culture] !== undefined) {
                return {
                    title: makeEmptyString(contentData[culture].title),
                    markdown: makeEmptyString(contentData[culture].markdown)
                }
            }
            return {
                title: '',
                markdown: ''
            }
        }

        return <Formik
            ref={(x: Formik<IMarkdownPostForm, any>) => this.formik = x}
            initialValues={getInitialValues()}
            isInitialValid={edit && this.yup.isValidSync(contentData)}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, setFieldValue, values, errors, dirty, isValid }: FormikProps<IMarkdownPostForm>) => (
                <Form>
                    <CustomBubble dirty={dirty} isValid={isValid} onChange={this.onCustomBubbleChange} />

                    <Grid container>
                        <Grid item xs={12} md={6}>

                            <TextBox
                                type='text'
                                label='Title'
                                id='title'
                                submitCount={submitCount}
                                value={makeEmptyString(values.title)}
                                error={errors.title}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                            />

                        </Grid>
                    </Grid>

                    <MarkdownEditor
                        contentData={this.props.contentData}
                        name='markdown'
                        label='Introduction'
                        value={makeEmptyString(values.markdown)}
                        showAssetPicker={true}
                        saveStashedIncomplete={this.props.saveStashedIncomplete}
                        submitCount={submitCount}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                    />

                </Form>
            )}
        >
        </Formik>
    }
}
