import { useCallback } from 'react';

/**
 * Custom hook for sharing car listings
 * @param {Object} car - Car object with details
 * @param {Function} formatKm - Function to format kilometer value
 * @returns {Function} handleShare - Function to handle sharing on different platforms
 */
export const useShare = (car, formatKm) => {
  const getShareUrl = useCallback(() => {
    return window.location.href;
  }, []);

  const getShareText = useCallback(() => {
    if (!car) return 'Check out this car!';
    return `Check out this ${car.title} - ${formatKm(car.km)} • ${car.fuel} • ${car.transmission} at carsdedo!`;
  }, [car, formatKm]);

  const handleShare = useCallback((platform) => {
    const url = getShareUrl();
    const text = getShareText();
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(
          `Check out this car: ${car?.title || 'Car Listing'}`
        )}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
            alert('Link copied to clipboard! You can paste it in your Instagram story or post.');
          }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Link copied to clipboard! You can paste it in your Instagram story or post.');
          });
        } else {
          alert(`Share this link: ${url}`);
        }
        break;
      default:
        break;
    }
  }, [getShareUrl, getShareText, car]);

  return handleShare;
};
