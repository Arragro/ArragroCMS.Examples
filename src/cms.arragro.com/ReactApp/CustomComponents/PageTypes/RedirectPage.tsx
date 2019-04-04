import * as React from 'react'
import Grid from '@material-ui/core/Grid'
import { FormikProps, Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Interfaces, utils } from '@arragro/cms-management'

import { CustomContentTypeBase } from '@arragro/cms-management/dist/src/components/ComponentTypeExtentions/CustomTypeBase'
import TextBox from '@arragro/cms-management/dist/src/components/FormikControls/TextBox/async'
import CustomBubble from '@arragro/cms-management/dist/src/components/FormikControls/CustomBubble'

const { makeEmptyString } = utils.Helpers

export interface IRedirectPageForm {
    redirectUrl: string
}

export default class RedirectPage extends CustomContentTypeBase {

    constructor (props: Interfaces.IComponentType) {
        super(props)
    }

    yup = Yup.object().shape({
        redirectUrl: Yup.string()
            .required('Please supply a Redirect Url.')
            .max(2000, 'Redirect Url has a 2000 character limit.')
            .matches(utils.isValidUrl)
    })

    public render () {
        const {
            culture,
            contentData
        } = this.props
        const contentJson = contentData.contentJson

        const getInitialValues = (): IRedirectPageForm => {
            if (contentJson && contentJson[culture] !== undefined) {
                return {
                    redirectUrl: makeEmptyString(contentJson[culture].redirectUrl)
                }
            }
            return {
                redirectUrl: ''
            }
        }

        const initialValues = getInitialValues()

        return <Formik
            ref={(x: Formik<IRedirectPageForm>) => this.formik = x}
            initialValues={getInitialValues()}
            isInitialValid={this.yup.isValidSync(initialValues)}
            onSubmit={() => null}
            validationSchema={this.yup}
            render={({ submitCount, handleBlur, handleChange, values, errors, dirty, isValid, setFieldValue }: FormikProps<IRedirectPageForm>) => (
                <Form>
                    <CustomBubble dirty={dirty} isValid={isValid} onChange={this.onCustomBubbleChange} />

                    <Grid container>
                        <Grid item xs={12} md={6}>

                            <TextBox
                                type='text'
                                name='redirectUrl'
                                label='Redirect Url'
                                value={values.redirectUrl}
                            />

                        </Grid>
                    </Grid>
                </Form>
            )}
        />
    }
}
