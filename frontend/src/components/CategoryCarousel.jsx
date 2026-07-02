import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const category = [
  "Frontend Developer",
  "Backend Developer",
  "Cloud Architect",
  "Full Stack Developer",
  "Data Engineer",
  "ML Engineer",
  "DevOps Engineer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryClick = (cat) => {
    dispatch(setSearchedQuery(cat));
    navigate("/browse");
  };

  return (
    <div className="py-10 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center text-sm font-semibold text-[#64748B] uppercase tracking-widest mb-6">
          Browse by Category
        </h2>
        <Carousel
          className="w-full"
          opts={{ align: "start", loop: true, dragFree: false }}
        >
          <CarouselContent className="gap-3">
            {category.map((cat, index) => (
              <CarouselItem
                key={index}
                className="basis-auto flex justify-center"
              >
                <Button
                  variant="outline"
                  onClick={() => handleCategoryClick(cat)}
                  className="rounded-full px-5 py-2 text-sm font-medium
                             border-[#E2E8F0] text-[#0F172A] bg-white
                             hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB]
                             transition-all duration-200 shadow-sm whitespace-nowrap"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-40px] border-[#E2E8F0] hover:bg-[#F8FAFC] transition" />
          <CarouselNext className="right-[-40px] border-[#E2E8F0] hover:bg-[#F8FAFC] transition" />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryCarousel;