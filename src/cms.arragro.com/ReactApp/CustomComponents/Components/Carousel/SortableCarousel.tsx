import * as React from 'react'
import { FormikProps } from 'formik'
import { Interfaces } from '@arragro/cms-management'
import { SortableItems } from '@arragro/cms-management/dist/src/components'

import { ICarousel } from '../../interfaces'
import SortableCarouselForm from './SortableCarouselForm'
import { carouselYup } from '../../../utils'

const SortableCarousel: React.FunctionComponent<Interfaces.ISortableListProps<ICarousel>> = (props) => {
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

    return <SortableItems
                {...props}
                getItemHeader={getItemHeader}
                getForm={getForm}
                validationSchema={carouselYup}
            />
}

export default SortableCarousel
