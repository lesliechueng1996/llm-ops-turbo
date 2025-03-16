import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import LoginForm from './components/LoginForm';

const carousels = [
  {
    id: 1,
    title: '开箱即用的高质量AI编排模版',
    subTitle: '丰富的应用组件、覆盖大多数典型业务场景',
    image: '/images/login-banner.png',
  },
  {
    id: 2,
    title: '零代码5分钟编排原生AI应用',
    subTitle: '高效开发你的AI原生应用',
    image: '/images/login-banner.png',
  },
];

const LoginPage = () => {
  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/3 bg-gradient-to-b from-[#1D2129] to-[#00308F]">
        <Carousel
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {carousels.map((carousel) => (
              <CarouselItem
                key={carousel.id}
                className="flex justify-center items-center h-screen"
              >
                <div className="text-center">
                  <h1 className="text-white text-2xl font-bold mb-2">
                    {carousel.title}
                  </h1>
                  <h2 className="text-sm text-muted-foreground mb-8">
                    {carousel.subTitle}
                  </h2>
                  <div className="w-2/3 mx-auto">
                    <img
                      src={carousel.image}
                      alt={carousel.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/10 text-white" />
          <CarouselNext className="right-4 bg-white/10 text-white" />
        </Carousel>
      </div>
      <div className="w-2/3 flex justify-center items-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
