import { Typography, Card, Rate, Avatar, Carousel } from 'antd';
import './Testimonials.css';

const { Title, Paragraph } = Typography;

const Testimonials = () => {
    const testimonies = [
        {
            id: 1,
            name: 'Juan Pérez',
            stars: 5,
            content: '¡Gran experiencia trabajando con Sandar Inmuebles! El equipo es muy profesional y atento.',
            avatar: 'https://www.coopacsancristobal.pe/wp-content/uploads/2020/07/business-man.png',
        },
        {
            id: 2,
            name: 'Maria López',
            stars: 4,
            content: 'Encontré mi hogar perfecto gracias a Sandar Inmuebles. ¡Altamente recomendado!',
            avatar: 'https://www.aaconsultancy.ae/dubai/wp-content/uploads/2021/12/10-useful-tips-for-women-owned-businesses.jpg',
        },
        {
            id: 3,
            name: 'Carlos Rodríguez',
            stars: 5,
            content: 'El servicio de Sandar Inmuebles es excepcional. Siempre disponibles para ayudar.',
            avatar: 'https://media.istockphoto.com/id/1147289240/photo/portrait-of-a-smiling-student-at-the-city-street.jpg?s=612x612&w=0&k=20&c=9-L5boel1w6eQZsZJDXjXpLMTkCopgSue6vycZzP3r4=', // Cambia a la URL de la imagen que desees
        },
        {
            id: 4,
            name: 'Ana Gómez',
            stars: 3,
            content: 'Buena experiencia general. Algunas áreas para mejorar, pero en general satisfecha.',
            avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg', // Cambia a la URL de la imagen que desees
        },
        {
            id: 5,
            name: 'David Torres',
            stars: 4,
            content: 'Proceso de compra fácil y sin complicaciones. Buen equipo de ventas.',
            avatar: 'https://static.independent.co.uk/2022/11/04/12/newFile-4.jpg?quality=75&width=640&crop=3%3A2%2Csmart&auto=webp', // Cambia a la URL de la imagen que desees
        },
    ];

    return (
        <div className="testimonials-container">
            <Title level={2}>Testimonios de Clientes</Title>
            <Carousel autoplay autoplaySpeed={7000} dots>
                {testimonies.map((testimony) => (
                    <div key={testimony.id}>
                        <Card className="testimony-card" hoverable>
                            <div className="testimony-avatar-container">
                                <Avatar src={testimony.avatar} size={64} className="testimony-avatar" />
                            </div>
                            <Rate disabled allowHalf value={testimony.stars} />
                            <Paragraph className="testimony-content">{testimony.content}</Paragraph>
                            <p className="testimony-name">{testimony.name}</p>
                        </Card>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Testimonials;