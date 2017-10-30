export interface ICarousel extends IItemType {
    name: string
    imageUrl: string
    imageAlt: string
    hasLink: boolean
    linkText: string
    href: string
}

export interface IRandomCarousel {
    carousels: Array<ICarousel>
}

export interface ISvgIconLink {
    title: string
    svg: string
    href: string
}

export interface IItemType {
    name: string
}
