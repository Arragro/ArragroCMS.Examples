import * as React from 'react'
import { FormikProps } from 'formik'
import { Components, Interfaces } from 'arragrocms-management'

import { ITile } from '../../interfaces'
import SortableTileForm from './SortableTileForm'
import { tileYup } from 'ReactApp/utils'

interface SortableTilesProps extends Interfaces.ISortableListProps<ITile> {
    linkIsMandatory: boolean
    useMarkdown: boolean
}

const SortableTiles: React.SFC<SortableTilesProps> = (props) => {
    const getItemHeader = (item: ITile) => {
        if (item.name &&
            item.name !== null &&
            item.name.length > 0) {
            return <span>{item.name}</span>
        }
        return <span></span>
    }

    const getForm = (formikBag: FormikProps<ITile>) => {
        return <SortableTileForm
            contentData={props.contentData}
            saveStashedIncomplete={props.saveStashedIncomplete}
            formikBag={formikBag}
            linkIsMandatory={props.linkIsMandatory}
            useMarkdown={props.useMarkdown}
        />
    }

    return <Components.SortableItems
                {...props}
                getItemHeader={getItemHeader}
                getForm={getForm}
                validationSchema={tileYup}
            />
}

export default SortableTiles
