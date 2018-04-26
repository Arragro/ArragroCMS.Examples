import * as React from 'react'
import { Interfaces } from 'arragrocms-management'

import { ICloudBannerText } from '../../interfaces'
import MarkdownEditor from '../../MarkdownEditor'

interface SortableCloudBannerTextFormProps {
    contentData: Interfaces.IContentData
    index: number
    item: ICloudBannerText
    onChange (name: string, value: string): void
}

const SortableCloudBannerTextForm: React.StatelessComponent<SortableCloudBannerTextFormProps> = (props) => {

    return <div>

        <MarkdownEditor
            contentData={props.contentData}
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
