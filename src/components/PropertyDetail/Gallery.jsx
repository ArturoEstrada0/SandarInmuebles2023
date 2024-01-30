/* eslint-disable react/prop-types */
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect } from 'react'

const Gallery = ({ images }) => {
  useEffect(() => {
    const lightbox = new PhotoSwipeLightbox({
      gallery: '#gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })
    lightbox.init()
  }, [])

  return (
    <div className='images-container pswp-gallery' id='gallery'>
      <div className='image-lar'>
        <a href={images[0].url} data-pswp-width='2500' data-pswp-height='1600'>
          <img
            loading='lazy'
            src={images[0].url}
            alt={`Property Image ${images[0].id}`}
          />
        </a>
      </div>
      <div className='image-sm'>
        {images.slice(1, 5).map((image, i) => (
          <a
            key={i}
            href={image.url}
            data-pswp-width='2500'
            data-pswp-height='1600'>
            <img
              loading='lazy'
              src={image.url}
              alt={`Property Image ${i + 1}`}
            />
          </a>
        ))}
      </div>
      <div className='images-hidden' style={{ display: 'none' }}>
        {images.slice(5).map((image, i) => (
          <a
            key={i}
            href={image.url}
            data-pswp-width='2500'
            data-pswp-height='1600'>
            <img
              loading='lazy'
              src={image.url}
              alt={`Property Image ${i + 1}`}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

export default Gallery
