import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Sparkles,
  Compass,
  Briefcase,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Send,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import { AI_API_ENDPOINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const SAMPLE_PROMPTS = [
  "How can I transition from React frontend to Full Stack with Node.js?",
  "Which backend engineering roles on the platform match my skills?",
  "What critical skills should I learn to qualify for senior web developer roles?",
  "Find remote engineering positions with high compensation and tell me what they require.",
];

const CareerNavigatorDialog = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = async (promptToUse) => {
    const activeQuery = promptToUse || query;
    if (!activeQuery || !activeQuery.trim()) {
      toast.error("Please enter a career question or goal.");
      return;
    }

    if (!user) {
      toast.error("Please login to use the AI Career Navigator.");
      navigate("/login");
      setOpen(false);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post(
        `${AI_API_ENDPOINT}/career-navigator`,
        { query: activeQuery.trim() },
        { withCredentials: true }
      );

      if (res.data.success && res.data.data) {
        setResult(res.data.data);
      }
    } catch (error) {
      console.error("Career Navigator RAG Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to retrieve career navigation recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectJob = (jobId) => {
    setOpen(false);
    navigate(`/description/${jobId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 shadow-2xl border border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-md shadow-primary/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                AI Career Navigator
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider">
                  Grounded RAG
                </span>
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Powered by Gemini embeddings & vector retrieval across live HireHub requisitions.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Query Input Section */}
        <div className="space-y-4 my-2">
          {/* Sample prompts */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {SAMPLE_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(promptText);
                  handleSearch(promptText);
                }}
                disabled={loading}
                className="text-[11px] px-3 py-1 rounded-full bg-muted/60 hover:bg-primary/10 hover:text-primary hover:border-primary/30 border border-border text-muted-foreground font-medium transition-all text-left cursor-pointer disabled:opacity-50"
              >
                {promptText}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              rows={3}
              placeholder="Ask about your career trajectory, skill gaps, or target roles (e.g. 'I know React and want to learn backend, what jobs fit me?')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              className="w-full rounded-2xl p-4 text-xs sm:text-sm bg-muted/40 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-foreground placeholder:text-muted-foreground"
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <Button
                type="button"
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="h-8 px-4 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{loading ? "Retrieving..." : "Ask Navigator"}</span>
              </Button>
            </div>
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="p-6 rounded-2xl bg-muted/20 border border-border flex flex-col items-center justify-center gap-3 animate-pulse text-center">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Compass className="w-6 h-6 animate-spin" />
              </div>
              <div>
                <p className="font-bold text-foreground text-xs">
                  Running Vector Similarity Retrieval...
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Matching your query with active database requisitions & generating grounded career advice.
                </p>
              </div>
            </div>
          )}

          {/* Results View */}
          {result && (
            <div className="space-y-5 animate-in fade-in slide-in-from-top-3 duration-300">
              {/* Advice Summary */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-violet-500/5 to-indigo-500/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Personalized Career Strategy
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {result.adviceSummary}
                </p>
              </div>

              {/* Skills to Learn / Bridge */}
              {result.skillRecommendations?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" /> High-Impact Skills to Target
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.skillRecommendations.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold shadow-2xs"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Grounded Job Citations */}
              {result.citedJobs?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> Grounded Database Openings ({result.citedJobs.length})
                    </h4>
                    <span className="text-[10px] text-primary font-bold">100% Verified Requisitions</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.citedJobs.map((jobCite, cIdx) => (
                      <div
                        key={cIdx}
                        className="p-3.5 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between hover:border-primary/50 transition-all group"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h5 className="font-bold text-foreground text-xs group-hover:text-primary transition-colors">
                              {jobCite.jobTitle}
                            </h5>
                          </div>
                          <p className="text-[11px] text-muted-foreground font-medium mt-0.5 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> {jobCite.companyName}
                          </p>

                          <p className="text-[11px] text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                            {jobCite.relevanceExplanation}
                          </p>

                          {jobCite.matchingSkills?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2.5">
                              {jobCite.matchingSkills.map((ms, mIdx) => (
                                <span
                                  key={mIdx}
                                  className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-foreground font-medium border border-border"
                                >
                                  {ms}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectJob(jobCite.jobId)}
                          className="mt-3 w-full py-1.5 px-3 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>View Job Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CareerNavigatorDialog;
