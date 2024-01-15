import Slider from 'react-animated-slider'
import 'react-animated-slider/build/horizontal.css'
import './Testimonials.css'

const Testimonials = () => {
  const testimonies = [
    {
      id: 1,
      name: 'Juan Pérez',
      stars: 5,
      content:
        '¡Gran experiencia trabajando con Sandar Inmuebles! El equipo es muy profesional y atento.',
      avatar:
        'https://www.coopacsancristobal.pe/wp-content/uploads/2020/07/business-man.png',
    },
    {
      id: 2,
      name: 'Maria López',
      stars: 4,
      content:
        'Encontré mi hogar perfecto gracias a Sandar Inmuebles. ¡Altamente recomendado!',
      avatar:
        'https://www.aaconsultancy.ae/dubai/wp-content/uploads/2021/12/10-useful-tips-for-women-owned-businesses.jpg',
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      stars: 5,
      content:
        'El servicio de Sandar Inmuebles es excepcional. Siempre disponibles para ayudar.',
      avatar:
        'https://media.istockphoto.com/id/1147289240/photo/portrait-of-a-smiling-student-at-the-city-street.jpg?s=612x612&w=0&k=20&c=9-L5boel1w6eQZsZJDXjXpLMTkCopgSue6vycZzP3r4=', // Cambia a la URL de la imagen que desees
    },
    {
      id: 4,
      name: 'Ana Gómez',
      stars: 3,
      content:
        'Buena experiencia general. Algunas áreas para mejorar, pero en general satisfecha.',
      avatar:
        'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', // Cambia a la URL de la imagen que desees
    },
    {
      id: 5,
      name: 'David Torres',
      stars: 4,
      content:
        'Proceso de compra fácil y sin complicaciones. Buen equipo de ventas.',
      avatar:
        'https://static.independent.co.uk/2022/11/04/12/newFile-4.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp', // Cambia a la URL de la imagen que desees
    },
    {
      id: 6,
      name: 'María Fernández',
      stars: 5,
      content:
        '¡Gran experiencia trabajando con Sandar Inmuebles! El equipo es muy profesional y atento.',
      avatar:
        'https://static.independent.co.uk/2022/11/04/12/newFile-4.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp',
    },
    {
      id: 7,
      name: 'Juan Pérez',
      stars: 5,
      content:
        '¡Gran experiencia trabajando con Sandar Inmuebles! El equipo es muy profesional y atento.',
      avatar:
        'https://static.independent.co.uk/2022/11/04/12/newFile-4.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp',
    },
    {
      id: 8,
      name: 'Juan Pérez',
      stars: 5,
      content:
        '¡Gran experiencia trabajando con Sandar Inmuebles! El equipo es muy profesional y atento.',
      avatar:
        'https://static.independent.co.uk/2022/11/04/12/newFile-4.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp',
    },
    {
      id: 9,
      name: 'Juan Pérez',
      stars: 5,
      content:
        '¡Gran experiencia trabajando con Sandar Inmuebles! El equipo es muy profesional y atento.',
      avatar:
        'https://static.independent.co.uk/2022/11/04/12/newFile-4.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp',
    },
  ]

  return (
    <div className='testimonials'>
      <Slider autoplay={1000}>
        {testimonies.map((item) => (
          <div key={item.id} className='testimonial-card'>
            <h2>{item.name}</h2>
            <p>{'⭐'.repeat(item.stars)}</p>
            <img src={item.avatar} alt={item.name} />
            <p>{item.content}</p>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default Testimonials
