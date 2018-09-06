import * as React from 'react'
import { FormikProps } from 'formik'
import { Components } from 'arragrocms-management'
import { ISortableListProps } from 'arragrocms-management/dist/types/interfaces'

import { ISvgIconLink } from '../../interfaces'
import SortableSvgIconForm from './SortableSvgIconForm'
import { svgIconLinkYup } from 'ReactApp/utils'

const SortableCarousel: React.SFC<ISortableListProps<ISvgIconLink>> = (props) => {
    const getItemHeader = (item: ISvgIconLink) => {
        if (item.title.length > 0) {
            return <span>{item.title}</span>
        }
        return <span></span>
    }

    const getForm = (formikBag: FormikProps<ISvgIconLink>) => {
        return <SortableSvgIconForm
            contentData={props.contentData}
            saveStashedIncomplete={props.saveStashedIncomplete}
            formikBag={formikBag}
        />
    }

    return <Components.SortableItems
                {...props}
                getItemHeader={getItemHeader}
                getForm={getForm}
                validationSchema={svgIconLinkYup}
            />
}

export default SortableCarousel
