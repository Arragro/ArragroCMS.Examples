import * as React from 'react'
import { FormikProps } from 'formik'
import MarkdownEditor from '../../MarkdownEditor'
import { Interfaces, utils, Components } from 'arragrocms-management'

import { ISvgIconLink } from '../../interfaces'

const { TextBox, Select } = Components.FormikControls
const { makeEmptyString } = utils.Helpers
const { Aux } = utils

interface SortableListProps {
    contentData: Interfaces.IContentData
    formikBag: FormikProps<ISvgIconLink>
    saveStashedIncomplete? (): void
}

const selectOptions = [
    { value: 'fal fa-code', label: 'Code' },
    { value: 'fal fa-lightbulb', label: 'Lightbulb' },
    { value: 'fal fa-cloud', label: 'Cloud' },
    { value: 'fal fa-dollar-sign', label: 'Dollar' }
]

const singleSelectOptions = [
    { value: '', label: 'Please select...' },
    ...selectOptions
]

const SortableSvgIcon: React.StatelessComponent<SortableListProps> = (props) => {
    const {
        contentData,
        formikBag
    } = props

    return <Aux>

            <TextBox
                type='text'
                id='title'
                label='Title'
                value={makeEmptyString(formikBag.values.title)}
                error={formikBag.errors.title}
                submitCount={formikBag.submitCount}
                handleBlur={formikBag.handleBlur}
                handleChange={formikBag.handleChange}
            />

            <Select
                id='svg'
                label='Select SVG'
                items={singleSelectOptions}
                value={makeEmptyString(formikBag.values.svg)}
                error={formikBag.errors.svg}
                submitCount={formikBag.submitCount}
                handleChange={formikBag.handleChange}
            />

            <TextBox
                type='text'
                id='href'
                label='Href'
                value={makeEmptyString(formikBag.values.href)}
                error={formikBag.errors.href}
                submitCount={formikBag.submitCount}
                handleBlur={formikBag.handleBlur}
                handleChange={formikBag.handleChange}
            />

            <MarkdownEditor
                contentData={contentData}
                name='markdown'
                label='Markdown'
                value={formikBag.values.markdown}
                error={formikBag.errors.markdown}
                submitCount={formikBag.submitCount}
                handleBlur={formikBag.handleBlur}
                setFieldValue={formikBag.setFieldValue}
                showAssetPicker={false}
                saveStashedIncomplete={props.saveStashedIncomplete}
            />

        </Aux>
}

export default SortableSvgIcon
