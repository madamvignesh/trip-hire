'use client';

import GradientText from "./components/graphic-text";
import StarBorder from "./components/star-border";
import { useState, useEffect } from "react";
import RotatingText from "./components/rotating-text";
import { MdDeleteOutline } from "react-icons/md";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    localStorage.removeItem("tripChatHistory");
    try {
      const response = await fetch("https://travel-assistant-api.onrender.com/api/chatbot/", {
        method: "GET",
      });
      const data = await response.json();
      setSearchResults(data.reply);
      const finalHistory = [{ role: "assistant", content: data.reply }];
      setSearchHistory(finalHistory);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatContent = (text) => {
    return text.split("* ").map((line, i) => {
      const bolded = line.replace(/\*(.*?)\*/g, '<strong>$1</strong>').replace("*", "");
      return <p key={i} dangerouslySetInnerHTML={{ __html: bolded }} className="text-white mb-3" />;
    });
  };

  const gettSearchResults = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);

    const history = JSON.parse(localStorage.getItem("tripChatHistory") || "[]");
    const updatedHistory = [...history, { role: "user", content: searchQuery }];

    try {
      const res = await fetch("https://travel-assistant-api.onrender.com/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: searchQuery,
          history: updatedHistory,
        }),
      });

      const data = await res.json();
      const finalHistory = [...updatedHistory, { role: "assistant", content: data.reply }];
      setSearchHistory(finalHistory);
      setSearchResults(data.reply);
      localStorage.setItem("tripChatHistory", JSON.stringify(finalHistory));
      setSearchQuery("");
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeSearchHistory = () => {
    localStorage.removeItem("tripChatHistory");
    setSearchHistory([]);
    fetchData();
  };

  return (
    <main>
      <div>
        <div className="text-white flex flex-col justify-center p-5 bg-dark-navy-blue">
          <div className="flex items-center justify-center space-x-1 text-black font-bold w-2/12 text-xl sm:text-2xl md:text-3xl m-auto">
            <span className="text-cyan-200">Trip</span>
            <div className="bg-cyan-200 rounded-lg px-2 py-1">
              <RotatingText
                texts={["Hire", "Planner", "Guide", "Assistant", "Explore"]}
                mainClassName="overflow-hidden"
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                staggerDuration={0.02}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                rotationInterval={2000}
              />
            </div>
          </div>
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class mt-3"
          >
            Where Every Trip Meets Precision
          </GradientText>
        </div>

        <div className="p-3 flex justify-center items-center gap-3">
          <input
            type="text"
            placeholder="Search for a trip"
            className="w-6/12 p-2 rounded-md bg-dark-navy-blue text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <StarBorder
            as="button"
            className="custom-class h-12"
            color="cyan"
            speed="5s"
            onClick={gettSearchResults}
          >
            Get Started
          </StarBorder>
          <button onClick={removeSearchHistory}><MdDeleteOutline size={28} color="#808080"/></button>
        </div>

        <div className="bg-dark-navy-blue overflow-y-auto max-h-[400px] mr-10 ml-10 p-3 rounded-md">
          {searchHistory.map((chat, i) => (
            <div
              className="flex flex-col justify-start items-start p-2 rounded-md"
              key={i}
            >
              <p className="mb-1 text-cyan-200 text-lg">
                <strong>{chat.role === 'user' ? 'User:' : 'Assistant:'}</strong>
              </p>
              {formatContent(chat.content)}
            </div>

          ))}
          {isLoading && (
            <p className="text-center text-cyan-200 animate-pulse">Loading your itinerary...</p>
          )}
        </div>
      </div>
    </main>
  );
}
