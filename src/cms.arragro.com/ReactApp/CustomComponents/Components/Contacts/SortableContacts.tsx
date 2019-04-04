import * as React from 'react'
import { FormikProps } from 'formik'
import { Interfaces } from '@arragro/cms-management'
import SortableItems from '@arragro/cms-management/dist/src/components/Arrays/SortableItems'

import { IContact } from '../../interfaces'
import SortableContactForm from './SortableContactForm'
import { contactYup } from '../../../utils'

const SortableContacts: React.FunctionComponent<Interfaces.ISortableListProps<IContact>> = (props) => {
    const getItemHeader = (item: IContact) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return <span></span>
    }

    const getForm = (formikBag: FormikProps<IContact>) => {
        return <SortableContactForm
            contentData={props.contentData}
            saveStashedIncomplete={props.saveStashedIncomplete}
            formikBag={formikBag}
        />
    }

    return <SortableItems
        {...props}
        getItemHeader={getItemHeader}
        getForm={getForm}
        validationSchema={contactYup}
    />
}

export default SortableContacts
