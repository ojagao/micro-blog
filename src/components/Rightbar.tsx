import React, { useEffect, useRef, useState } from "react";
import styles from "../../src/styles/Rightbar.module.css";
import Image from "next/image";
import * as Icon from "react-feather";
import { Categories, Tags } from "@/types/type";
import Link from "next/link";

interface RightbarProps {
    category: Categories[];
    tag: Tags[];
    contentHeight: number;
}

const Rightbar: React.FC<RightbarProps> = ({ category, tag, contentHeight }) => {
    return (
        <div className={styles.rightbar}>
            <div className={styles.rightbar_inner}>
                <div className={styles.my_card}>
                    <div className={styles.my_picture}>
                        <Image src="/images/my_picture.png" alt="" width={100} height={100} priority />
                    </div>
                    <div className={styles.my_name}>
                        <h4>H.Aso</h4>
                    </div>
                    <p className={styles.my_description}>札幌のデザイン会社でWEBの更新、LPの作成などを行いながらフロント領域を学習中</p>
                    <div className={styles.sns_card}>
                        <p>ー Shall We Follow ー</p>
                        <div className={styles.sns_icons}>
                            <Icon.Twitter />
                            <Link href={`https://github.com/OjagaO`}><Icon.GitHub /></Link>
                        </div>
                    </div>
                </div>
                <div className={styles.category_area}>
                    <p className={styles.category_title}>カテゴリー</p>
                    <ul>
                        {category.map((category) => (
                            <li className={styles.category_name} key={category.id}>
                                <Link href={`/category/${category.id}`}>{category.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.tag_area}>
                    <p className={styles.tag_title}>タグ</p>
                    <ul>
                        <li className={`${styles.flex_wrap} ${styles.tag_box}`}>
                            {tag.map((tagItem) => (
                                <Link className={`${styles.tag} ${styles.flex_center}`} href={`/tag/${tagItem.id}`} key={tagItem.tag}>
                                    <Icon.Tag className={styles.tag_svg} />
                                    <p>{tagItem.tag}</p>
                                </Link>
                            ))}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Rightbar;
