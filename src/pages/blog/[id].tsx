import Header from "@/components/header";
import { client } from "../../libs/client";
import Image from "next/image";

interface Blog {
    title: string;
    publishedAt: string;
    eyecatch: {
        url: string;
    };
}

interface Content {
    id: string;
}

interface Context {
    params: {
        id: string;
    }
}

export default function BlogId({ blog }: { blog: Blog }) {
    return (
        <>
            <Header />
            <main>
                <h1>{blog.title}</h1>
                <p>{blog.publishedAt}</p>
                <Image src={blog.eyecatch.url} width={360} height={240} alt="アイキャッチの画像"/>
            </main>
        </>
    );
}

// 静的生成のためのパスを指定します
export const getStaticPaths = async () => {
    const data = await client.get({ endpoint: "blogs" });

    const paths = data.contents.map((content: Content) => `/blog/${content.id}`);
    return { paths, fallback: false };
};

// データをテンプレートに受け渡す部分の処理を記述します
export const getStaticProps = async (context: Context) => {
    const id = context.params.id;
    const data = await client.get({ endpoint: "blogs", contentId: id });

    return {
        props: {
            blog: data,
        },
    };
};
