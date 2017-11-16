import * as React from 'react'
import * as FRC from 'formsy-react-components'
import * as ReactSortableHOC from 'react-sortable-hoc'
import { Components } from 'arragrocms-management'

import { ICloudBannerText } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

const { Input, Checkbox, Textarea } = FRC

interface SortableCloudBannerTextFormProps {
    contentUrlRouteId: string
    index: number
    item: ICloudBannerText
    onChange (name: string, value: string)    
}

const SortableCloudBannerTextForm: React.StatelessComponent<SortableCloudBannerTextFormProps> = (props) => {

    return <div>

        <MarkdownEditor
            contentDataUrlRouteId={props.contentUrlRouteId}
            name='markdown'
            label='Markdown'
            value={props.item.markdown}
            onChange={props.onChange}
            showAssetPicker={false}
            required
        />

    </div>
}

export default SortableCloudBannerTextForm