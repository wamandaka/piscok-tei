import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: "🎯",
      title: "Earn Points",
      description: "Get points for every purchase at Piscok Tei restaurants",
    },
    {
      icon: "🎁",
      title: "Redeem Rewards",
      description:
        "Exchange points for vouchers, free items, and exclusive deals",
    },
    {
      icon: "⭐",
      title: "Tier Benefits",
      description:
        "Unlock Silver, Gold, and Platinum tiers with increasing benefits",
    },
    {
      icon: "📱",
      title: "Easy Scanning",
      description: "Scan QR codes to earn points instantly",
    },
  ];

  const tiers = [
    {
      name: "Silver",
      color: "from-gray-400 to-gray-600",
      benefit: "1x Points",
      requirement: "Start here",
    },
    {
      name: "Gold",
      color: "from-yellow-400 to-yellow-600",
      benefit: "1.5x Points + 10% Bonus",
      requirement: "1000 points",
    },
    {
      name: "Platinum",
      color: "from-purple-400 to-purple-600",
      benefit: "2x Points + 20% Bonus",
      requirement: "5000 points",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sushi-red to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Piscok Tei Loyalty
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Earn points, get rewards, and enjoy exclusive benefits
          </p>
          <Link
            to="/login"
            className="bg-white text-sushi-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-red-100 transition-colors inline-block shadow-lg"
          >
            Join Now - It's Free!
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
            Membership Tiers
          </h2>
          <p className="text-center text-gray-600 mb-12">
            The more you dine, the more you earn!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`card bg-gradient-to-br ${tier.color} text-white text-center hover:scale-105 transition-transform`}
              >
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className="text-lg mb-4">{tier.benefit}</p>
                <p className="text-sm opacity-75">{tier.requirement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Ready to Start Earning?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Sign up now and get 100 bonus points on your first purchase!
          </p>
          <Link to="/login" className="btn-primary text-lg px-8 py-4">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
