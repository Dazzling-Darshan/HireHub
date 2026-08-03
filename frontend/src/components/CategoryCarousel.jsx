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
    <div className="py-12 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          Browse by Category
        </h2>
        <Carousel
          className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
          opts={{ align: "start", loop: true, dragFree: false }}
        >
          <CarouselContent className="gap-3 py-2">
            {category.map((cat, index) => (
              <CarouselItem
                key={index}
                className="basis-auto flex justify-center"
              >
                <Button
                  variant="outline"
                  onClick={() => handleCategoryClick(cat)}
                  className="rounded-full px-6 py-5 text-sm font-medium
                             border-border text-foreground bg-card
                             hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105
                             transition-all duration-300 shadow-sm whitespace-nowrap"
                >
                  {cat}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex left-[-50px] border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm" />
          <CarouselNext className="hidden md:flex right-[-50px] border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm" />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryCarousel;