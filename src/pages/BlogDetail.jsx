import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import useIsMobile from "../hooks/useIsMobile";
import Sidebar from "../components/Sidebar";
import "../styles/BlogDetail.css";

// Import blog posts data (in a real app, this would come from an API)
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
    featured: true,
    content: `Buying your first used car can be an exciting yet overwhelming experience. With so many options and potential pitfalls, it's essential to approach the process with knowledge and preparation. Here are 10 essential tips to help you make a smart purchase.

## 1. Set a Realistic Budget

Before you start shopping, determine how much you can afford. Remember to factor in:
- The purchase price
- Insurance costs
- Registration and taxes
- Potential repairs and maintenance
- Fuel costs

A good rule of thumb is to keep your total monthly car expenses (including loan payment, insurance, and maintenance) under 20% of your monthly income.

## 2. Research Extensively

Spend time researching:
- Different car models and their reliability ratings
- Common issues with specific makes and models
- Fair market prices using online tools
- The vehicle's history and previous ownership

## 3. Check the Vehicle History Report

Always obtain a vehicle history report (like Carfax or AutoCheck) to check for:
- Accidents and damage
- Number of previous owners
- Service records
- Title issues (salvage, flood damage, etc.)

## 4. Inspect the Exterior and Interior

Look for:
- Signs of rust or corrosion
- Uneven paint (indicating repairs)
- Misaligned panels
- Worn tires
- Interior damage or excessive wear
- Functioning lights and electronics

## 5. Test Drive Thoroughly

During the test drive, check:
- Engine performance and responsiveness
- Brake effectiveness
- Steering alignment
- Transmission smoothness
- Suspension and ride quality
- Unusual noises or vibrations

## 6. Get a Professional Inspection

Even if the car looks perfect, have a trusted mechanic inspect it. They can identify:
- Hidden mechanical issues
- Safety concerns
- Potential future repair costs
- Overall vehicle condition

## 7. Verify Documentation

Ensure all paperwork is in order:
- Title and registration
- Service records
- Warranty information (if applicable)
- Insurance documents

## 8. Negotiate Smartly

Don't be afraid to negotiate. Use your research to:
- Point out any issues found during inspection
- Compare prices with similar vehicles
- Be prepared to walk away if the price isn't right

## 9. Understand Financing Options

If you need financing:
- Shop around for the best rates
- Get pre-approved before shopping
- Read all terms carefully
- Consider the total cost, not just monthly payments

## 10. Trust Your Instincts

If something feels off about the car or the seller, trust your gut. There are plenty of used cars available, and it's better to wait for the right one than to rush into a bad purchase.

## Conclusion

Buying a used car requires patience, research, and careful consideration. By following these tips, you'll be well-equipped to find a reliable vehicle that fits your needs and budget. Remember, a good used car can provide years of reliable service if you choose wisely.`
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
    featured: true,
    content: `Maintaining your car's value is about more than just keeping it clean. It requires consistent care, proper maintenance, and smart decisions throughout your ownership. Here's how to protect your investment.

## Regular Maintenance is Key

Follow your manufacturer's recommended maintenance schedule:
- Regular oil changes
- Tire rotations and replacements
- Brake inspections and replacements
- Fluid checks and replacements
- Filter changes

## Keep Detailed Records

Maintain a comprehensive service history:
- Save all receipts and invoices
- Keep a log of all maintenance and repairs
- Document any modifications or upgrades
- This proves your car has been well-maintained

## Protect the Exterior

- Regular washing and waxing
- Park in covered areas when possible
- Address scratches and dings promptly
- Consider paint protection film for high-value vehicles

## Maintain the Interior

- Regular vacuuming and cleaning
- Use seat covers and floor mats
- Avoid smoking in the vehicle
- Keep the interior free of clutter and damage

## Drive Responsibly

- Avoid aggressive driving
- Follow speed limits
- Don't overload the vehicle
- Use quality fuel and fluids

## Conclusion

A well-maintained car not only provides reliable transportation but also retains its value better when it's time to sell or trade-in.`
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
    featured: false,
    content: `Understanding car financing is crucial for making a smart vehicle purchase. This comprehensive guide covers everything you need to know about financing your next car.

## Types of Car Financing

**Dealer Financing:** Convenient but may have higher rates. Dealers often offer promotional rates for qualified buyers.

**Bank Loans:** Traditional option with competitive rates. Pre-approval gives you negotiating power.

**Credit Union Loans:** Often offer the best rates for members. Membership requirements apply.

**Online Lenders:** Quick approval process and competitive rates. Compare multiple options.

## Key Factors to Consider

- Interest rates and APR
- Loan term length
- Down payment amount
- Your credit score
- Total cost of ownership

## Conclusion

Shop around, compare offers, and read all terms carefully before signing any financing agreement.`
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
    featured: false,
    content: `Choosing between an SUV and a sedan is one of the most common decisions car buyers face. Each has distinct advantages depending on your needs.

## SUV Advantages

- More cargo space
- Higher seating position
- Better for off-road or rough terrain
- More towing capacity
- Perceived safety

## Sedan Advantages

- Better fuel economy
- Lower purchase price
- Easier to park and maneuver
- Lower maintenance costs
- Sportier driving experience

## Conclusion

Consider your lifestyle, family size, driving needs, and budget when making this decision.`
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
    featured: false,
    content: `Finding a reliable used car under ₹10 lakh requires careful research. Here are our top picks for dependable vehicles in this price range.

## Top Picks

1. Maruti Swift
2. Hyundai i20
3. Honda City
4. Toyota Etios
5. Ford Figo

## Conclusion

These vehicles offer excellent reliability and value in the used car market.`
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
    featured: false,
    content: `Car insurance is essential for protecting yourself and your vehicle. This guide explains everything you need to know.

## Types of Coverage

- Liability coverage
- Collision coverage
- Comprehensive coverage
- Personal injury protection

## Conclusion

Understanding your insurance options helps you make informed decisions and save money.`
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
    featured: false,
    content: `A thorough pre-purchase inspection can save you from costly mistakes. Use this comprehensive checklist.

## Inspection Checklist

- Engine and transmission
- Body and paint condition
- Interior condition
- Tires and wheels
- Electrical systems
- Test drive

## Conclusion

Never skip a professional inspection when buying a used car.`
  }
];

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile(900);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-not-found">
          <h2>Article not found</h2>
          <button onClick={() => navigate("/blog")}>Back to Blog</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`blog-detail-page ${isMobile ? "blog-detail-mobile" : "blog-detail-web"}`}>
      {/* Mobile Header */}
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

      {/* Back Button */}
      <div className="blog-detail-back">
        <button onClick={() => navigate("/blog")} className="blog-back-btn">
          <FiArrowLeft />
          <span>Back to Articles</span>
        </button>
      </div>

      {/* Article Header */}
      <article className="blog-detail-article">
        <div className="blog-detail-header">
          <div className="blog-detail-image-wrapper">
            <img src={post.image} alt={post.title} className="blog-detail-image" />
          </div>
          <div className="blog-detail-header-content">
            <span className="blog-detail-category">{post.category}</span>
            <h1 className="blog-detail-title">{post.title}</h1>
            <div className="blog-detail-meta">
              <span className="blog-detail-author">By {post.author}</span>
              <span className="blog-detail-date">{post.date}</span>
              <span className="blog-detail-read-time">{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="blog-detail-content">
          <div className="blog-detail-body">
            {post.content.split('\n\n').map((section, idx) => {
              if (section.startsWith('## ')) {
                return <h2 key={idx}>{section.substring(3).trim()}</h2>;
              } else if (section.startsWith('**') && section.includes('**')) {
                const parts = section.split('**');
                return (
                  <p key={idx}>
                    {parts.map((part, i) => 
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                );
              } else if (section.trim() === '') {
                return <br key={idx} />;
              } else {
                // Handle bullet points
                if (section.includes('- ')) {
                  const lines = section.split('\n');
                  return (
                    <ul key={idx}>
                      {lines.filter(line => line.trim().startsWith('- ')).map((line, i) => (
                        <li key={i}>{line.trim().substring(2)}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx}>{section.trim()}</p>;
              }
            })}
          </div>
        </div>

        {/* Share Section */}
        <div className="blog-detail-share">
          <h3>Share this article</h3>
          <div className="blog-share-buttons">
            <button className="share-btn">Facebook</button>
            <button className="share-btn">Twitter</button>
            <button className="share-btn">LinkedIn</button>
            <button className="share-btn">WhatsApp</button>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <section className="blog-detail-related">
        <h2 className="blog-section-title">Related Articles</h2>
        <div className="blog-posts-grid">
          {blogPosts
            .filter(p => p.id !== post.id && p.category === post.category)
            .slice(0, 3)
            .map((relatedPost) => (
              <article
                key={relatedPost.id}
                className="blog-post-card"
                onClick={() => navigate(`/blog/${relatedPost.id}`)}
              >
                <div className="blog-post-image-wrapper">
                  <img src={relatedPost.image} alt={relatedPost.title} className="blog-post-image" />
                </div>
                <div className="blog-post-content">
                  <span className="blog-category-tag">{relatedPost.category}</span>
                  <h3 className="blog-post-title">{relatedPost.title}</h3>
                  <p className="blog-post-excerpt">{relatedPost.excerpt}</p>
                </div>
              </article>
            ))}
        </div>
      </section>

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
