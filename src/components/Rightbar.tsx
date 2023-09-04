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
    const rightBarRef = useRef<HTMLDivElement>(null);
    const rightBarTop = useRef<number | null>(null);
    const rightBarBox = useRef<HTMLDivElement>(null);
    const [windowTop, setWindowTop] = useState(0);
    const [rightBarTopPosition, setRightBarTopPosition] = useState<number | null>(null);
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const [rightBarHeight, setRightBarHeight] = useState<number>(0);
    // 画面の高さを取得する

    useEffect(() => {
        const updateWindowHeight = () => {
            setWindowHeight(window.innerHeight);
        };
        updateWindowHeight();

        const updateRightbarHeight = () => {
            if (rightBarRef.current) {
                setRightBarHeight(rightBarRef.current.offsetHeight);
            }
        };

        const updateRightbarTop = () => {
            if (rightBarRef.current) {
                setRightBarTopPosition(rightBarRef.current.offsetTop);
            }
        };

        updateWindowHeight();
        updateRightbarHeight();
        updateRightbarTop();

        window.addEventListener("resize", updateWindowHeight);
        window.addEventListener("resize", updateRightbarHeight);
        window.addEventListener("resize", updateRightbarTop);

        return () => {
            window.removeEventListener("resize", updateWindowHeight);
            window.removeEventListener("resize", updateRightbarHeight);
            window.removeEventListener("resize", updateRightbarTop);
        };
    }, [windowHeight]);

    // 条件分岐（Rightbarの高さが画面幅よりも高いか低いか）
    useEffect(() => {

        const stopLine = contentHeight - 300;

        if (windowHeight > rightBarHeight) {
            const handleScroll = () => {
                setWindowTop(window.scrollY);

                if (rightBarRef.current && rightBarTop.current !== null) {
                    if (window.scrollY > rightBarTop.current) {
                        // windowTop が rightBarTop を超えたら追従スタイルを適用
                        rightBarRef.current.classList.add(styles.sticky);
                    } else {
                        rightBarRef.current.classList.remove(styles.sticky);
                    }

                    const rightBarBottom = rightBarRef.current.offsetHeight + window.scrollY;

                    if (rightBarBottom > stopLine) {
                        rightBarRef.current.classList.add(styles.stop);
                        const topValue = stopLine - rightBarRef.current.offsetHeight;
                        rightBarRef.current.style.top = `${topValue}px`;
                    } else {
                        rightBarRef.current.classList.remove(styles.stop);
                        rightBarRef.current.style.top = '0';
                    }
                }
            };

            if (rightBarRef.current && rightBarTop.current === null) {
                rightBarTop.current = rightBarRef.current.offsetTop; // 最初のレンダリング時に取得
            }

            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        } else {
            const handleScroll = () => {
                if (rightBarRef.current &&  rightBarTopPosition !== null) {
                    const rightBarBottom = rightBarTopPosition + rightBarRef.current.offsetHeight;
                    const windowBottom = window.scrollY + window.innerHeight;

                    if (windowBottom > rightBarBottom) {
                        // 画面下限と Rightbar の一番下が交差したら追従スタイルを適用
                        rightBarRef.current.classList.add(styles.under_sticky);
                    } else {
                        rightBarRef.current.classList.remove(styles.under_sticky);
                    }

                    const rightBarBottomScroll = rightBarHeight + window.scrollY;

                    if (rightBarBottomScroll > stopLine) {
                        rightBarRef.current.classList.add(styles.stop);
                        const topValue = stopLine - rightBarHeight;
                        rightBarRef.current.style.top = `${topValue}px`;
                    } else {
                        rightBarRef.current.classList.remove(styles.stop);
                        rightBarRef.current.style.top = '0';
                    }
                }
            };

            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, [windowHeight, contentHeight, rightBarHeight,rightBarTopPosition]);

    // スクロールに合わせて追従する

    return (
        <div className={styles.rightbar}>
            <div className={styles.rightbar_inner} ref={rightBarRef}>
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
                            <Icon.GitHub />
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
                                <div className={`${styles.tag} ${styles.flex_center}`} key={tagItem.tag}>
                                    <Icon.Tag className={styles.tag_svg} />
                                    <p>{tagItem.tag}</p>
                                </div>
                            ))}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Rightbar;
