import React from "react";
import PrimaryButton1 from "./primary-button1";
import styles from "./about-company1.module.css";

export type AboutCompany1Type = {
  className?: string;
};

const AboutCompany1: React.FC<AboutCompany1Type> = ({ className = "" }) => {
  return (
    <section className={[styles.aboutCompany, className].join(" ")}>
      <div className={styles.aboutUsSection}>
        <div className={styles.backgroundNoiseParent}>
          <div className={styles.backgroundNoise} />
          <div className={styles.topQuotesWrapper}>
            <div className={styles.topQuotes}>
              <h1 className={styles.h1}>
                <span>{`«Ціна помилки в агро - `}</span>
                <span className={styles.span}>
                  не просто цифри у звіті, <br />
                  це здоров’я землі на роки вперед. <br />
                  Хімія дає ілюзію швидкості, часто ціною опіків та виснаження
                  ґрунту.”
                </span>
              </h1>
              <section className={styles.integrateBio}>
                <div className={styles.todayInvestment}>
                  <div className={styles.noCompromises}>
                    <div className={styles.div}>
                      <span>Наша місія</span>
                      <span
                        className={styles.span2}
                      >{` - шлях без компромісів: <br/><br/>ми інтегруємо мікробіологію в існуючі технології так, щоб ви отримали і `}</span>
                      <span>рекордний врожай</span>
                      <span className={styles.span2}>{`, і `}</span>
                      <span>{`чистий продукт з високою ринковою цінністю. `}</span>
                    </div>
                  </div>
                  <h3 className={styles.h3}>
                    <span>Біопрепарати</span>
                    <span className={styles.span2}>{` `}</span>
                    <span>{`сьогодні `}</span>
                    <span
                      className={styles.span5}
                    >{`-  найрозумніша інвестиція в землю та `}</span>
                    <span>життя майбутнього покоління.</span>
                  </h3>
                </div>
              </section>
              <section className={styles.foundingTeam}>
                <div className={styles.founderBlock}>
                  <div className={styles.text}>
                    <h2 className={styles.h2}>Михайло Севастьянов</h2>
                    <h2 className={styles.h22}>{`Засновник & власник`}</h2>
                  </div>
                  <PrimaryButton1
                    state="Default"
                    type="Filled"
                    prop="Про Таміс Агро"
                    primaryButtonPadding="18px 16px"
                    primaryButtonWidth="380px"
                    size="24"
                  />
                </div>
              </section>
            </div>
          </div>
          <img
            className={styles.closeUpGreenLeafNervesWitIcon}
            loading="lazy"
            width={855}
            height={1282}
            alt=""
            src="/close-up-green-leaf-nerves-with-water-drops-2@2x.png"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutCompany1;
