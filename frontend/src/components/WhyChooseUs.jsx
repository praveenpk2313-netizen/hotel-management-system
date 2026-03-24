import React from 'react';
import { 
  CreditCard, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Globe, 
  Award,
  Zap,
  Tag,
  Hotel
} from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <CreditCard className="text-cyan-600" size={32} />,
      title: "Book now, pay at the property",
      description: "FREE cancellation on most rooms. We'll find you the best price for your stay."
    },
    {
      icon: <Award className="text-cyan-600" size={32} />,
      title: "300M+ reviews from fellow travellers",
      description: "Get exactly what you bargained for with verified guest insights and rankings."
    },
    {
      icon: <Globe className="text-cyan-600" size={32} />,
      title: "2+ million properties worldwide",
      description: "Hotels, homes, apartments and more across the world's most desired locations."
    },
    {
      icon: <ShieldCheck className="text-cyan-600" size={32} />,
      title: "Trusted customer service you can rely on, 24/7",
      description: "Our global support teams are always on standby for your custom itinerary."
    }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="container-booking">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {features.map((feature, i) => (
              <div key={i} className="flex flex-col items-start gap-4 animate-fade-in group hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-100 group-hover:shadow-md">
                    {feature.icon}
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight tracking-tight">
                       {feature.title}
                    </h3>
                    <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                       {feature.description}
                    </p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
