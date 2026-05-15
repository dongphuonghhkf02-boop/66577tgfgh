import React from "react";
import { type CSSProperties } from "react";
import Tag1 from "./tag1";
import MD1 from "./m-d1";
import styles from "./card-blog1.module.css";

export type CardBlog1Type = {
  className?: string;
  imageContainer: string;
  showRole?: boolean;
  showDate?: boolean;
  showButton?: boolean;
  showTag?: boolean;
  device1?: any;
  prop?: string;
  showLabel?: boolean;
  primaryButtonJustifyContent?: any;
  iconContainerBackgroundColor?: any;
  size?: any;
  showFire?: boolean;

  /** Variant props */
  device?: any;
};

const CardBlog1: React.FC<CardBlog1Type> = ({
  className = "",
  device = "Default",
  imageContainer,
  showRole = false,
  showDate = false,
  showButton = true,
  showTag = false,
  device1,
  prop,
  showLabel,
  primaryButtonJustifyContent,
  iconContainerBackgroundColor,
  size = 16,
  showFire,
}) => {
  return (
    <section
      className={[styles.cardBlog, className].join(" ")}
      data-device={device}
    >
      <img
        className={styles.imageContainerIcon}
        loading="lazy"
        width={544}
        height={456}
        alt=""
        src={imageContainer}
      />
      {!!showTag && (
        <div className={styles.tag}>
          <Tag1
            device="Default"
            prop="Хіт продажу "
            showIcon
            showTag
            size="16"
            showFire
          />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.textBlock}>
          {!!showDate && <div className={styles.div}>Січень 2026</div>}
          <div className={styles.textBlock2}>
            <div className={styles.description}>
              <h3 className={styles.title}>{`Мінус 30% на селітрі `}</h3>
              {!!showRole && <div className={styles.role}>Посада</div>}
            </div>
            <div className={styles.description2}>
              Як інокулянти фіксують атмосферний азот і дозволяють економити на
              мінеральних добривах без втрати врожайності.
            </div>
          </div>
        </div>
        {!!showButton && (
          <MD1
            device={device1}
            prop={prop}
            showLabel={showLabel}
            primaryButtonJustifyContent={primaryButtonJustifyContent}
            iconContainerBackgroundColor={iconContainerBackgroundColor}
          />
        )}
      </div>
    </section>
  );
};

export default CardBlog1;
