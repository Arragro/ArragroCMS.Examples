import * as React from 'react'
import * as FRC from 'formsy-react-components'
import MarkdownEditor from '../../MarkdownEditor'

import { ISvgIconLink } from '../../interfaces'

const { Input, Select } = FRC

interface SortableItemProps<ItemType> {
    contentUrlRouteId: string
    index: number
    item: ItemType
    onChange (name: string, value: string): void
}

const selectOptions = [
    { value: 'fal fa-code', label: 'Code' },
    { value: 'fal fa-lightbulb', label: 'Lightbulb' },
    { value: 'fal fa-cloud', label: 'Cloud' },
    { value: 'fal fa-dollar-sign', label: 'Dollar' }
];

const singleSelectOptions = [
    { value: '', label: 'Please select...' },
    ...selectOptions,
];

const SortableSvgIcon: React.StatelessComponent<SortableItemProps<ISvgIconLink>> = (props) => {
    return <div>
            <Input
                type='text'
                name='title'
                label='Title'
                required
                onChange={props.onChange}
                value={props.item.title}
                validations={{
                    maxLength: 255
                }}
                validationErrors={{
                    maxLength: 'There is a 255 character limit to this field.'
                }}
            />

            <Select
                name="svg"
                label="Select SVG"
                options={singleSelectOptions}
                required
                value={props.item.svg}
                onChange={props.onChange}
            />
            
            <Input
                type='text'
                name='href'
                label='Href'
                onChange={props.onChange}
                value={props.item.href}
                validations={{
                    isUrlRoute: 0,
                    maxLength: 2000
                }}
                validationErrors={{
                    isUrlRoute: 'Please supply a valid url route e.g. "home".',
                    maxLength: 'There is a 2000 character limit to this field.'
                }}
            />

            <MarkdownEditor
                contentDataUrlRouteId={props.contentUrlRouteId}
                name='markdown'
                label='Markdown'
                value={props.item.markdown}
                onChange={props.onChange}
                showAssetPicker={true}
            />
        </div>
}

export default SortableSvgIcon
