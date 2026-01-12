import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import useIsMobile from "../hooks/useIsMobile";
import Sidebar from "../components/Sidebar";
import "../styles/Blog.css";

const blogPosts = [
  {
    id: 1,
    title: "10 Essential Tips for Buying Your First Used Car",
    excerpt: "Navigate the used car market with confidence. Learn what to check, what to ask, and how to get the best deal on your first pre-owned vehicle.",
    author: "Raj Kumar",
    date: "March 15, 2024",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 2,
    title: "How to Maintain Your Car's Value Over Time",
    excerpt: "Discover proven strategies to keep your car in top condition and maximize its resale value. From regular maintenance to smart upgrades.",
    author: "Priya Sharma",
    date: "March 12, 2024",
    category: "Maintenance",
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=500&fit=crop",
    readTime: "7 min read",
    featured: true
  },
  {
    id: 3,
    title: "Electric vs Hybrid: Which is Right for You?",
    excerpt: "Compare electric and hybrid vehicles to find the perfect eco-friendly option for your lifestyle and driving needs.",
    author: "Amit Patel",
    date: "March 10, 2024",
    category: "Electric Vehicles",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=500&fit=crop",
    readTime: "6 min read",
    featured: false,
    content: `The automotive industry is rapidly evolving, and one of the biggest decisions car buyers face today is choosing between electric vehicles (EVs) and hybrid vehicles. Both offer environmental benefits and fuel savings, but they serve different needs and lifestyles.

## Understanding Electric Vehicles (EVs)

Electric vehicles run entirely on electricity stored in large battery packs. They produce zero direct emissions and are powered by electric motors. EVs need to be plugged into charging stations or home charging units to recharge their batteries.

**Advantages of EVs:**
- Zero tailpipe emissions
- Lower operating costs (electricity is cheaper than gasoline)
- Minimal maintenance (no oil changes, fewer moving parts)
- Quiet and smooth driving experience
- Eligible for government incentives and tax credits

**Considerations:**
- Limited driving range (typically 200-400 miles per charge)
- Charging infrastructure still developing
- Longer charging times compared to refueling
- Higher upfront costs

## Understanding Hybrid Vehicles

Hybrid vehicles combine a traditional gasoline engine with an electric motor and battery. They can run on gasoline, electricity, or both simultaneously. Hybrids don't need to be plugged in—they recharge their batteries through regenerative braking and the gasoline engine.

**Advantages of Hybrids:**
- Better fuel economy than traditional cars
- No range anxiety (can refuel at any gas station)
- Lower emissions than conventional vehicles
- Familiar driving experience
- More affordable than most EVs

**Considerations:**
- Still produces emissions (though less than traditional cars)
- More complex powertrain (more maintenance than EVs)
- Less environmental benefit than pure EVs
- Still dependent on gasoline

## Which is Right for You?

**Choose an EV if:**
- You have a predictable daily commute under 200 miles
- You have access to home or workplace charging
- You want maximum environmental impact
- You're comfortable with longer charging times for road trips
- You live in an area with good charging infrastructure

**Choose a Hybrid if:**
- You frequently take long road trips
- You don't have reliable access to charging stations
- You want better fuel economy without changing your driving habits
- You need a vehicle immediately and charging infrastructure is limited in your area
- You want a stepping stone toward full electrification

## The Future of Transportation

Both EVs and hybrids represent important steps toward sustainable transportation. As charging infrastructure expands and battery technology improves, EVs will become more practical for more people. However, hybrids offer an excellent bridge for those not yet ready to go fully electric.

The best choice depends on your driving patterns, lifestyle, access to charging, and environmental priorities. Consider test driving both types of vehicles to see which feels right for you.`
  },
  {
    id: 4,
    title: "The Complete Guide to Car Financing in 2024",
    excerpt: "Everything you need to know about car loans, interest rates, down payments, and financing options to make an informed decision.",
    author: "Sneha Reddy",
    date: "March 8, 2024",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
    readTime: "8 min read",
    featured: false
  },
  {
    id: 5,
    title: "SUV vs Sedan: Making the Right Choice",
    excerpt: "Explore the pros and cons of SUVs and sedans to determine which vehicle type best suits your family and lifestyle.",
    author: "Vikram Singh",
    date: "March 5, 2024",
    category: "Comparison",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=500&fit=crop",
    readTime: "5 min read",
    featured: false
  },
  {
    id: 6,
    title: "Top 10 Most Reliable Used Cars Under ₹10 Lakh",
    excerpt: "Our curated list of the most dependable pre-owned vehicles that offer excellent value and reliability without breaking the bank.",
    author: "Anjali Mehta",
    date: "March 3, 2024",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=500&fit=crop",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 7,
    title: "Understanding Car Insurance: A Beginner's Guide",
    excerpt: "Navigate the complexities of car insurance with our comprehensive guide covering types, coverage, and money-saving tips.",
    author: "Rohit Verma",
    date: "March 1, 2024",
    category: "Insurance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 8,
    title: "Pre-Purchase Inspection Checklist: What to Look For",
    excerpt: "Don't buy a used car without this essential checklist. Learn what to inspect before making your purchase decision.",
    author: "Kavita Nair",
    date: "February 28, 2024",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=500&fit=crop",
    readTime: "5 min read",
    featured: false
  }
];


export default function Blog() {
  const isMobile = useIsMobile(900);
  const navigate = useNavigate();
  const [selectedCategory] = useState("All");
  const [searchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  return (
    <div className={`blog-page ${isMobile ? "blog-mobile" : "blog-web"}`}>
      {/* Mobile Header - Same as Buy Page */}
      {isMobile && (
        <header className="buy-header">
          <div className="buy-header-inner">
            <button 
              className="hamburger" 
              aria-label="Open menu"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <div className="brand">
              <img
                src={process.env.PUBLIC_URL + "/carsdedo-background.png"}
                alt="CarsDedo"
                className="brand-logo"
              />
            </div>
            <div className="header-actions">
              <button 
                className="action search-icon-btn" 
                onClick={() => navigate("/search")}
                aria-label="Search cars"
              >
                <FiSearch />
              </button>
              <button 
                className="action" 
                onClick={() => navigate("/sell")}
              >
                Sell
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className={`blog-hero ${isMobile ? "blog-hero-mobile" : ""}`}>
        <div className="blog-hero-content">
          <h1 className="blog-hero-title">Car Insights & Guides</h1>
          <p className="blog-hero-subtitle">
            Expert advice, buying guides, and tips to help you make informed car decisions
          </p>
        </div>
      </section>


      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="blog-featured">
          <h2 className="blog-section-title">Featured Articles</h2>
          <div className="blog-featured-grid">
            {featuredPosts.map((post) => (
              <article
                key={post.id}
                className="blog-featured-card"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="blog-featured-image-wrapper">
                  <img src={post.image} alt={post.title} className="blog-featured-image" />
                  <span className="blog-featured-badge">Featured</span>
                </div>
                <div className="blog-featured-content">
                  <span className="blog-category-tag">{post.category}</span>
                  <h3 className="blog-featured-title">{post.title}</h3>
                  <p className="blog-featured-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-author">{post.author}</span>
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Regular Posts Grid */}
      <section className="blog-posts">
        <h2 className="blog-section-title">
          {selectedCategory === "All" ? "All Articles" : `${selectedCategory} Articles`}
        </h2>
        {regularPosts.length > 0 ? (
          <div className="blog-posts-grid">
            {regularPosts.map((post) => (
              <article
                key={post.id}
                className="blog-post-card"
                onClick={() => handlePostClick(post.id)}
              >
                <div className="blog-post-image-wrapper">
                  <img src={post.image} alt={post.title} className="blog-post-image" />
                </div>
                <div className="blog-post-content">
                  <span className="blog-category-tag">{post.category}</span>
                  <h3 className="blog-post-title">{post.title}</h3>
                  <p className="blog-post-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <span className="blog-author">{post.author}</span>
                    <span className="blog-date">{post.date}</span>
                    <span className="blog-read-time">{post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="blog-no-results">
            <p>No articles found matching your criteria.</p>
          </div>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="blog-newsletter">
        <div className="blog-newsletter-content">
          <h2 className="blog-newsletter-title">Stay Updated</h2>
          <p className="blog-newsletter-text">
            Get the latest car buying tips, maintenance guides, and industry insights delivered to your inbox.
          </p>
          <div className="blog-newsletter-form">
            <input
              type="email"
              className="blog-newsletter-input"
              placeholder="Enter your email"
            />
            <button className="blog-newsletter-btn">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
