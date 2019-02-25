import * as React from 'react'
import { FormikProps, FormikErrors, yupToFormErrors } from 'formik'
import * as Yup from 'yup'
import { Components, Interfaces } from '@arragro/cms-management'
import TagSelectorForm, { tagSelectorSchema } from './CustomComponents/Fields/Admin/TagSelector'

enum ArragroCmsAssemblies {
    TagSelector = 'ArragroCMS.Web.Management.TagSelector'
}

export class ArragroCMSAdminFieldControlExtender extends Components.DefaultAdminFieldControlExtenderBase implements Components.IAdminFieldControlExtender {
    constructor () {
        super()
    }

    public getInputForm (formikBag: FormikProps<Interfaces.IFieldDto>, fullName: string) {
        let form = this.getInputFormBase(formikBag, fullName, false)
        if (form === undefined) {
            switch (fullName) {
            case ArragroCmsAssemblies.TagSelector:
                form = <TagSelectorForm formikBag={formikBag} />
            }
        }
        if (form === undefined) {
            throw new Error(`Field ${fullName} isn't catered for.`)
        }
        return form
    }

    public getFieldTypeLabel (fullName: string) {
        let label = this.getFieldTypeLabelBase(fullName) as string
        if (label === null) {
            switch (fullName) {
            case ArragroCmsAssemblies.TagSelector:
                label = 'Tag Selector'
            }
        }
        if (label === null) {
            throw new Error(`Field ${fullName} isn't catered for.`)
        }
        return label
    }

    protected getValidationSchema (fieldDto: Interfaces.IFieldDto): Yup.ObjectSchema<any> {
        let schema = this.GetValidationSchemaBase(fieldDto)
        if (schema === null) {
            switch (fieldDto.fullName) {
            case ArragroCmsAssemblies.TagSelector:
                schema = tagSelectorSchema
            }
        }
        if (schema === null) {
            throw new Error(`Field ${fieldDto.fullName} isn't catered for.`)
        }
        return schema
    }

    public validateField (fieldDto: Interfaces.IFieldDto): FormikErrors<Interfaces.IFieldDto> {
        let schema = Yup.object().shape({
            fieldId: Yup.string().required('Please supply a fieldId')
        })

        if (fieldDto.fullName !== undefined) {
            schema = this.getValidationSchema(fieldDto)
        }

        try {
            schema.validateSync(fieldDto, { abortEarly: false })
        } catch (errors) {
            return yupToFormErrors(errors)
        }
        return {} as FormikErrors<Interfaces.IFieldDto>
    }

}
