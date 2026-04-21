import {
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiStar,
  FiHeadphones,
  FiGift,
} from "react-icons/fi";

export default function TrustBadges() {
  const items = [
    { icon: <FiTruck />, text: "Fast Delivery" },
    { icon: <FiRefreshCw />, text: "Easy Returns" },
    { icon: <FiShield />, text: "Secure Payment" },
    { icon: <FiStar />, text: "Top Quality" },
    { icon: <FiHeadphones />, text: "24/7 Support" },
    { icon: <FiGift />, text: "Special Offers" },
  ];

  return (
    <section className="py-8 overflow-hidden">
      <div className="relative">
        <div className="flex gap-8 animate-scroll w-max">
          {[...items, ...items].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 justify-center min-w-50"
            >
              <span className="text-yellow-600 text-xl">
                {item.icon}
              </span>
              <span className="text-sm font-bold uppercase tracking-tighter">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}