
import * as React from 'react'
import { FormikProps } from 'formik'
import * as Yup from 'yup'

import { Grid } from '@material-ui/core'
import { Interfaces, utils, Components } from '@arragro/cms-management'

export const tagSelectorSchema = Yup.object().shape({
    fieldId: Yup.string().required('Please supply a fieldId'),
    name: Yup.string()
             .required('Please supply a name')
             .max(100, 'There is a 100 character limit to this field.')
             .matches(/^[A-Za-z][A-Za-z0-9-_]+$/, 'Please supply a name starting with a character, followed by alpha numeric with _ or -, no spaces.'),
    label: Yup.string()
             .nullable(true)
             .max(100, 'There is a 100 character limit to this field.'),
    placeholder: Yup.string()
             .nullable(true)
             .max(100, 'There is a 100 character limit to this field.'),
    required: Yup.boolean(),
    multi: Yup.boolean()
})

interface FormProps {
    formikBag: FormikProps<Interfaces.IFieldDto>
}

const TagSelectorForm: React.FunctionComponent<FormProps> = (props) => {
    const {
        formikBag
    } = props

    return <utils.Aux>
        <Components.BaseForm formikBag={formikBag}></Components.BaseForm>
        <Grid container>
            {Components.BaseFormUtils.getField(
                <Components.FormikControls.CheckBox
                    label='Multiple Select?'
                    name='multi'
                    checked={formikBag.values.multi}
                    value={formikBag.values.multi.toString()}
                    disabled={formikBag.isSubmitting}
                />, 6, 3)}
        </Grid>
    </utils.Aux>
}

export default TagSelectorForm
