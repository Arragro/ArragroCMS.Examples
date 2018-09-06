import * as React from 'react'
import { FormikProps } from 'formik'
import { Components, Interfaces } from 'arragrocms-management'

import { ICarousel } from '../../interfaces'
import SortableCarouselForm from './SortableCarouselForm'
import { carouselYup } from 'ReactApp/utils'

const SortableCarousel: React.SFC<Interfaces.ISortableListProps<ICarousel>> = (props) => {
    const getItemHeader = (item: ICarousel) => {
        if (item.name &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return null
    }

    const getForm = (formikBag: FormikProps<ICarousel>) => {
        return <SortableCarouselForm
            contentData={props.contentData}
            saveStashedIncomplete={props.saveStashedIncomplete}
            formikBag={formikBag}
        />
    }

    return <Components.SortableItems
                {...props}
                getItemHeader={getItemHeader}
                getForm={getForm}
                validationSchema={carouselYup}
            />
}

export default SortableCarousel
