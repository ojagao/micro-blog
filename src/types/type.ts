// APIから取得するデータの型指定

export interface Blogs {
    id: string;
    title: string;
    content: string;
    eyecatch: { url: string };
    category: { name: string };
    tag: { tag: string ,id: string}[];
    updatedAt: string;
    name: string;
}

export interface Categories {
    id: string;
    name: string;
}

export interface Tags {
    id: string;
    tag: string ;
}

export interface AllTags {
    tag: { tag: string ,id: string}[];
}

export interface Context {
    params: { id: string; };
}