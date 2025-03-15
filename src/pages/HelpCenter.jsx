// HelpCenter.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronRight,
  HelpCircle,
  MessageSquare,
  Settings,
  Users,
  DollarSign,
  Video,
  Play,
} from "lucide-react";

const helpData = [
  {
    category: "Overview",
    icon: <HelpCircle size={22} />,
    tabs: {
      Basics: [
        {
          title: "Navigating Your Dashboard",
          summary: "Command your platform effortlessly.",
          content:
            "Your dashboard is your mission control. The top bar delivers live metrics—revenue, users, disputes—while the sidebar offers instant access to key tools. Begin with 'Overview' for a real-time pulse of your marketplace.",
          media: "screenshot-dashboard.png",
        },
      ],
      Advanced: [
        {
          title: "Setting Platform Fees",
          summary: "Optimize your earnings with precision.",
          content:
            "In 'Settings > Fees,' use the interactive slider (0-25%) to set commissions. Preview impacts on a live graph, then confirm. New rates roll out instantly, with a 24-hour grace period for pending deals.",
          media: "video-fees-demo.mp4",
        },
      ],
    },
  },
  {
    category: "User Management",
    icon: <Users size={22} />,
    tabs: {
      Basics: [
        {
          title: "Ban a User",
          summary: "Enforce rules in a snap.",
          content:
            "Head to 'User Management,' search by any field, and hit 'Actions > Ban.' A pop-up shows their recent activity—review and lock them out. Bans sync across all systems instantly.",
        },
      ],
      Advanced: [
        {
          title: "Approve Sellers",
          summary: "Curate your seller elite.",
          content:
            "In 'Seller Requests,' AI flags anomalies in docs (ID, tax forms). Approve with a single click—sellers get a branded welcome kit and instant listing rights.",
          media: "screenshot-seller-flow.png",
        },
      ],
    },
  },
  {
    category: "Transactions & Disputes",
    icon: <DollarSign size={22} />,
    tabs: {
      Basics: [
        {
          title: "Track Transactions",
          summary: "Monitor cash flow like a pro.",
          content:
            "Go to 'Transactions,' filter with precision (date, user, type), and export as PDF/CSV. Hover over entries for mini-audits—timestamps, fees, and status updates.",
        },
      ],
      Advanced: [
        {
          title: "Resolve Disputes",
          summary: "Master conflict resolution.",
          content:
            "In 'Disputes,' AI ranks evidence by relevance (messages, files). Pick 'Refund,' 'Dismiss,' or 'Escalate,' then log your reasoning. Resolved cases update user trust scores automatically.",
          media: "video-dispute-masterclass.mp4",
        },
      ],
    },
  },
  {
    category: "Settings",
    icon: <Settings size={22} />,
    tabs: {
      Basics: [
        {
          title: "Customize Notifications",
          summary: "Stay informed your way.",
          content:
            "Under 'Settings > Notifications,' toggle events (disputes, milestones) and pick channels (email, SMS, app). Test alerts live before saving.",
        },
      ],
    },
  },
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Overview");
  const [activeTab, setActiveTab] = useState("Basics");

  const isSearchActive = useMemo(() => searchQuery.length > 0, [searchQuery]);

  // Memoized computations
  const currentCategory = useMemo(
    () => helpData.find((cat) => cat.category === selectedCategory),
    [selectedCategory]
  );

  const allArticles = useMemo(
    () => helpData.flatMap((cat) => Object.values(cat.tabs).flat()),
    []
  );

  const searchResults = useMemo(
    () =>
      allArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [allArticles, searchQuery]
  );

  const filteredArticles = useMemo(
    () =>
      currentCategory?.tabs[activeTab]?.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [currentCategory, activeTab, searchQuery]
  );

  const ArticleCard = ({ article, index }) => (
    <article
      className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-102 opacity-0 animate-fadeIn"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
        {article.title}
      </h3>
      <p className="text-gray-700 font-medium mb-4">{article.summary}</p>
      <p className="text-gray-800 leading-relaxed mb-6">{article.content}</p>
      {article.media && (
        <div className="bg-gray-100 p-6 rounded-xl flex items-center justify-between shadow-inner">
          <div className="flex items-center">
            <Play size={24} className="mr-3 text-[#0c0b45]" />
            <span className="text-gray-800 font-semibold">
              {article.media.includes("video")
                ? "Play Tutorial Video"
                : "View Interactive Screenshot"}
            </span>
          </div>
          <button className="text-[#0c0b45] hover:underline font-medium">
            Open
          </button>
        </div>
      )}
      <button className="mt-6 text-[#0c0b45] font-bold hover:underline flex items-center">
        Explore Further <ChevronRight size={18} className="ml-2" />
      </button>
    </article>
  );

  const TabButton = ({ tab }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`relative px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
        activeTab === tab
          ? "text-[#0c0b45] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-gradient-to-r after:from-[#0c0b45] after:to-[#2a2a8e]"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {tab}
    </button>
  );

  return (
    <div className="min-h-screen text-gray-800 font-sans">
      <header className="sticky top-0 z-30 bg-[#0c0b45] backdrop-blur-xl shadow-xl p-4 border-b border-gray-200/50">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-white flex items-center">
            <HelpCircle size={24} className="mr-2 text-white" />
            Platform Command Center
          </h1>
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search help articles"
            />
            <Search
              size={20}
              className="absolute left-3 top-2.5 text-gray-300 pointer-events-none"
            />
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto mt-8 pb-12">
        {/* Sidebar */}
        <aside className="w-80 bg-white/95 backdrop-blur-xl rounded-l-2xl shadow-2xl p-8 sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto border-r border-gray-200/50">
          <ul className="space-y-4">
            {helpData.map((category) => (
              <li key={category.category}>
                <button
                  onClick={() => {
                    setSelectedCategory(category.category);
                    setActiveTab(Object.keys(category.tabs)[0]);
                    setSearchQuery("");
                  }}
                  className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all duration-300 ${
                    selectedCategory === category.category
                      ? "bg-gradient-to-r from-[#0c0b45] to-[#2a2a8e] text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:shadow-md"
                  }`}
                  aria-label={`Select ${category.category} category`}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-current">{category.icon}</span>
                    <span className="font-bold text-sm uppercase tracking-wider">
                      {category.category}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-current" />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-r-2xl shadow-2xl p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0b45]/5 to-transparent pointer-events-none" />

          {!isSearchActive && (
            <div className="flex border-b border-gray-200/50 mb-8">
              {Object.keys(currentCategory?.tabs || {}).map((tab) => (
                <TabButton key={tab} tab={tab} />
              ))}
            </div>
          )}

          <div className="space-y-10">
            {isSearchActive ? (
              searchResults.length > 0 ? (
                searchResults.map((article, index) => (
                  <ArticleCard key={index} article={article} index={index} />
                ))
              ) : (
                <div className="text-center text-gray-500 py-16">
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )
            ) : filteredArticles?.length > 0 ? (
              filteredArticles.map((article, index) => (
                <ArticleCard key={index} article={article} index={index} />
              ))
            ) : (
              <div className="text-center text-gray-500 py-16">
                <p>No articles found in this section</p>
              </div>
            )}
          </div>

          <footer className="mt-12 text-center">
            <p className="text-gray-600">
              Still need help?{" "}
              <a
                href="mailto:support@yourapp.com"
                className="text-[#0c0b45] font-bold hover:underline flex items-center justify-center"
              >
                <MessageSquare size={20} className="mr-2" />
                Contact Elite Support
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default HelpCenter;
