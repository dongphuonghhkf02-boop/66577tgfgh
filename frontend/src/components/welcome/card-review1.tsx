import React from "react";
import { type CSSProperties } from "react";
import Tag1 from "./tag1";
import styles from "./card-review1.module.css";

export type CardReview1Type = {
  className?: string;
  size?: any;
  showFire?: boolean;
};

const CardReview1: React.FC<CardReview1Type> = ({
  className = "",
  size = 16,
  showFire,
}) => {
  return (
    <section className={[styles.cardReview, className].join(" ")}>
      <div className={styles.reviewContent}>
        <Tag1
          prop="Біоінсектициди "
          showIcon={false}
          showTag
          size="16"
          showFire={false}
        />
        <div
          className={styles.div}
        >{`Спочатку ставився скептично, звикли "гасити" проблеми жорсткою хімією. Але минулий рік був посушливий, і хімічні фунгіциди просто палили кукурудзу. Спробували вашу схему з Тріходерміном по листу. Рослина не стресувала, стояла зелена до самих жнив. У підсумку отримали +4,5 ц/га на контрольних ділянках. `}</div>
      </div>
      <div className={styles.author}>Аграрна компанія м.Львів</div>
    </section>
  );
};

export default CardReview1;
