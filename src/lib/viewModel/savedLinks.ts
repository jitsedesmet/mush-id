export interface SavedLinks {
    version: string;
    links: SavedLink[];
}
export interface SavedLink {
    link: string;
    creationDate: Date;
}
