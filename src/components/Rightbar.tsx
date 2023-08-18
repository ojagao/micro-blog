import React from "react";
import styles from "../../src/styles/Rightbar.module.css";
import Image from "next/image";
import * as Icon from "react-feather";

const Rightbar = () => {
    return (
        <div className={styles.rightbar}>
            <div className={styles.my_card}>
                <div className={styles.my_picture}>
                    <Image src="/images/my_picture.png" alt="" width={100} height={100} />
                </div>
                <div className={styles.my_name}>
                    <h4>H.Aso</h4>
                </div>
                <p className={styles.my_description}>札幌のデザイン会社でWEBの更新、LPの作成などを行いながらフロント領域を学習中</p>
                <div className={styles.sns_card}>
                    <p> ー Shall We Follow ー　</p>
                    <div className={styles.sns_icons}>
                        <Icon.Twitter />
                        <Icon.GitHub />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rightbar;
