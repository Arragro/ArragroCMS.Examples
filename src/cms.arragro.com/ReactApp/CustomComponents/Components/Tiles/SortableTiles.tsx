import * as React from 'react'
import { FormikProps } from 'formik'
import { Interfaces } from '@arragro/cms-management'

import SortableItems from '@arragro/cms-management/dist/src/components/Arrays/SortableItems'

import { ITile } from '../../interfaces'
import SortableTileForm from './SortableTileForm'
import { tileYup } from '../../../utils'

interface SortableTilesProps extends Interfaces.ISortableListProps<ITile> {
    linkIsMandatory: boolean
    useMarkdown: boolean
}

const SortableTiles: React.FunctionComponent<SortableTilesProps> = (props) => {
    const getItemHeader = (item: ITile) => {
        if (item.name &&
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

    return <SortableItems
                {...props}
                getItemHeader={getItemHeader}
                getForm={getForm}
                validationSchema={tileYup}
            />
}

export default SortableTiles
