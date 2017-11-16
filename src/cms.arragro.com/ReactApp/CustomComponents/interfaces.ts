export interface ICarousel extends IItemType {
    name: string
    imageUrl: string
    imageAlt: string
    hasLink: boolean
    linkText: string
    href: string
}

export interface ICloud extends IItemType {
    name: string
    svgBased: boolean
    svgIcon: string
    imageUrl: string
    imageAlt: string
    markdown: string
    hasLink: boolean
    linkText: string
    href: string
}

export interface IRandomCarousel {
    carousels: Array<ICarousel>
}

export interface ICloudBannerText {
    markdown: string
}

export interface ISvgIconLink {
    title: string
    svg: string
    href: string
    markdown: string
}

export interface IItemType {
    name: string
}
