import * as React from 'react'
import { FormikProps } from 'formik'
import * as ReactMarkdown from 'react-markdown'
import { Components, Interfaces } from '@arragro/cms-management'

import { ICloudBannerText } from '../../interfaces'
import SortableCloudBannerTextForm from './SortableCloudBannerTextForm'
import { cloudBannerTextYup } from 'ReactApp/utils'

const SortableClouds: React.SFC<Interfaces.ISortableListProps<ICloudBannerText>> = (props) => {
    const getItemHeader = (item: ICloudBannerText) => {
        return <ReactMarkdown source={item.markdown} escapeHtml={false} />
    }

    const getForm = (formikBag: FormikProps<ICloudBannerText>) => {
        return <SortableCloudBannerTextForm
            contentData={props.contentData}
            saveStashedIncomplete={props.saveStashedIncomplete}
            formikBag={formikBag}
        />
    }

    return <Components.SortableItems
                {...props}
                getItemHeader={getItemHeader}
                getForm={getForm}
                validationSchema={cloudBannerTextYup}
            />
}

export default SortableClouds
