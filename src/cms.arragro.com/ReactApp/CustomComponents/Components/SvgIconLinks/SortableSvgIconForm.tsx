import * as React from 'react'
import { FormikProps } from 'formik'
import MarkdownEditor from '../../MarkdownEditor'
import { Interfaces, utils, Components } from '@arragro/cms-management'

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
                name='title'
                label='Title'
                value={makeEmptyString(formikBag.values.title)}
            />

            <Select
                name='svg'
                label='Select SVG'
                placeholder='Please select an SVG'
                options={singleSelectOptions}
                value={{ label: makeEmptyString(formikBag.values.svg), value: makeEmptyString(formikBag.values.svg) }}
            />

            <TextBox
                type='text'
                name='href'
                label='Href'
                value={makeEmptyString(formikBag.values.href)}
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
