import * as React from 'react'
import { FormikProps } from 'formik'
import { Components, Interfaces } from '@arragro/cms-management'

import { IContact } from '../../interfaces'
import SortableContactForm from './SortableContactForm'
import { contactYup } from 'ReactApp/utils'

const SortableContacts: React.SFC<Interfaces.ISortableListProps<IContact>> = (props) => {
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

    return <Components.SortableItems
        {...props}
        getItemHeader={getItemHeader}
        getForm={getForm}
        validationSchema={contactYup}
    />
}

export default SortableContacts
