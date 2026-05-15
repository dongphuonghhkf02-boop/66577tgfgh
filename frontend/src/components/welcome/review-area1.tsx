import React from "react";
import { useState } from "react";
import CardReview1 from "./card-review1";
import SliderIndicator1 from "./slider-indicator1";
import ArrowSwitcher1 from "./arrow-switcher1";
import styles from "./review-area1.module.css";

export type ReviewArea1Type = {
  className?: string;
};

const ReviewArea1: React.FC<ReviewArea1Type> = ({ className = "" }) => {
  const [cardReview1Items] = useState([
    {
      size: 16,
      showFire: false,
    },
    {
      size: 16,
      showFire: false,
    },
    {
      size: 16,
      showFire: false,
    },
  ]);
  return (
    <section className={[styles.reviewArea, className].join(" ")}>
      <div className={styles.reviewSection}>
        <div className={styles.headlineButton}>
          <div className={styles.div}>
            <span className={styles.span}>
              <span className={styles.span2}>Фермери</span>
              <span className={styles.span3}>{` `}</span>
            </span>
            <span className={styles.span4}>обирають нас</span>
          </div>
        </div>
        <div className={styles.reviewGroup}>
          <div className={styles.imageParent}>
            <img
              className={styles.imageIcon}
              width={504}
              height={404}
              alt=""
              src="/image4@2x.png"
            />
            {cardReview1Items.map((item, index) => (
              <CardReview1
                key={index}
                size={item.size}
                showFire={item.showFire}
              />
            ))}
          </div>
          <SliderIndicator1 active={1} />
        </div>
      </div>
      <div className={styles.switchArea}>
        <ArrowSwitcher1
          active="Right"
          size="Small"
          arrowSwitcherWidth="96px"
          arrowSwitcherHeight="36px"
          arrowSwitcherPosition="unset"
          arrowSwitcherTop="unset"
          arrowSwitcherLeft="unset"
          size1="Small"
          state="Disabled"
          buttonArrowLeftHeight="36px"
          buttonArrowLeftWidth="36px"
          size2="Small"
          state1="Default"
          buttonArrowRightHeight="36px"
          buttonArrowRightWidth="36px"
        />
      </div>
    </section>
  );
};

export default ReviewArea1;
