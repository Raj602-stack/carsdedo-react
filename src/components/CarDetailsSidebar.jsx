import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { FiMail, FiMapPin } from 'react-icons/fi';
import styles from '../styles/CarDetailsWeb.module.css';
import { formatKm, formatPrice } from '../utils';

/**
 * CarDetailsSidebar component - Fixed right sidebar with car details and actions
 */
const CarDetailsSidebar = React.memo(({ car, onShare }) => {
  const navigate = useNavigate();

  if (!car) return null;

  const hubTextRaw = car.locationFull || car.city || '';
  const hubText = hubTextRaw.replace(/^[^A-Za-z0-9]+/, '').trim();
  const hubLabel = hubText.toLowerCase().startsWith('hub')
    ? hubText
    : `HUB • ${hubText || car.city}`;

  return (
    <div className={styles.rightInner}>
          <div className={styles.titleRow}>
            <h3 className={styles.carTitle}>{car.title}</h3>
            <button type="button" className={styles.like} aria-label="save">
              ♡
            </button>
          </div>

          <div className={styles.meta}>
            <div>
              {car.km.toLocaleString()} km • {car.fuel} • {car.transmission}
            </div>
            <div className={styles.hub}>
              <FiMapPin className={styles.cityIcon} />
              {hubLabel}
            </div>
          </div>

          <div className={styles.priceBlock}>
            <div className={styles.priceBlockLabel}>Fixed on road price</div>
            <div className={styles.priceBlockPrice}>{formatPrice(car.price)}</div>
            <div className={styles.priceBlockSmall}>
              Includes RC transfer, insurance & more
            </div>
          </div>

          <div className={styles.cta}>
            <button
              onClick={() =>
                navigate(`/car/${car.id}/book`, {
                  state: { car }
                })
              }
              type="button"
              className={styles.btnBook}
            >
              BOOK NOW
            </button>
            <button
              type="button"
              className={styles.btnTest}
              onClick={() => navigate(`/test-drive/${car.id}`)}
            >
              FREE TEST DRIVE
            </button>
          </div>

          <div className={styles.share}>
            <p>Share with a friend :</p>
            <div className={styles.icons}>
              <button
                type="button"
                onClick={() => onShare('instagram')}
                className={styles.shareIcon}
                aria-label="Share on Instagram"
              >
                <FaInstagram />
              </button>
              <button
                type="button"
                onClick={() => onShare('facebook')}
                className={styles.shareIcon}
                aria-label="Share on Facebook"
              >
                <FaFacebook />
              </button>
              <button
                type="button"
                onClick={() => onShare('twitter')}
                className={styles.shareIcon}
                aria-label="Share on Twitter"
              >
                <FaTwitter />
              </button>
              <button
                type="button"
                onClick={() => onShare('email')}
                className={styles.shareIcon}
                aria-label="Share via Email"
              >
                <FiMail />
              </button>
            </div>
          </div>
        </div>
  );
});

CarDetailsSidebar.displayName = 'CarDetailsSidebar';

export default CarDetailsSidebar;
