import * as React from 'react'
import { FormikProps } from 'formik'
import * as ReactMarkdown from 'react-markdown'
import { Interfaces } from '@arragro/cms-management'

import SortableItems from '@arragro/cms-management/dist/src/components/Arrays/SortableItems'

import { ICloudBannerText } from '../../interfaces'
import SortableCloudBannerTextForm from './SortableCloudBannerTextForm'
import { cloudBannerTextYup } from '../../../utils'

const SortableClouds: React.FunctionComponent<Interfaces.ISortableListProps<ICloudBannerText>> = (props) => {
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

    return <SortableItems
                {...props}
                getItemHeader={getItemHeader}
                getForm={getForm}
                validationSchema={cloudBannerTextYup}
            />
}

export default SortableClouds
