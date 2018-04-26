import * as React from 'react'

import { ICloudBannerText } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

interface SortableCloudBannerTextFormProps {
    contentUrlRouteId: string
    index: number
    item: ICloudBannerText
    onChange (name: string, value: string): void
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
